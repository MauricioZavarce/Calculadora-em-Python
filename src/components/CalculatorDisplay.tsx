import React, { useState } from 'react';
import { Copy, Check, CornerDownLeft } from 'lucide-react';
import { AngleMode, CalculatorMode } from '../types';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  pythonSyntax: string;
  error?: string;
  mode: CalculatorMode;
  angleMode: AngleMode;
  memoryValue: number;
  onAngleModeToggle: () => void;
  onClearMemory: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  pythonSyntax,
  error,
  mode,
  angleMode,
  memoryValue,
  onAngleModeToggle,
  onClearMemory,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = result && result !== '0' ? result : expression;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4 shadow-xl relative overflow-hidden transition-all">
      {/* Top Status Bar: Clean Unboxed Metadata */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold tracking-wider uppercase">Python 3.12</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{mode === 'padrao' ? 'Padrão' : mode === 'cientifica' ? 'Científica' : mode === 'programador' ? 'Programador' : 'Expressão'}</span>
          {mode === 'cientifica' && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <button
                type="button"
                onClick={onAngleModeToggle}
                className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer transition-colors"
                title="Alternar entre Graus (DEG) e Radianos (RAD)"
              >
                {angleMode.toUpperCase()}
              </button>
            </>
          )}
        </div>

        {/* Memory Indicator */}
        <div className="flex items-center gap-2">
          {memoryValue !== 0 && (
            <button
              type="button"
              onClick={onClearMemory}
              title="Clique para limpar memória (MC)"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>M = {memoryValue.toLocaleString('pt-BR')}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ml-1"
            title="Copiar resultado"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      {/* Expression input trail */}
      <div className="min-h-7 text-right text-slate-400 text-sm font-mono tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none">
        {expression || '\u00A0'}
      </div>

      {/* Main Primary Result Display */}
      <div className="flex items-baseline justify-end gap-2 mt-1">
        {error ? (
          <div className="text-rose-400 text-base md:text-lg font-mono font-medium py-1 px-2 text-right">
            {error}
          </div>
        ) : (
          <div className="text-3xl md:text-4xl lg:text-5xl font-mono font-bold text-white tracking-tight tabular-nums text-right break-all">
            {result || '0'}
          </div>
        )}
      </div>

      {/* Python Syntax Equivalency Footer */}
      {pythonSyntax && (
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sky-400 select-none">&gt;&gt;&gt;</span>
            <span className="truncate text-slate-300">{pythonSyntax}</span>
          </div>
          <span className="text-slate-500 shrink-0 ml-2 flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3 text-slate-500" />
            Python
          </span>
        </div>
      )}
    </div>
  );
};
