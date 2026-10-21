import React from 'react';
import { History, Trash2, ArrowUpRight, Copy, Check, Download } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface HistoryPanelProps {
  history: CalculationHistoryItem[];
  onSelect: (item: CalculationHistoryItem) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportTxt = () => {
    if (!history.length) return;
    const lines = [
      '# Histórico de Cálculos - PyCalc',
      `# Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '',
      ...history.map((h, i) => `${i + 1}. ${h.expression} = ${h.result} (Python: ${h.pythonSyntax})`),
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_calculos_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <History className="w-4 h-4 text-sky-400" />
          <span>Histórico</span>
          <span className="text-xs text-slate-500 font-mono">({history.length})</span>
        </div>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportTxt}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                title="Exportar histórico como TXT"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClear}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Limpar histórico"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
        {history.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center text-slate-500 text-xs px-4">
            <History className="w-8 h-8 mb-2 opacity-30" />
            <p className="font-medium text-slate-400">Nenhum cálculo recente</p>
            <p className="mt-1 text-slate-600">
              Seus cálculos com operações e códigos Python aparecerão aqui.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-mono text-slate-400 truncate max-w-[180px]">
                  {item.expression}
                </span>
                <span className="text-[10px] text-slate-600 font-mono shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="text-base font-mono font-bold text-white tabular-nums truncate">
                  = {item.result}
                </span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.result)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title="Copiar resultado"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="p-1 text-sky-400 hover:text-sky-300 rounded hover:bg-slate-800 transition-colors"
                    title="Reutilizar cálculo"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {item.pythonSyntax && (
                <div className="mt-1.5 pt-1 border-t border-slate-800/60 text-[11px] font-mono text-slate-500 truncate flex items-center gap-1">
                  <span className="text-sky-400 select-none">&gt;</span>
                  <span className="truncate">{item.pythonSyntax}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
