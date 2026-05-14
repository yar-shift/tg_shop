import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'В наличии',
    out_of_stock: 'Нет в наличии',
    pre_order: 'Под заказ',
    coming_soon: 'Скоро',
    archived: 'Архив',
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'text-emerald-600 bg-emerald-50',
    out_of_stock: 'text-red-600 bg-red-50',
    pre_order: 'text-amber-600 bg-amber-50',
    coming_soon: 'text-blue-600 bg-blue-50',
  };
  return colors[status] ?? 'text-gray-600 bg-gray-50';
}
