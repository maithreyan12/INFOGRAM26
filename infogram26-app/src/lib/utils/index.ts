import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  // Handle both ISO strings and time-only strings (HH:mm)
  let date = new Date(timeStr);
  if (isNaN(date.getTime()) && timeStr.includes(':')) {
    date = new Date(`1970-01-01T${timeStr}`);
  }
  if (isNaN(date.getTime())) return timeStr;
  
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function formatDateTime(dateStr: string, timeStr?: string): string {
  const d = formatDate(dateStr);
  if (!timeStr) return d;
  // If timeStr is actually an ISO date with time
  if (timeStr.includes('T') || timeStr.includes('Z')) {
    return `${d} at ${formatTime(timeStr)}`;
  }
  return `${d} at ${formatTime(timeStr)}`;
}

export function getSeatsLeft(max: number, registered: number): number {
  return Math.max(0, max - registered);
}

export function getSeatsColor(seatsLeft: number, max: number): string {
  if (max === 0) return 'text-slate-400';
  const percentage = (seatsLeft / max) * 100;
  if (percentage <= 10 || seatsLeft <= 5) return 'text-red-400';
  if (percentage <= 30) return 'text-yellow-400';
  return 'text-green-400';
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function downloadCSV(data: any[], filename: string): void {
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(fieldName => {
        let field = row[fieldName] === null || row[fieldName] === undefined ? '' : row[fieldName];
        // Escape quotes and wrap in quotes if contains comma
        field = String(field).replace(/"/g, '""');
        if (field.search(/("|,|\n)/g) >= 0) field = `"${field}"`;
        return field;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
