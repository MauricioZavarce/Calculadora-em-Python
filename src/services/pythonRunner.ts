import { AngleMode } from '../types';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL?: string }) => Promise<any>;
    _pyodideInstance?: any;
    _pyodideLoading?: Promise<any>;
  }
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  returnValue?: string;
  durationMs: number;
}

/**
 * Evaluates a single math expression following Python semantics.
 * Handles **, //, %, math functions, constants, etc.
 */
export function evaluatePythonExpression(
  expression: string,
  angleMode: AngleMode = 'deg'
): { result: string; pythonCode: string; error?: string } {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { result: '0', pythonCode: '' };
  }

  // Pre-process expression to match Python semantics
  let pyExpr = trimmed;

  // Replace unicode symbols with Python equivalents
  pyExpr = pyExpr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\^/g, '**');

  try {
    // If Pyodide is already loaded, we can run it via Pyodide for 100% exact Python!
    if (window._pyodideInstance) {
      const code = `
import math
import statistics

_angle_mode = "${angleMode}"
def _sin(x): return math.sin(math.radians(x) if _angle_mode == "deg" else x)
def _cos(x): return math.cos(math.radians(x) if _angle_mode == "deg" else x)
def _tan(x): return math.tan(math.radians(x) if _angle_mode == "deg" else x)
def _asin(x): 
    r = math.asin(x)
    return math.degrees(r) if _angle_mode == "deg" else r
def _acos(x):
    r = math.acos(x)
    return math.degrees(r) if _angle_mode == "deg" else r
def _atan(x):
    r = math.atan(x)
    return math.degrees(r) if _angle_mode == "deg" else r

res = (${pyExpr})
str(res)
`;
      const res = window._pyodideInstance.runPython(code);
      return { result: String(res), pythonCode: pyExpr };
    }

    // High-performance direct JS engine with Python semantics
    const sandboxMath = {
      pi: Math.PI,
      e: Math.E,
      tau: Math.PI * 2,
      sqrt: (x: number) => {
        if (x < 0) throw new Error('math domain error: raiz de número negativo');
        return Math.sqrt(x);
      },
      sin: (x: number) => Math.sin(angleMode === 'deg' ? (x * Math.PI) / 180 : x),
      cos: (x: number) => Math.cos(angleMode === 'deg' ? (x * Math.PI) / 180 : x),
      tan: (x: number) => {
        if (angleMode === 'deg' && Math.abs(x % 180) === 90) throw new Error('Tangente indefinida para 90°');
        return Math.tan(angleMode === 'deg' ? (x * Math.PI) / 180 : x);
      },
      asin: (x: number) => {
        const rad = Math.asin(x);
        return angleMode === 'deg' ? (rad * 180) / Math.PI : rad;
      },
      acos: (x: number) => {
        const rad = Math.acos(x);
        return angleMode === 'deg' ? (rad * 180) / Math.PI : rad;
      },
      atan: (x: number) => {
        const rad = Math.atan(x);
        return angleMode === 'deg' ? (rad * 180) / Math.PI : rad;
      },
      log: (x: number) => {
        if (x <= 0) throw new Error('math domain error: ln de x <= 0');
        return Math.log(x);
      },
      log10: (x: number) => {
        if (x <= 0) throw new Error('math domain error: log10 de x <= 0');
        return Math.log10(x);
      },
      log2: (x: number) => {
        if (x <= 0) throw new Error('math domain error: log2 de x <= 0');
        return Math.log2(x);
      },
      exp: (x: number) => Math.exp(x),
      abs: (x: number) => Math.abs(x),
      round: (x: number, n: number = 0) => {
        const factor = Math.pow(10, n);
        return Math.round(x * factor) / factor;
      },
      floor: (x: number) => Math.floor(x),
      ceil: (x: number) => Math.ceil(x),
      factorial: (n: number) => {
        if (n < 0 || !Number.isInteger(n)) throw new Error('Fatorial aceita apenas inteiros ≥ 0');
        if (n > 170) throw new Error('Overflow: resultado excede precisão numérica');
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
      },
      comb: (n: number, k: number) => {
        if (k < 0 || k > n) return 0;
        let r = 1;
        for (let i = 1; i <= k; i++) {
          r = (r * (n - i + 1)) / i;
        }
        return Math.round(r);
      },
      sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0),
    };

    // Transform Python // (integer division) into Math.floor(a / b)
    // and python syntax like math.sqrt -> sqrt, math.pi -> pi
    let jsExpr = pyExpr
      .replace(/math\./g, '')
      .replace(/(\b\d+(\.\d+)?|\b[a-zA-Z_]\w*|\([^)]+\))\s*\/\/\s*(\b\d+(\.\d+)?|\b[a-zA-Z_]\w*|\([^)]+\))/g, 'Math.floor(($1) / ($3))');

    // Create function with sandbox
    const scopeKeys = Object.keys(sandboxMath);
    const scopeVals = Object.values(sandboxMath);

    // Check for division by zero
    if (/\/\s*0(?![.\d])/.test(jsExpr)) {
      throw new Error('ZeroDivisionError: divisão por zero não permitida');
    }

    const fn = new Function(...scopeKeys, `"use strict"; return (${jsExpr});`);
    const val = fn(...scopeVals);

    let formattedResult = '';
    if (typeof val === 'number') {
      if (Number.isNaN(val)) throw new Error('Resultado indefinido (NaN)');
      if (!Number.isFinite(val)) throw new Error('ZeroDivisionError: divisão por zero');
      // Format cleanly
      if (Number.isInteger(val)) {
        formattedResult = val.toString();
      } else {
        // limit floating point imprecision (e.g. 0.1 + 0.2 = 0.3)
        const rounded = parseFloat(val.toFixed(10));
        formattedResult = rounded.toString();
      }
    } else if (typeof val === 'bigint') {
      formattedResult = val.toString();
    } else if (Array.isArray(val)) {
      formattedResult = `[${val.join(', ')}]`;
    } else {
      formattedResult = String(val);
    }

    return {
      result: formattedResult,
      pythonCode: pyExpr,
    };
  } catch (err: any) {
    let msg = err.message || 'Erro de sintaxe';
    if (msg.includes('is not defined')) {
      msg = `NameError: ${msg}`;
    }
    return {
      result: 'Erro',
      pythonCode: pyExpr,
      error: msg,
    };
  }
}

