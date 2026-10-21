import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Terminal, Trash2, Check, Copy, Clock, AlertTriangle } from 'lucide-react';
import { runPythonCode, ExecutionResult } from '../services/pythonRunner';

interface PythonTerminalProps {
  initialCode?: string;
  initialTitle?: string;
}

const PRESET_SCRIPTS: Record<string, { title: string; code: string }> = {
  oop: {
    title: 'Testes Unitários & Classe Calculadora',
    code: `import math
import unittest

class Calculadora:
    def somar(self, a, b): return a + b
    def subtrair(self, a, b): return a - b
    def multiplicar(self, a, b): return a * b
    def dividir(self, a, b):
        if b == 0: raise ZeroDivisionError("Divisao por zero!")
        return a / b
    def potencia(self, a, b): return a ** b
    def raiz(self, a):
        if a < 0: raise ValueError("Raiz de negativo nao permitida")
        return math.sqrt(a)

calc = Calculadora()
print("--- TESTES RAPIDOS ---")
print(f"10 + 25 = {calc.somar(10, 25)}")
print(f"50 - 18 = {calc.subtrair(50, 18)}")
print(f"7 * 8   = {calc.multiplicar(7, 8)}")
print(f"100 / 4 = {calc.dividir(100, 4)}")
print(f"2 ** 10 = {calc.potencia(2, 10)}")
print(f"sqrt(81)= {calc.raiz(81)}")

print("\\n--- TRATAMENTO DE ERROS (TRY/EXCEPT) ---")
try:
    calc.dividir(10, 0)
except ZeroDivisionError as err:
    print(f"Capturado com sucesso: {err}")
`,
  },
  stats: {
    title: 'Cálculos Científicos e Estatísticos',
    code: `import math
import statistics

valores = [14.5, 18.2, 12.0, 22.8, 19.4, 15.1, 21.0]

print("=== MODULO MATH ===")
print(f"Pi: {math.pi:.6f}")
print(f"Euler (e): {math.e:.6f}")
print(f"Seno de 45°: {math.sin(math.radians(45)):.4f}")
print(f"Logaritmo na base 10 de 1000: {math.log10(1000)}")
print(f"Fatorial de 7 (7!): {math.factorial(7)}")
print(f"Combinacao C(10, 3): {math.comb(10, 3)}")

print("\\n=== MODULO STATISTICS ===")
print(f"Amostra: {valores}")
print(f"Media aritmetica: {statistics.mean(valores):.2f}")
print(f"Mediana:          {statistics.median(valores):.2f}")
print(f"Desvio padrao:    {statistics.stdev(valores):.2f}")
print(f"Valor maximo:     {max(valores)}")
print(f"Valor minimo:     {min(valores)}")
`,
  },
  comprehension: {
    title: 'Operadores Python & List Comprehensions',
    code: `# Demonstracao de operadores exclusivos do Python
a, b = 25, 4

print(f"Divisao real:    {a} / {b}  = {a / b}")
print(f"Divisao inteira: {a} // {b} = {a // b}")
print(f"Resto (modulo):  {a} % {b}  = {a % b}")
print(f"Potenciacao:     {a} ** 3   = {a ** 3}")

# Gerando listas com calculos
quadrados = [x**2 for x in range(1, 11)]
print(f"\\nQuadrados de 1 a 10: {quadrados}")

pares = [x for x in quadrados if x % 2 == 0]
print(f"Apenas os pares:     {pares}")
`,
  },
};

export const PythonTerminal: React.FC<PythonTerminalProps> = ({
  initialCode,
  initialTitle,
}) => {
  const [code, setCode] = useState<string>(initialCode || PRESET_SCRIPTS.oop.code);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [lastDuration, setLastDuration] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setStatusMsg('Executando Python...');
    setOutput('Aguarde... conectando ao interpretador Python.');

    const result: ExecutionResult = await runPythonCode(code, (status) => {
      setStatusMsg(status);
    });

    setOutput(result.output);
    setLastDuration(result.durationMs);
    setIsRunning(false);
    setStatusMsg('');
  };

  const handleSelectPreset = (key: string) => {
    const preset = PRESET_SCRIPTS[key];
    if (preset) {
      setCode(preset.code);
    }
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Terminal Python no Navegador
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Execute códigos Python reais com <code className="text-sky-300">Pyodide (WebAssembly)</code> diretamente no seu navegador, sem instalar nada.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-mono">Exemplos:</span>
          {Object.entries(PRESET_SCRIPTS).map(([key, script]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectPreset(key)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700/60"
            >
              {script.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Output Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Python Code Editor */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="text-sky-400 font-semibold">editor.py</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCode('')}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Limpar editor"
              >
                Limpar
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-80 p-4 bg-transparent font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed selection:bg-amber-400 selection:text-slate-950"
            placeholder="# Digite seu código Python aqui e clique em Executar..."
          />

          <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              {statusMsg || 'Pronto para rodar'}
            </span>
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-400/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Executando...' : 'Executar Python (Run)'}</span>
            </button>
          </div>
        </div>

        {/* Right: Terminal Output Window */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">stdout / terminal</span>
              {lastDuration !== null && (
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lastDuration}ms
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {output && (
                <button
                  type="button"
                  onClick={handleCopyOutput}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  title="Copiar saída"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setOutput('')}
                className="text-slate-500 hover:text-rose-400 transition-colors"
                title="Limpar terminal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full h-80 p-4 font-mono text-xs overflow-y-auto scrollbar-thin">
            {!output ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center">
                <Terminal className="w-8 h-8 mb-2 opacity-30 text-slate-500" />
                <p>Nenhuma saída gerada ainda.</p>
                <p className="text-[11px] mt-1 text-slate-700">
                  Clique em "Executar Python" para ver o resultado do seu script.
                </p>
              </div>
            ) : (
              <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            )}
          </div>

          <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Python 3.12 WebAssembly REPL</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
};
