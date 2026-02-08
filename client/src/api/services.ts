import api from './client';
import type { Service } from '../types';

export async function fetchServices(): Promise<Service[]> {
  const { data } = await api.get<Service[]>('/services');
  return data;
}

export async function fetchServiceById(id: number): Promise<Service> {
  const { data } = await api.get<Service>(`/services/${id}`);
  return data;
}

export async function createService(service: Partial<Service>): Promise<Service> {
  const { data } = await api.post<Service>('/services', service);
  return data;
}

export async function updateService(id: number, service: Partial<Service>): Promise<Service> {
  const { data } = await api.put<Service>(`/services/${id}`, service);
  return data;
}

export async function deleteService(id: number): Promise<void> {
  await api.delete(`/services/${id}`);
}