/**
 * Loads Pyodide in the browser dynamically.
 */
export async function initPyodide(
  onProgress?: (status: string) => void
): Promise<any> {
  if (window._pyodideInstance) {
    return window._pyodideInstance;
  }
  if (window._pyodideLoading) {
    return window._pyodideLoading;
  }

  window._pyodideLoading = (async () => {
    onProgress?.('Carregando biblioteca WebAssembly Pyodide...');
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Falha ao baixar script Pyodide'));
        document.head.appendChild(script);
      });
    }

    onProgress?.('Inicializando interpretador Python 3.12...');
    const pyodide = await window.loadPyodide!({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    });

    onProgress?.('Pronto!');
    window._pyodideInstance = pyodide;
    return pyodide;
  })();

  return window._pyodideLoading;
}

/**
 * Runs a complete Python script or code block, capturing stdout and stderr.
 */
export async function runPythonCode(
  code: string,
  onProgress?: (status: string) => void
): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    const pyodide = await initPyodide(onProgress);

    // Setup stdout capture
    pyodide.runPython(`
import sys
import io

_captured_stdout = io.StringIO()
_captured_stderr = io.StringIO()
sys.stdout = _captured_stdout
sys.stderr = _captured_stderr
`);

    let returnedVal: any;
    try {
      returnedVal = pyodide.runPython(code);
    } catch (execErr: any) {
      const errOut = pyodide.runPython(`_captured_stderr.getvalue()`);
      const stdOut = pyodide.runPython(`_captured_stdout.getvalue()`);
      const fullError = errOut || execErr.message || 'Erro durante execução do script';
      const durationMs = Math.round(performance.now() - startTime);

      return {
        success: false,
        output: (stdOut ? stdOut + '\n' : '') + fullError,
        durationMs,
      };
    }

    const stdOut = pyodide.runPython(`_captured_stdout.getvalue()`);
    const durationMs = Math.round(performance.now() - startTime);

    let formattedReturn: string | undefined = undefined;
    if (returnedVal !== undefined && returnedVal !== null) {
      formattedReturn = String(returnedVal);
    }

    let finalOutput = stdOut;
    if (!finalOutput && formattedReturn !== undefined) {
      finalOutput = `>>> ${formattedReturn}`;
    } else if (!finalOutput) {
      finalOutput = '(Executado com sucesso sem saída de terminal)';
    }

    return {
      success: true,
      output: finalOutput,
      returnValue: formattedReturn,
      durationMs,
    };
  } catch (err: any) {
    const durationMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      output: `Erro ao inicializar Python no navegador: ${err.message || err}`,
      durationMs,
    };
  }
}
