export interface DashboardEstatisticas {
  totalUsuarios: number;
  totalPastores: number;
  totalDiscipuladores: number;
  totalDiscipulos: number;
  usuariosAtivos: number;
  batizados: number;
  g12: number;
  [key: string]: any;
}

export interface HierarquiaNode {
  id: number;
  nome: string;
  role: string;
  email: string;
  children?: HierarquiaNode[];
}
