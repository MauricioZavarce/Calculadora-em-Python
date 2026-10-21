import React, { useState } from 'react';
import { Copy, Check, Download, Play, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { PYTHON_SCRIPTS } from '../data/pythonCodes';
import { PythonScript } from '../types';

interface CodeHubProps {
  onRunScriptInTerminal: (code: string, scriptTitle: string) => void;
}

export const CodeHub: React.FC<CodeHubProps> = ({ onRunScriptInTerminal }) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>(PYTHON_SCRIPTS[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const activeScript: PythonScript =
    PYTHON_SCRIPTS.find((s) => s.id === selectedScriptId) || PYTHON_SCRIPTS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeScript.code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeScript.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRun = () => {
    onRunScriptInTerminal(activeScript.code, activeScript.title);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      {/* Header and Script Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Códigos-Fonte em Python
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>4 implementações completas</span>
            <span aria-hidden="true">·</span>
            <span>Prontas para rodar no seu computador ou no terminal integrado</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRun}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-amber-400/20"
            title="Executar este código Python no navegador"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Executar no Navegador</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 hover:text-sky-300 font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-sky-500/30"
            title="Baixar arquivo .py"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar {activeScript.filename}</span>
          </button>
        </div>
      </div>

      {/* Script Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 my-4">
        {PYTHON_SCRIPTS.map((script) => {
          const isSelected = script.id === selectedScriptId;
          return (
            <button
              key={script.id}
              type="button"
              onClick={() => setSelectedScriptId(script.id)}
              className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-sky-500/60 shadow-md'
                  : 'bg-slate-950/60 hover:bg-slate-800/50 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className={isSelected ? 'text-amber-400 font-semibold' : 'text-slate-500'}>
                  {script.category}
                </span>
                <span className="text-slate-500">{script.difficulty}</span>
              </div>
              <p
                className={`text-sm font-semibold truncate ${
                  isSelected ? 'text-white' : 'text-slate-300'
                }`}
              >
                {script.title}
              </p>
              <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                {script.filename}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Script Details & Key Features */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          {activeScript.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300 font-mono">
          {activeScript.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Display with Syntax Box */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
        {/* Editor Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">Python</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>{activeScript.filename}</span>
          </div>
          <span className="text-slate-500 text-[11px]">
            {activeScript.code.split('\n').length} linhas
          </span>
        </div>

        {/* Code Content */}
        <div className="max-h-[460px] overflow-y-auto p-4 scrollbar-thin">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
            {activeScript.code}
          </pre>
        </div>
      </div>
    </div>
  );
};
