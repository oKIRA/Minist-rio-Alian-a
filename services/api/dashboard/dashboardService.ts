import { api } from '../axiosConfig';
import { DashboardEstatisticas, HierarquiaNode } from './types';

/**
 * Serviço de Dashboard
 */
export const dashboardService = {
  /**
   * Obter estatísticas do dashboard
   */
  async obterEstatisticas(): Promise<DashboardEstatisticas> {
    const response = await api.get<DashboardEstatisticas>('/dashboard/estatisticas');
    return response.data;
  },

  /**
   * Obter hierarquia de usuários
   */
  async obterHierarquia(): Promise<HierarquiaNode[]> {
    const response = await api.get<HierarquiaNode[]>('/dashboard/hierarquia');
    return response.data;
  },
};
