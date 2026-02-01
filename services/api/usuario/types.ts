export interface UpdateSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface PromoverUsuarioRequest {
  role: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
