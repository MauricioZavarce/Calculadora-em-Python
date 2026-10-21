export type CalculatorMode = 'padrao' | 'cientifica' | 'programador' | 'expressao';

export type AngleMode = 'deg' | 'rad';

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  pythonSyntax: string;
  result: string;
  timestamp: number;
  mode: CalculatorMode;
}

export interface PythonScript {
  id: string;
  title: string;
  filename: string;
  category: 'CLI / Terminal' | 'Interface Gráfica' | 'Orientação a Objetos' | 'Científica & Stats';
  summary: string;
  description: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  features: string[];
  code: string;
}
