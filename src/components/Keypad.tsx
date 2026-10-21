import React from 'react';
import { Delete, Divide, Minus, Plus, X, Equal, Percent } from 'lucide-react';
import { CalculatorMode } from '../types';

interface KeypadProps {
  mode: CalculatorMode;
  onNumber: (num: string) => void;
  onOperator: (op: string) => void;
  onFunction: (fn: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEqual: () => void;
  onToggleSign: () => void;
  onDecimal: () => void;
  onMemoryAction: (action: 'MC' | 'MR' | 'M+' | 'M-') => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  onNumber,
  onOperator,
  onFunction,
  onClear,
  onDelete,
  onEqual,
  onToggleSign,
  onDecimal,
  onMemoryAction,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Memory Controls Bar */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono font-medium text-slate-400">
        <button
          type="button"
          onClick={() => onMemoryAction('MC')}
          className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
          title="Limpar Memória (Memory Clear)"
        >
          MC
        </button>
        <button
          type="button"
          onClick={() => onMemoryAction('MR')}
          className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
          title="Recuperar Memória (Memory Recall)"
        >
          MR
        </button>
        <button
          type="button"
          onClick={() => onMemoryAction('M+')}
          className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
          title="Adicionar à Memória (Memory Plus)"
        >
          M+
        </button>
        <button
          type="button"
          onClick={() => onMemoryAction('M-')}
          className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
          title="Subtrair da Memória (Memory Minus)"
        >
          M-
        </button>
      </div>

      {/* Scientific Keys Grid (visible in scientific mode) */}
      {mode === 'cientifica' && (
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800/60 font-mono text-xs">
          <button
            type="button"
            onClick={() => onFunction('sin')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            sin
          </button>
          <button
            type="button"
            onClick={() => onFunction('cos')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            cos
          </button>
          <button
            type="button"
            onClick={() => onFunction('tan')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            tan
          </button>
          <button
            type="button"
            onClick={() => onFunction('sqrt')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            √x
          </button>

          <button
            type="button"
            onClick={() => onFunction('asin')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            sin⁻¹
          </button>
          <button
            type="button"
            onClick={() => onFunction('acos')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            cos⁻¹
          </button>
          <button
            type="button"
            onClick={() => onFunction('atan')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            tan⁻¹
          </button>
          <button
            type="button"
            onClick={() => onOperator('**')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Potência em Python: x ** y"
          >
            xʸ (**)
          </button>

          <button
            type="button"
            onClick={() => onFunction('ln')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            ln
          </button>
          <button
            type="button"
            onClick={() => onFunction('log10')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            log₁₀
          </button>
          <button
            type="button"
            onClick={() => onFunction('factorial')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            n!
          </button>
          <button
            type="button"
            onClick={() => onFunction('sqr')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            x²
          </button>

          <button
            type="button"
            onClick={() => onNumber('math.pi')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            π
          </button>
          <button
            type="button"
            onClick={() => onNumber('math.e')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            e
          </button>
          <button
            type="button"
            onClick={() => onOperator('(')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            (
          </button>
          <button
            type="button"
            onClick={() => onOperator(')')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            )
          </button>
        </div>
      )}

      {/* Programmer Keys Grid (visible in programmer mode) */}
      {mode === 'programador' && (
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800/60 font-mono text-xs">
          <button
            type="button"
            onClick={() => onOperator('//')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Divisão inteira em Python (a // b)"
          >
            // (div int)
          </button>
          <button
            type="button"
            onClick={() => onOperator('%')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Resto / Módulo em Python (a % b)"
          >
            % (mod)
          </button>
          <button
            type="button"
            onClick={() => onOperator('**')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Potenciação em Python (a ** b)"
          >
            ** (pow)
          </button>
          <button
            type="button"
            onClick={() => onFunction('bin')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="bin(x) em Python"
          >
            bin()
          </button>

          <button
            type="button"
            onClick={() => onOperator('&')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Bitwise AND (&)"
          >
            AND (&)
          </button>
          <button
            type="button"
            onClick={() => onOperator('|')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Bitwise OR (|)"
          >
            OR (|)
          </button>
          <button
            type="button"
            onClick={() => onOperator('^')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Bitwise XOR (^)"
          >
            XOR (^)
          </button>
          <button
            type="button"
            onClick={() => onFunction('hex')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="hex(x) em Python"
          >
            hex()
          </button>

          <button
            type="button"
            onClick={() => onOperator('<<')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Left Shift (<<)"
          >
            &lt;&lt; (Shift L)
          </button>
          <button
            type="button"
            onClick={() => onOperator('>>')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Right Shift (>>)"
          >
            &gt;&gt; (Shift R)
          </button>
          <button
            type="button"
            onClick={() => onOperator('~')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Bitwise NOT (~)"
          >
            NOT (~)
          </button>
          <button
            type="button"
            onClick={() => onFunction('oct')}
            className="py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-400 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="oct(x) em Python"
          >
            oct()
          </button>
        </div>
      )}

      {/* Main Standard Keypad Grid (Always Accessible) */}
      <div className="grid grid-cols-4 gap-2.5 font-mono">
        {/* Row 1 */}
        <button
          type="button"
          onClick={onClear}
          className="h-14 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold border border-rose-800/40 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
          title="Limpar tudo (Clear)"
        >
          AC
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="h-14 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 font-semibold border border-slate-700/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
          title="Apagar último caractere"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onOperator('%')}
          className="h-14 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 text-amber-300 font-semibold border border-slate-700/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-lg"
          title="Porcentagem ou Módulo"
        >
          <Percent className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onOperator('/')}
          className="h-14 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-lg"
          title="Divisão real (/) em Python"
        >
          <Divide className="w-5 h-5" />
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => onNumber('7')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => onNumber('8')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => onNumber('9')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => onOperator('*')}
          className="h-14 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-lg"
          title="Multiplicação (*) em Python"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => onNumber('4')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => onNumber('5')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => onNumber('6')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => onOperator('-')}
          className="h-14 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-lg"
          title="Subtração (-) em Python"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => onNumber('1')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => onNumber('2')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => onNumber('3')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => onOperator('+')}
          className="h-14 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-lg"
          title="Adição (+) em Python"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={onToggleSign}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
          title="Inverter sinal (±)"
        >
          ±
        </button>
        <button
          type="button"
          onClick={() => onNumber('0')}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
        >
          0
        </button>
        <button
          type="button"
          onClick={onDecimal}
          className="h-14 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-xl"
          title="Ponto decimal (.)"
        >
          .
        </button>
        <button
          type="button"
          onClick={onEqual}
          className="h-14 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center text-2xl"
          title="Calcular resultado (= ou Enter)"
        >
          <Equal className="w-6 h-6 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
