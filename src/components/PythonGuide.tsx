import React from 'react';
import { Terminal, ShieldAlert, Cpu, Sparkles, BookOpen, Layers } from 'lucide-react';

export const PythonGuide: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
        <BookOpen className="w-5 h-5 text-sky-400" />
        <h2 className="text-xl font-bold text-white tracking-tight">
          Guia Prático: Como Construir e Rodar no Computador
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Step 1: Como Rodar */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-2">
              <Terminal className="w-4 h-4" />
              <span>1. Como rodar no terminal</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Baixe o arquivo <code className="text-sky-300">.py</code> da aba Códigos ou crie um arquivo local no seu editor (VS Code, PyCharm).
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
              <div className="text-slate-500"># Verifique a versão do Python</div>
              <div>python --version</div>
              <div className="text-slate-500 mt-1"># Execute o script baixado</div>
              <div className="text-emerald-400">python calculadora_terminal.py</div>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-3 block">
            Funciona em Windows, macOS e distribuições Linux.
          </span>
        </div>

        {/* Step 2: Tratamento de Erros */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-400 mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>2. Tratamento de Exceções</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Em Python, divisão por zero ou entradas não numéricas geram erros em tempo de execução se não tratadas com <code className="text-sky-300">try...except</code>.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-slate-300 space-y-0.5 border border-slate-800">
              <span className="text-amber-400">try</span>:
              <div className="pl-3 text-slate-300">resultado = num1 / num2</div>
              <span className="text-amber-400">except</span> <span className="text-rose-400">ZeroDivisionError</span>:
              <div className="pl-3 text-slate-400">print("Divisão por zero!")</div>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-3 block">
            Garante que o programa nunca feche abruptamente.
          </span>
        </div>

        {/* Step 3: Operadores Especiais do Python */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-2">
              <Cpu className="w-4 h-4" />
              <span>3. Operadores Nativos Python</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Python possui operadores matemáticos integrados muito mais limpos que outras linguagens:
            </p>
            <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] space-y-1 border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>2 ** 8</span>
                <span className="text-slate-500"># Potência (256)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>17 // 5</span>
                <span className="text-slate-500"># Div. inteira (3)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>17 % 5</span>
                <span className="text-slate-500"># Módulo/resto (2)</span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 mt-3 block">
            Sem necessidade de bibliotecas para operações básicas.
          </span>
        </div>
      </div>
    </div>
  );
};
