import { api } from '../axiosConfig';
import { User } from '../../../types';
import { PaginatedResponse } from './types';

// Adaptador para converter resposta da API para o tipo User
const adaptUserFromAPI = (apiUser: any): User => {
  // Determinar capacitação destino
  let capacitacao = 'Não Iniciou';
  if (apiUser.capacitacaoDestino3) capacitacao = 'Concluído';
  else if (apiUser.capacitacaoDestino2) capacitacao = 'Nível 2';
  else if (apiUser.capacitacaoDestino1) capacitacao = 'Nível 1';

  // Verificar universidade da vida (pode vir como boolean, string ou número)
  // ATENÇÃO: O campo na API é "universidadeVida" (sem "De")
  const hasUV = apiUser.universidadeVida === true || 
                apiUser.universidadeVida === 'true' || 
                apiUser.universidadeVida === 1;

  // Converter data de nascimento de ISO para YYYY-MM-DD
  let dataNascimento = apiUser.dataNascimento;
  if (dataNascimento) {
    try {
      // Se for ISO datetime, extrair apenas a data
      dataNascimento = dataNascimento.split('T')[0];
    } catch (e) {
      console.error('Erro ao processar data:', e);
    }
  }

  return {
    id: apiUser.id,
    name: apiUser.nome,
    role: apiUser.funcao,
    email: apiUser.email,
    senha: apiUser.senha,
    pastorId: apiUser.supervisorId,
    discipuladorId: apiUser.supervisorId,
    contato: apiUser.telefone,
    ministerio: apiUser.ministerio,
    atividade: apiUser.nivelAtividade || 3,
    batizado: apiUser.batizado === true,
    g12: hasUV,
    universidadeDaVida: hasUV ? 'Sim' : 'Não',
    capacitacaoDestino: capacitacao,
    sexo: apiUser.genero,
    nascimento: dataNascimento,
  };
};

// Adaptador para converter User do frontend para o formato da API
const adaptUserToAPI = (user: Partial<User>): any => {
  const payload: any = {
    nome: user.name,
    email: user.email,
    telefone: user.contato,
    genero: user.sexo,
    ministerio: user.ministerio,
    nivelAtividade: user.atividade,
    batizado: user.batizado,
    universidadeVida: user.g12 || user.universidadeDaVida === 'Sim', // SEM "De"
    funcao: user.role,
  };

  // Adicionar data de nascimento apenas se fornecida, não vazia e válida
  if (user.nascimento && user.nascimento.trim() !== '') {
    // Converter para ISO DateTime (adicionar hora para garantir formato válido)
    payload.dataNascimento = new Date(user.nascimento + 'T00:00:00.000Z').toISOString();
  }

  // Adicionar supervisorId apenas se fornecido (como string)
  const supervisorId = user.pastorId || user.discipuladorId;
  if (supervisorId) {
    payload.supervisorId = String(supervisorId);
  }

  // Adicionar senha apenas se fornecida
  if (user.senha) {
    payload.senha = user.senha;
  }

  // Mapear capacitação destino
  if (user.capacitacaoDestino) {
    payload.capacitacaoDestino1 = user.capacitacaoDestino.includes('Nível 1');
    payload.capacitacaoDestino2 = user.capacitacaoDestino.includes('Nível 2');
    payload.capacitacaoDestino3 = user.capacitacaoDestino.includes('Nível 3') || user.capacitacaoDestino === 'Concluído';
  }

  return payload;
};

/**
 * Serviço de Usuários
 */
export const usuarioService = {
  /**
   * Listar todos os usuários
   */
  async listar(): Promise<User[]> {
    const response = await api.get<PaginatedResponse<any>>('/usuarios');
    console.log('Dados RAW da API:', response.data.data.map((u: any) => ({
      nome: u.nome,
      universidadeDeVida: u.universidadeDeVida,
      universidadeVida: u.universidadeVida,
      allKeys: Object.keys(u)
    })));
    const users = response.data.data.map(adaptUserFromAPI);
    return users;
  },

  /**
   * Buscar usuário por ID
   */
  async buscarPorId(id: number): Promise<User> {
    const response = await api.get<any>(`/usuarios/${id}`);
    return adaptUserFromAPI(response.data);
  },

  /**
   * Criar novo usuário
   */
  async criar(usuario: Partial<User>): Promise<User> {
    const payload = adaptUserToAPI(usuario);
    const response = await api.post<any>('/usuarios', payload);
    return adaptUserFromAPI(response.data);
  },

  /**
   * Atualizar usuário existente
   */
  async atualizar(id: number, usuario: Partial<User>): Promise<User> {
    const payload = adaptUserToAPI(usuario);
    const response = await api.put<any>(`/usuarios/${id}`, payload);
    return adaptUserFromAPI(response.data);
  },

  /**
   * Promover usuário (mudar role)
   */
  async promover(id: number, novaRole: string): Promise<User> {
    const response = await api.patch<any>(`/usuarios/${id}/promover`, { role: novaRole });
    return adaptUserFromAPI(response.data);
  },

  /**
   * Deletar usuário
   */
  async deletar(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },

  /**
   * Atualizar senha do usuário
   */
  async atualizarSenha(id: number, senhaAtual: string, novaSenha: string): Promise<void> {
    await api.patch(`/usuarios/${id}/senha`, { senhaAtual, novaSenha });
  },
};
