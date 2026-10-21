import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator as CalcIcon,
  Code2,
  Terminal as TerminalIcon,
  BookOpen,
  Download,
  Sparkles,
} from 'lucide-react';
import { CalculatorMode, AngleMode, CalculationHistoryItem } from './types';
import { evaluatePythonExpression } from './services/pythonRunner';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { Keypad } from './components/Keypad';
import { FreeExpressionBar } from './components/FreeExpressionBar';
import { HistoryPanel } from './components/HistoryPanel';
import { CodeHub } from './components/CodeHub';
import { PythonTerminal } from './components/PythonTerminal';
import { PythonGuide } from './components/PythonGuide';
import { PYTHON_SCRIPTS } from './data/pythonCodes';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculadora' | 'codigos' | 'terminal' | 'guia'>('calculadora');
  const [mode, setMode] = useState<CalculatorMode>('padrao');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');

  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [pythonSyntax, setPythonSyntax] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);

  // State to pass script into terminal when user clicks "Executar no Navegador"
  const [terminalScript, setTerminalScript] = useState<{ code: string; title: string } | undefined>(undefined);

  // Perform calculation
  const handleCalculate = useCallback((exprToCalc?: string) => {
    const targetExpr = exprToCalc !== undefined ? exprToCalc : expression;
    if (!targetExpr.trim()) return;

    const evaluation = evaluatePythonExpression(targetExpr, angleMode);

    if (evaluation.error) {
      setError(evaluation.error);
      setResult('Erro');
      setPythonSyntax(evaluation.pythonCode);
    } else {
      setError(undefined);
      setResult(evaluation.result);
      setPythonSyntax(evaluation.pythonCode);

      // Add to history
      const historyItem: CalculationHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        expression: targetExpr,
        pythonSyntax: evaluation.pythonCode,
        result: evaluation.result,
        timestamp: Date.now(),
        mode,
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 50));
    }
  }, [expression, angleMode, mode]);

  // Keypad inputs
  const handleNumber = useCallback((num: string) => {
    setError(undefined);
    setExpression((prev) => {
      if (prev === '0' && num !== '.') return num;
      return prev + num;
    });
  }, []);

  const handleOperator = useCallback((op: string) => {
    setError(undefined);
    setExpression((prev) => {
      if (!prev && (op === '-' || op === '(')) return op;
      if (!prev) return '';
      // avoid double consecutive operators unless parenthesized or negative
      if (/[\+\-\*\/%]$/.test(prev) && op !== '(' && op !== '-') {
        return prev.slice(0, -1) + op;
      }
      return `${prev} ${op} `;
    });
  }, []);

  const handleFunction = useCallback((fn: string) => {
    setError(undefined);
    if (fn === 'sqr') {
      // Square current expression or result
      if (result && result !== '0' && !expression) {
        setExpression(`(${result}) ** 2`);
        handleCalculate(`(${result}) ** 2`);
      } else if (expression) {
        setExpression((prev) => `(${prev}) ** 2`);
      }
    } else if (fn === 'bin' || fn === 'hex' || fn === 'oct') {
      const targetVal = result && result !== '0' && !expression ? result : expression || '0';
      const num = parseInt(targetVal, 10);
      if (!Number.isNaN(num)) {
        let converted = '';
        if (fn === 'bin') converted = `0b${num.toString(2)}`;
        if (fn === 'hex') converted = `0x${num.toString(16).toUpperCase()}`;
        if (fn === 'oct') converted = `0o${num.toString(8)}`;
        setResult(converted);
        setPythonSyntax(`${fn}(${num})`);
      } else {
        setError(`ValueError: não é possível converter para ${fn}`);
      }
    } else {
      // standard unary functions like sin, cos, tan, sqrt, ln, log10, factorial
      setExpression((prev) => {
        if (!prev || prev === '0') return `${fn}(`;
        return `${prev} ${fn}(`;
      });
    }
  }, [expression, result, handleCalculate]);

  const handleClear = useCallback(() => {
    setExpression('');
    setResult('0');
    setPythonSyntax('');
    setError(undefined);
  }, []);

  const handleDelete = useCallback(() => {
    setError(undefined);
    setExpression((prev) => {
      const trimmed = prev.trimEnd();
      if (!trimmed) return '';
      return trimmed.slice(0, -1).trimEnd();
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    if (!expression && result && result !== '0') {
      const num = parseFloat(result);
      if (!Number.isNaN(num)) {
        const toggled = (-num).toString();
        setResult(toggled);
        setPythonSyntax(`-${num}`);
      }
      return;
    }

    setExpression((prev) => {
      if (!prev) return '-';
      if (prev.startsWith('-(') && prev.endsWith(')')) {
        return prev.slice(2, -1);
      }
      return `-(${prev})`;
    });
  }, [expression, result]);

  const handleDecimal = useCallback(() => {
    setError(undefined);
    setExpression((prev) => {
      if (!prev) return '0.';
      const tokens = prev.split(/[\+\-\*\/\s\(\)]+/);
      const lastToken = tokens[tokens.length - 1];
      if (lastToken.includes('.')) return prev;
      return `${prev}.`;
    });
  }, []);

  const handleMemoryAction = useCallback((action: 'MC' | 'MR' | 'M+' | 'M-') => {
    const currentNum = parseFloat(result) || 0;
    if (action === 'MC') {
      setMemoryValue(0);
    } else if (action === 'MR') {
      setExpression((prev) => `${prev} ${memoryValue}`.trim());
    } else if (action === 'M+') {
      setMemoryValue((prev) => prev + currentNum);
    } else if (action === 'M-') {
      setMemoryValue((prev) => prev - currentNum);
    }
  }, [result, memoryValue]);

  // Physical Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in terminal or an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleDecimal();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === '(' || e.key === ')') {
        handleOperator(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleDecimal, handleCalculate, handleDelete, handleClear]);

  // History reuse
  const handleReuseHistory = (item: CalculationHistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setPythonSyntax(item.pythonSyntax);
    setError(undefined);
  };

  // Launch script from CodeHub into Terminal tab
  const handleRunScriptInTerminal = (scriptCode: string, scriptTitle: string) => {
    setTerminalScript({ code: scriptCode, title: scriptTitle });
    setActiveTab('terminal');
  };

  // 1-Click Download all 4 Python files as a bundle
  const handleDownloadAllScripts = () => {
    PYTHON_SCRIPTS.forEach((script) => {
      const blob = new Blob([script.code], { type: 'text/x-python;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = script.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 nav links) — Zone 3 (1 primary CTA) */}
      <header className="flex items-center justify-between gap-8 px-6 lg:px-10 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-base shadow-sm">
            Py
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            PyCalc
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={() => setActiveTab('calculadora')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'calculadora'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Calculadora
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('calculadora');
              setMode('expressao');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'calculadora' && mode === 'expressao'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Expressão Livre
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('codigos')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'codigos'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Códigos Python
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'terminal'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Terminal REPL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guia')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'guia'
                ? 'text-amber-400 font-semibold'
                : 'hover:text-white text-slate-400'
            }`}
          >
            Guia de Instalação
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDownloadAllScripts}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-[0.98]"
            title="Baixar arquivos .py para executar no seu computador"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar Códigos .py</span>
            <span className="sm:hidden">Baixar</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Hero Concept & Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-900">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Calculadora em Python
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5 font-mono">
              <span>Sintaxe Python 3</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Motor Matemático em Tempo Real</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Tkinter GUI, CLI e OOP</span>
            </div>
          </div>

          {/* Mode Switcher (Visible on Calculadora Tab) */}
          {activeTab === 'calculadora' && (
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('padrao')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'padrao'
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Padrão
              </button>
              <button
                type="button"
                onClick={() => setMode('cientifica')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'cientifica'
                    ? 'bg-slate-800 text-sky-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Científica
              </button>
              <button
                type="button"
                onClick={() => setMode('programador')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'programador'
                    ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Programador
              </button>
              <button
                type="button"
                onClick={() => setMode('expressao')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  mode === 'expressao'
                    ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Expressão Livre
              </button>
            </div>
          )}
        </div>

        {/* Tab Content Routing */}
        {activeTab === 'calculadora' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Zone: Calculator Stage (Keypad + Display) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* Main Display */}
              <CalculatorDisplay
                expression={expression}
                result={result}
                pythonSyntax={pythonSyntax}
                error={error}
                mode={mode}
                angleMode={angleMode}
                memoryValue={memoryValue}
                onAngleModeToggle={() => setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'))}
                onClearMemory={() => setMemoryValue(0)}
              />

              {/* Free expression input if in that mode */}
              {mode === 'expressao' && (
                <FreeExpressionBar
                  onExecute={(expr) => {
                    setExpression(expr);
                    handleCalculate(expr);
                  }}
                />
              )}

              {/* Interactive Keypad */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <Keypad
                  mode={mode}
                  onNumber={handleNumber}
                  onOperator={handleOperator}
                  onFunction={handleFunction}
                  onClear={handleClear}
                  onDelete={handleDelete}
                  onEqual={() => handleCalculate()}
                  onToggleSign={handleToggleSign}
                  onDecimal={handleDecimal}
                  onMemoryAction={handleMemoryAction}
                />
              </div>

              {/* Educational Python Math Syntax Note */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-semibold">&gt;&gt;&gt; Dica Python:</span>
                  <span>Use ** para potências (ex: 2 ** 8 = 256) e // para divisão inteira (ex: 7 // 2 = 3).</span>
                </div>
                <span className="text-slate-600 hidden sm:inline">Teclado numérico ativo</span>
              </div>
            </div>

            {/* Right Zone: History & Quick Python Test Panel */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <HistoryPanel
                history={history}
                onSelect={handleReuseHistory}
                onClear={() => setHistory([])}
              />

              {/* Quick Jump to Python Code Scripts */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-200">
                    Quer o código para rodar no seu PC?
                  </span>
                  <Code2 className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Criamos 4 versões em Python puro: CLI para terminal, Interface Gráfica com Tkinter, Orientada a Objetos com testes e Científica.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('codigos')}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors cursor-pointer border border-slate-700 text-center"
                  >
                    Ver Códigos-Fonte
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('terminal')}
                    className="flex-1 py-2 px-3 bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 text-xs font-medium rounded-xl transition-colors cursor-pointer border border-sky-500/30 text-center"
                  >
                    Testar no Terminal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Codes Tab */}
        {activeTab === 'codigos' && (
          <CodeHub onRunScriptInTerminal={handleRunScriptInTerminal} />
        )}

        {/* In-Browser Python Terminal REPL */}
        {activeTab === 'terminal' && (
          <PythonTerminal
            initialCode={terminalScript?.code}
            initialTitle={terminalScript?.title}
          />
        )}

        {/* Practical Guide Tab */}
        {activeTab === 'guia' && <PythonGuide />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 px-6 lg:px-10 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <span>PyCalc</span>
          <span aria-hidden="true">·</span>
          <span>Calculadora em Python 3</span>
          <span aria-hidden="true">·</span>
          <span>PEP 8 Compliant</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('guia')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Instalação e Dicas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('codigos')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            4 Scripts Python
          </button>
        </div>
      </footer>
    </div>
  );
}
