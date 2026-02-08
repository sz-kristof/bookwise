import api from './client';

export async function loginAdmin(username: string, password: string): Promise<{ token: string }> {
  const { data } = await api.post<{ token: string }>('/auth/login', { username, password });
  return data;
}
