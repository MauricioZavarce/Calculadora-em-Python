import React, { useState } from 'react';
import { Play, CornerDownLeft, Sparkles } from 'lucide-react';

interface FreeExpressionBarProps {
  onExecute: (expression: string) => void;
  isLoading?: boolean;
}

const EXAMPLES = [
  '2 ** 16',
  'math.sqrt(144) + math.pow(3, 4)',
  'math.factorial(7)',
  'sum([15, 27, 43, 98])',
  'math.comb(10, 3)',
  'round(355 / 113, 6)',
  '[x**2 for x in range(1, 6)]',
  'bin(255)',
  'hex(4096)',
];

export const FreeExpressionBar: React.FC<FreeExpressionBarProps> = ({
  onExecute,
  isLoading = false,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onExecute(inputVal);
  };

  const handleSelectExample = (ex: string) => {
    setInputVal(ex);
    onExecute(ex);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Expressão Livre em Python</span>
        </div>
        <span className="text-slate-500 font-mono">Pressione Enter</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-sky-400 select-none pointer-events-none">
            &gt;&gt;&gt;
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ex: 2 ** 10, math.sqrt(256), sum([1, 2, 3, 4])"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-3 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Calcular</span>
        </button>
      </form>

      {/* Suggested quick examples */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 shrink-0 font-medium mr-1">Sugestões:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => handleSelectExample(ex)}
            className="shrink-0 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-mono text-[11px] transition-colors cursor-pointer border border-slate-700/50"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
};
