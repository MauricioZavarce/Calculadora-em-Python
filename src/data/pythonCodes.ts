import { PythonScript } from '../types';

export const PYTHON_SCRIPTS: PythonScript[] = [
  {
    id: 'terminal',
    title: 'Calculadora Interativa de Terminal (CLI)',
    filename: 'calculadora_terminal.py',
    category: 'CLI / Terminal',
    difficulty: 'Iniciante',
    summary: 'Calculadora de linha de comando com loop contínuo, menu intuitivo e tratamento completo de erros.',
    features: [
      'Operações fundamentais (+, -, *, /, //, %, **)',
      'Tratamento de exceções (ZeroDivisionError, ValueError)',
      'Histórico de cálculos em memória durante a sessão',
      'Compatível com qualquer versão do Python 3 (sem bibliotecas externas)',
    ],
    description:
      'Ideal para quem está aprendendo Python e quer dominar estruturas de repetição (while), condicionais (if/elif/else ou match/case) e tratamento seguro de exceções (try/except).',
    code: `"""
Calculadora Interativa de Linha de Comando (CLI)
Linguagem: Python 3.10+
Autor: Mauricio / PyCalc
Uso: python calculadora_terminal.py
"""

import sys

def cabecalho():
    print("=" * 45)
    print("         CALCULADORA EM PYTHON (CLI)         ")
    print("=" * 45)

def menu():
    print("""
Escolha uma operacao:
  [ 1 ] Adicao (+)
  [ 2 ] Subtracao (-)
  [ 3 ] Multiplicacao (*)
  [ 4 ] Divisao Real (/)
  [ 5 ] Divisao Inteira (//)
  [ 6 ] Resto da Divisao / Modulo (%)
  [ 7 ] Potenciacao (**)
  [ 8 ] Raiz Quadrada (x ** 0.5)
  [ H ] Ver Historico
  [ S ] Sair
""")

def obter_numero(mensagem):
    while True:
        entrada = input(mensagem).strip().replace(",", ".")
        try:
            return float(entrada)
        except ValueError:
            print("[ERRO] Entrada invalida. Digite um numero valido!")

def main():
    historico = []
    cabecalho()

    while True:
        menu()
        opcao = input("Opcao escolhida: ").strip().lower()

        if opcao in ("s", "sair", "0"):
            print("\\nObrigado por usar a Calculadora em Python! Ate logo.")
            sys.exit(0)

        elif opcao in ("h", "historico"):
            print("\\n--- HISTORICO DE CALCULO ---")
            if not historico:
                print("Nenhum calculo realizado ainda.")
            else:
                for idx, item in enumerate(historico, start=1):
                    print(f"{idx:02d}. {item}")
            print("----------------------------\\n")
            continue

        elif opcao == "8":
            # Operacao unaria: Raiz quadrada
            num = obter_numero("Digite o numero: ")
            if num < 0:
                print("[ERRO] Nao e possivel calcular raiz quadrada de numero negativo nos reais!")
                continue
            resultado = num ** 0.5
            calc_str = f"sqrt({num:g}) = {resultado:g}"
            print(f"\\n>>> RESULTADO: {calc_str}")
            historico.append(calc_str)
            continue

        elif opcao in ("1", "2", "3", "4", "5", "6", "7"):
            num1 = obter_numero("Digite o primeiro numero: ")
            num2 = obter_numero("Digite o segundo numero: ")

            try:
                if opcao == "1":
                    resultado = num1 + num2
                    operador = "+"
                elif opcao == "2":
                    resultado = num1 - num2
                    operador = "-"
                elif opcao == "3":
                    resultado = num1 * num2
                    operador = "*"
                elif opcao == "4":
                    if num2 == 0:
                        raise ZeroDivisionError("Divisao por zero nao permitida!")
                    resultado = num1 / num2
                    operador = "/"
                elif opcao == "5":
                    if num2 == 0:
                        raise ZeroDivisionError("Divisao inteira por zero nao permitida!")
                    resultado = num1 // num2
                    operador = "//"
                elif opcao == "6":
                    if num2 == 0:
                        raise ZeroDivisionError("Modulo por zero nao permitido!")
                    resultado = num1 % num2
                    operador = "%"
                elif opcao == "7":
                    resultado = num1 ** num2
                    operador = "**"

                calc_str = f"{num1:g} {operador} {num2:g} = {resultado:g}"
                print(f"\\n>>> RESULTADO: {calc_str}")
                historico.append(calc_str)

            except ZeroDivisionError as err:
                print(f"[ERRO DE CALCULO] {err}")
            except OverflowError:
                print("[ERRO DE CALCULO] O resultado ultrapassou o limite numerico!")
        else:
            print("[AVISO] Opcao invalida. Digite um numero de 1 a 8, H ou S.")

if __name__ == "__main__":
    main()
`,
  },
  {
    id: 'gui-tkinter',
    title: 'Calculadora Desktop Gráfica (Tkinter)',
    filename: 'calculadora_gui.py',
    category: 'Interface Gráfica',
    difficulty: 'Intermediário',
    summary: 'Aplicativo de desktop com interface gráfica moderna usando Tkinter, sem necessidade de instalar pacotes.',
    features: [
      'Interface limpa com botões numéricos e operacionais',
      'Suporte a atalhos de teclado (Enter para calcular, Esc para limpar, Backspace)',
      'Display dinâmico com expressão e resultado',
      'Funciona no Windows, macOS e Linux com a biblioteca padrão do Python',
    ],
    description:
      'Demonstra como construir aplicativos de desktop nativos em Python utilizando a biblioteca padrão tkinter, organizando o código com orientação a objetos e tratamento de eventos.',
    code: `"""
Calculadora Grafica Desktop com Tkinter
Linguagem: Python 3
Requisitos: Nenhum (usa apenas a biblioteca padrao tkinter)
Uso: python calculadora_gui.py
"""

import tkinter as tk
from tkinter import messagebox
import math

class CalculadoraTkinter:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculadora Python - Tkinter")
        self.root.geometry("360x520")
        self.root.resizable(False, False)
        self.root.configure(bg="#0f172a")

        self.expressao = ""

        self.criar_display()
        self.criar_botoes()
        self.configurar_teclado()

    def criar_display(self):
        frame_display = tk.Frame(self.root, bg="#0f172a", pady=15, padx=15)
        frame_display.pack(fill=tk.BOTH)

        # Sub-display para mostrar expressao anterior
        self.label_sub = tk.Label(
            frame_display,
            text="",
            font=("Consolas", 11),
            fg="#94a3b8",
            bg="#0f172a",
            anchor="e"
        )
        self.label_sub.pack(fill=tk.X)

        # Display principal
        self.label_display = tk.Label(
            frame_display,
            text="0",
            font=("Consolas", 28, "bold"),
            fg="#f8fafc",
            bg="#1e293b",
            anchor="e",
            padx=12,
            pady=10,
            relief=tk.FLAT
        )
        self.label_display.pack(fill=tk.X, pady=(5, 0))

    def criar_botoes(self):
        frame_botoes = tk.Frame(self.root, bg="#0f172a", padx=15, pady=10)
        frame_botoes.pack(fill=tk.BOTH, expand=True)

        layout = [
            ("C", "#ef4444", self.limpar),
            ("←", "#475569", self.apagar_ultimo),
            ("%", "#475569", lambda: self.adicionar_caractere("%")),
            ("/", "#f59e0b", lambda: self.adicionar_caractere("/")),

            ("7", "#334155", lambda: self.adicionar_caractere("7")),
            ("8", "#334155", lambda: self.adicionar_caractere("8")),
            ("9", "#334155", lambda: self.adicionar_caractere("9")),
            ("*", "#f59e0b", lambda: self.adicionar_caractere("*")),

            ("4", "#334155", lambda: self.adicionar_caractere("4")),
            ("5", "#334155", lambda: self.adicionar_caractere("5")),
            ("6", "#334155", lambda: self.adicionar_caractere("6")),
            ("-", "#f59e0b", lambda: self.adicionar_caractere("-")),

            ("1", "#334155", lambda: self.adicionar_caractere("1")),
            ("2", "#334155", lambda: self.adicionar_caractere("2")),
            ("3", "#334155", lambda: self.adicionar_caractere("3")),
            ("+", "#f59e0b", lambda: self.adicionar_caractere("+")),

            ("±", "#475569", self.inverter_sinal),
            ("0", "#334155", lambda: self.adicionar_caractere("0")),
            (".", "#475569", lambda: self.adicionar_caractere(".")),
            ("=", "#38bdf8", self.calcular),
        ]

        # Configurar proporcoes da grade
        for row in range(5):
            frame_botoes.rowconfigure(row, weight=1, pad=6)
        for col in range(4):
            frame_botoes.columnconfigure(col, weight=1, pad=6)

        idx = 0
        for r in range(5):
            for c in range(4):
                texto, cor_fundo, comando = layout[idx]
                btn = tk.Button(
                    frame_botoes,
                    text=texto,
                    font=("Segoe UI", 13, "bold"),
                    bg=cor_fundo,
                    fg="#ffffff",
                    activebackground="#64748b",
                    activeforeground="#ffffff",
                    relief=tk.FLAT,
                    bd=0,
                    cursor="hand2",
                    command=comando
                )
                btn.grid(row=r, column=c, sticky="nsew", padx=3, pady=3)
                idx += 1

    def adicionar_caractere(self, char):
        if self.expressao == "0" and char not in ".+-*/%":
            self.expressao = char
        else:
            self.expressao += str(char)
        self.atualizar_display()

    def limpar(self):
        self.expressao = ""
        self.label_sub.config(text="")
        self.atualizar_display()

    def apagar_ultimo(self):
        self.expressao = self.expressao[:-1]
        self.atualizar_display()

    def inverter_sinal(self):
        if not self.expressao:
            return
        try:
            val = eval(self.expressao)
            self.expressao = str(-val)
            self.atualizar_display()
        except Exception:
            pass

    def calcular(self):
        if not self.expressao:
            return

        expressao_original = self.expressao
        try:
            # Substituicoes seguras de operadores
            expr_eval = self.expressao.replace("^", "**")
            
            # Contexto seguro para avaliacao matematica
            contexto = {"math": math, "abs": abs, "round": round}
            resultado = eval(expr_eval, {"__builtins__": None}, contexto)

            if isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)

            self.label_sub.config(text=f"{expressao_original} =")
            self.expressao = str(resultado)
            self.atualizar_display()

        except ZeroDivisionError:
            messagebox.showerror("Erro de Calculo", "Impossivel dividir por zero!")
            self.limpar()
        except Exception as e:
            messagebox.showerror("Erro de Sintaxe", f"Expressao invalida: {e}")
            self.limpar()

    def atualizar_display(self):
        texto = self.expressao if self.expressao else "0"
        self.label_display.config(text=texto)

    def configurar_teclado(self):
        self.root.bind("<Return>", lambda event: self.calcular())
        self.root.bind("<KP_Enter>", lambda event: self.calcular())
        self.root.bind("<BackSpace>", lambda event: self.apagar_ultimo())
        self.root.bind("<Escape>", lambda event: self.limpar())
        for char in "0123456789+-*/.()":
            self.root.bind(char, lambda event, c=char: self.adicionar_caractere(c))

if __name__ == "__main__":
    janela = tk.Tk()
    app = CalculadoraTkinter(janela)
    janela.mainloop()
`,
  },
  {
    id: 'oop-unit-test',
    title: 'Calculadora Orientada a Objetos com Testes Unitários',
    filename: 'calculadora_oo.py',
    category: 'Orientação a Objetos',
    difficulty: 'Intermediário',
    summary: 'Arquitetura modular em classe Python com documentação docstrings, memória e suíte unittest.',
    features: [
      'Classe Calculadora encapsulada com memória (M+, M-, MR, MC)',
      'Suporte a encadeamento de operações (fluent interface)',
      'Suíte de testes automatizados com unittest integrada',
      'Tratamento customizado de exceções matemáticas',
    ],
    description:
      'Padrão profissional da indústria de software: separação de responsabilidades, métodos tipados com type hints, documentação e garantia de qualidade via testes unitários.',
    code: `"""
Calculadora Orientada a Objetos com Suite de Testes Unitarios
Linguagem: Python 3.9+
Uso da classe:
    calc = Calculadora()
    print(calc.somar(10, 5))  # 15.0

Execucao dos testes:
    python calculadora_oo.py
    ou: python -m unittest calculadora_oo.py
"""

from typing import Union, List
import math
import unittest

Number = Union[int, float]

class CalculadoraErro(Exception):
    """Excecao customizada para operacoes matematicas invalidas."""
    pass

class Calculadora:
    """Classe que implementa o motor aritmetico e cientifico de uma calculadora."""

    def __init__(self, valor_inicial: Number = 0.0):
        self._valor_atual: float = float(valor_inicial)
        self._memoria: float = 0.0
        self._historico: List[str] = []

    @property
    def valor_atual(self) -> float:
        """Retorna o valor atual do acumulador."""
        return self._valor_atual

    @property
    def memoria(self) -> float:
        """Retorna o valor armazenado na memoria."""
        return self._memoria

    @property
    def historico(self) -> List[str]:
        """Retorna uma copia do historico de operacoes."""
        return list(self._historico)

    def somar(self, a: Number, b: Number) -> float:
        """Retorna a soma de dois numeros: a + b."""
        res = float(a + b)
        self._registrar(f"{a} + {b} = {res}")
        self._valor_atual = res
        return res

    def subtrair(self, a: Number, b: Number) -> float:
        """Retorna a subtracao de dois numeros: a - b."""
        res = float(a - b)
        self._registrar(f"{a} - {b} = {res}")
        self._valor_atual = res
        return res

    def multiplicar(self, a: Number, b: Number) -> float:
        """Retorna o produto de dois numeros: a * b."""
        res = float(a * b)
        self._registrar(f"{a} * {b} = {res}")
        self._valor_atual = res
        return res

    def dividir(self, a: Number, b: Number) -> float:
        """
        Retorna a divisao real: a / b.
        Lanca CalculadoraErro caso b seja zero.
        """
        if b == 0:
            raise CalculadoraErro("Nao e permitido dividir por zero.")
        res = float(a / b)
        self._registrar(f"{a} / {b} = {res}")
        self._valor_atual = res
        return res

    def potencia(self, base: Number, expoente: Number) -> float:
        """Calcula a potencia: base ** expoente."""
        res = float(base ** expoente)
        self._registrar(f"{base} ** {expoente} = {res}")
        self._valor_atual = res
        return res

    def raiz_quadrada(self, x: Number) -> float:
        """
        Calcula a raiz quadrada de x.
        Lanca CalculadoraErro para numeros negativos.
        """
        if x < 0:
            raise CalculadoraErro("Nao existe raiz real para numero negativo.")
        res = math.sqrt(float(x))
        self._registrar(f"sqrt({x}) = {res}")
        self._valor_atual = res
        return res

    def porcentagem(self, valor: Number, total: Number) -> float:
        """Calcula quanto porcento 'valor' representa em relacao ao 'total'."""
        if total == 0:
            raise CalculadoraErro("Total nao pode ser zero para calculo de porcentagem.")
        res = float((valor / total) * 100)
        self._registrar(f"({valor} / {total}) * 100 = {res}%")
        self._valor_atual = res
        return res

    # Operacoes de Memoria
    def memoria_adicionar(self, valor: Number) -> None:
        """Adiciona um valor a memoria (M+)."""
        self._memoria += float(valor)

    def memoria_subtrair(self, valor: Number) -> None:
        """Subtrai um valor da memoria (M-)."""
        self._memoria -= float(valor)

    def memoria_recuperar(self) -> float:
        """Recupera o valor da memoria (MR)."""
        return self._memoria

    def memoria_limpar(self) -> None:
        """Zera o valor armazenado na memoria (MC)."""
        self._memoria = 0.0

    def limpar_historico(self) -> None:
        """Limpa o historico de operacoes."""
        self._historico.clear()

    def _registrar(self, registro: str) -> None:
        self._historico.append(registro)


# =====================================================================
# Suite de Testes Unitarios Automatizados
# =====================================================================
class TestCalculadora(unittest.TestCase):
    def setUp(self):
        """Executado antes de cada teste individual."""
        self.calc = Calculadora()

    def test_somar(self):
        self.assertEqual(self.calc.somar(3, 4), 7.0)
        self.assertEqual(self.calc.somar(-5, 5), 0.0)
        self.assertAlmostEqual(self.calc.somar(0.1, 0.2), 0.3, places=7)

    def test_subtrair(self):
        self.assertEqual(self.calc.subtrair(10, 4), 6.0)
        self.assertEqual(self.calc.subtrair(0, 10), -10.0)

    def test_multiplicar(self):
        self.assertEqual(self.calc.multiplicar(6, 7), 42.0)
        self.assertEqual(self.calc.multiplicar(-3, 4), -12.0)
        self.assertEqual(self.calc.multiplicar(5, 0), 0.0)

    def test_dividir_sucesso(self):
        self.assertEqual(self.calc.dividir(15, 3), 5.0)
        self.assertEqual(self.calc.dividir(7, 2), 3.5)

    def test_dividir_por_zero_lanca_excecao(self):
        with self.assertRaises(CalculadoraErro):
            self.calc.dividir(10, 0)

    def test_potencia(self):
        self.assertEqual(self.calc.potencia(2, 3), 8.0)
        self.assertEqual(self.calc.potencia(9, 0.5), 3.0)

    def test_raiz_quadrada(self):
        self.assertEqual(self.calc.raiz_quadrada(144), 12.0)
        with self.assertRaises(CalculadoraErro):
            self.calc.raiz_quadrada(-4)

    def test_memoria(self):
        self.calc.memoria_adicionar(50)
        self.calc.memoria_subtrair(20)
        self.assertEqual(self.calc.memoria_recuperar(), 30.0)
        self.calc.memoria_limpar()
        self.assertEqual(self.calc.memoria_recuperar(), 0.0)

if __name__ == "__main__":
    print("Executando demonstracao rapida:")
    c = Calculadora()
    print("Soma: 15 + 27 =", c.somar(15, 27))
    print("Potencia: 2 ** 10 =", c.potencia(2, 10))
    print("Raiz: sqrt(256) =", c.raiz_quadrada(256))
    print("\\nIniciando suíte de testes automatizados (unittest):")
    unittest.main()
`,
  },
  {
    id: 'scientific-stats',
    title: 'Calculadora Científica e Estatística',
    filename: 'calculadora_cientifica.py',
    category: 'Científica & Stats',
    difficulty: 'Avançado',
    summary: 'Módulos math e statistics: trigonometria, logaritmos, fatoriais, média, mediana e desvio padrão.',
    features: [
      'Funções trigonométricas (seno, cosseno, tangente com graus ou radianos)',
      'Logaritmos em qualquer base (base 10, base 2 e ln base e)',
      'Análise estatística descritiva (média, mediana, desvio padrão amostral)',
      'Cálculo de combinações e permutações (análise combinatória)',
    ],
    description:
      'Solução robusta para cálculos científicos e acadêmicos, aproveitando o poder das bibliotecas padrão math e statistics do ecossistema Python.',
    code: `"""
Calculadora Cientifica e Estatistica Avancada
Linguagem: Python 3.8+
Bibliotecas padrao: math, statistics
Uso: python calculadora_cientifica.py
"""

import math
import statistics
from typing import List

class CalculadoraCientifica:
    """Implementa operacoes trigonometricas, exponenciais e estatisticas."""

    @staticmethod
    def seno(angulo_graus: float) -> float:
        rad = math.radians(angulo_graus)
        return round(math.sin(rad), 10)

    @staticmethod
    def cosseno(angulo_graus: float) -> float:
        rad = math.radians(angulo_graus)
        return round(math.cos(rad), 10)

    @staticmethod
    def tangente(angulo_graus: float) -> float:
        if angulo_graus % 180 == 90:
            raise ValueError("Tangente indefinida para 90 graus ou multiplos impares.")
        rad = math.radians(angulo_graus)
        return round(math.tan(rad), 10)

    @staticmethod
    def logaritmo(x: float, base: float = 10.0) -> float:
        if x <= 0:
            raise ValueError("Logaritmando deve ser estritamente positivo.")
        if base <= 0 or base == 1:
            raise ValueError("Base do logaritmo deve ser positiva e diferente de 1.")
        return math.log(x, base)

    @staticmethod
    def ln(x: float) -> float:
        """Logaritmo natural na base de Euler (e)."""
        if x <= 0:
            raise ValueError("Logaritmando deve ser estritamente positivo.")
        return math.log(x)

    @staticmethod
    def fatorial(n: int) -> int:
        if n < 0:
            raise ValueError("Fatorial definido apenas para inteiros nao negativos.")
        return math.factorial(n)

    @staticmethod
    def combinacao(n: int, k: int) -> int:
        """Calcula C(n, k) = n! / (k! * (n - k)!)."""
        return math.comb(n, k)

    @staticmethod
    def permutacao(n: int, k: int) -> int:
        """Calcula P(n, k) = n! / (n - k)!."""
        return math.perm(n, k)

    @staticmethod
    def analisar_dados(valores: List[float]) -> dict:
        """Retorna resumo estatistico de uma lista numerica."""
        if not valores:
            raise ValueError("Lista de valores nao pode estar vazia.")
        return {
            "contagem": len(valores),
            "soma": sum(valores),
            "media": statistics.mean(valores),
            "mediana": statistics.median(valores),
            "desvio_padrao": statistics.stdev(valores) if len(valores) > 1 else 0.0,
            "minimo": min(valores),
            "maximo": max(valores)
        }

def demonstracao():
    calc = CalculadoraCientifica()
    print("=== DEMONSTRACAO DA CALCULADORA CIENTIFICA ===")
    print(f"Seno de 30 graus:        {calc.seno(30)}")
    print(f"Cosseno de 60 graus:     {calc.cosseno(60)}")
    print(f"Tangente de 45 graus:    {calc.tangente(45)}")
    print(f"Log10(1000):             {calc.logaritmo(1000, 10)}")
    print(f"Ln(e):                   {calc.ln(math.e)}")
    print(f"Fatorial de 6 (6!):      {calc.fatorial(6)}")
    print(f"Combinacao C(10, 3):     {calc.combinacao(10, 3)}")

    amostra = [12.5, 15.0, 14.2, 18.9, 16.5, 17.0, 14.8]
    print("\\n=== ANALISE ESTATISTICA ===")
    print(f"Amostra: {amostra}")
    resumo = calc.analisar_dados(amostra)
    for chave, val in resumo.items():
        print(f"  {chave.capitalize():<15}: {val:.4f}" if isinstance(val, float) else f"  {chave.capitalize():<15}: {val}")

if __name__ == "__main__":
    demonstracao()
`,
  },
];
