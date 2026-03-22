import { fetchApi } from './apiService';

export interface CategorySpending {
  category: string;
  color: string;
  amount: number;
  percentage: string;
}

export interface AnalyticsSummary {
  totalSpending: number;
  spendingTrend: number;
  homeSpending: number;
  outSpending: number;
  weeklyData: { name: string; value: number }[];
}

export const analyticsServices = {
  getSpendingByCategory: () => 
    fetchApi<{ data: CategorySpending[] }>('/analytics/spending-by-category', { method: 'GET' }),

  getSummary: (timeframe: string = 'weekly') => 
    fetchApi<{ data: AnalyticsSummary }>(`/analytics/summary?timeframe=${timeframe}`, { method: 'GET' }),
};
