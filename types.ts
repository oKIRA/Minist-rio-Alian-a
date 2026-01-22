export type Role = 'ADM' | 'PASTOR' | 'DISCIPULADOR' | 'DISCIPULO';

export interface User {
  id: number;
  name: string;
  role: Role;
  email: string;
  password?: string;
  pastorId?: number | null;
  discipuladorId?: number | null;
  contato?: string;
  ministerio?: string;
  atividade: number;
  batizado: boolean;
  g12: boolean;
  universidadeDaVida: string;
  capacitacaoDestino: string;
  sexo: 'M' | 'F';
  nascimento?: string;
  // Computed property for internal use
  isUser?: boolean;
}

export interface StatData {
  avgAge: string;
  genderData: { name: string; value: number }[];
  baptismData: { name: string; value: number }[];
  uvData: { name: string; value: number }[];
  cdData: { name: string; percentage: number }[];
}

export type ViewState = 'login' | 'dashboard' | 'analytics' | 'pastors' | 'leaders' | 'disciples' | 'study_prep' | 'form';