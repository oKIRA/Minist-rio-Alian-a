import { api } from '../axiosConfig';
import { LoginResponse, AuthMeResponse } from './types';
import { User } from '../../../types';

// Adaptador para converter resposta da API para o tipo User
const adaptUserFromAPI = (apiUser: any): User => {
  if (!apiUser || !apiUser.id) {
    console.error('Dados do usuário inválidos:', apiUser);
    throw new Error('Dados do usuário inválidos');
  }

  // Converter data de nascimento de ISO para YYYY-MM-DD
  let dataNascimento = apiUser.dataNascimento || apiUser.nascimento;
  if (dataNascimento && typeof dataNascimento === 'string') {
    try {
      dataNascimento = dataNascimento.split('T')[0];
    } catch (e) {
      console.error('Erro ao processar data:', e);
    }
  }

  return {
    id: apiUser.id,
    name: apiUser.nome || apiUser.name || '',
    role: apiUser.funcao || apiUser.role || 'DISCIPULO',
    email: apiUser.email || '',
    senha: apiUser.senha,
    pastorId: apiUser.supervisorId || apiUser.pastorId,
    discipuladorId: apiUser.supervisorId || apiUser.discipuladorId,
    contato: apiUser.telefone || apiUser.contato || '',
    ministerio: apiUser.ministerio || '',
    atividade: apiUser.nivelAtividade || apiUser.atividade || 3,
    batizado: apiUser.batizado === true || apiUser.batizado === 'true',
    g12: apiUser.universidadeVida === true || apiUser.g12 === true,
    universidadeDaVida: (apiUser.universidadeVida === true || apiUser.g12 === true) ? 'Sim' : 'Não',
    capacitacaoDestino: apiUser.capacitacaoDestino1 ? 'Nível 1' : 
                        apiUser.capacitacaoDestino2 ? 'Nível 2' : 
                        apiUser.capacitacaoDestino3 ? 'Nível 3' : 'Não Iniciou',
    sexo: apiUser.genero || apiUser.sexo || 'M',
    nascimento: dataNascimento,
  };
};

/**
 * Serviço de Autenticação
 */
export const authService = {
  /**
   * Realizar login
   */
  async login(email: string, senha: string): Promise<LoginResponse> {
    const response = await api.post<any>('/auth/login', { email, senha });
    
    // Salvar token no localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return {
      token: response.data.token,
      usuario: adaptUserFromAPI(response.data.usuario)
    };
  },

  /**
   * Obter informações do usuário autenticado
   */
  async me(): Promise<AuthMeResponse> {
    try {
      const response = await api.get<any>('/auth/me');
      console.log('Resposta do /auth/me:', response.data);
      
      // A resposta pode vir como {usuario: {...}} ou diretamente {...}
      const userData = response.data.usuario || response.data;
      
      return {
        usuario: adaptUserFromAPI(userData)
      };
    } catch (error) {
      console.error('Erro no authService.me():', error);
      throw error;
    }
  },

  /**
   * Realizar logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },
};
