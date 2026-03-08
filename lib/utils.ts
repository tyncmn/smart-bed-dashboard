import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'hsl(0, 84%, 55%)';
    case 'high': return 'hsl(25, 95%, 55%)';
    case 'mild': return 'hsl(43, 95%, 55%)';
    default: return 'hsl(152, 69%, 45%)';
  }
}

export function riskTextClass(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'risk-critical';
    case 'high': return 'risk-high';
    case 'mild': return 'risk-mild';
    default: return 'risk-normal';
  }
}

export function riskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'bg-risk-critical';
    case 'high': return 'bg-risk-high';
    case 'mild': return 'bg-risk-mild';
    default: return 'bg-risk-normal';
  }
}

export function riskLabel(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'Critical';
    case 'high': return 'High Risk';
    case 'mild': return 'Mild Risk';
    default: return 'Normal';
  }
}

export function sleepStageColor(stage: string): string {
  switch (stage) {
    case 'deep': return 'hsl(220, 70%, 60%)';
    case 'rem': return 'hsl(270, 60%, 65%)';
    case 'light': return 'hsl(199, 70%, 55%)';
    case 'awake': return 'hsl(43, 80%, 55%)';
    default: return 'hsl(215, 15%, 45%)';
  }
}

export function deviceStatusColor(status: string): string {
  switch (status) {
    case 'online': return 'hsl(152, 69%, 45%)';
    case 'offline': return 'hsl(215, 12%, 45%)';
    case 'error': return 'hsl(0, 84%, 55%)';
    case 'low_battery': return 'hsl(43, 95%, 55%)';
    default: return 'hsl(215, 12%, 45%)';
  }
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'hsl(152, 69%, 45%)';
  if (score >= 65) return 'hsl(43, 95%, 55%)';
  if (score >= 50) return 'hsl(25, 95%, 55%)';
  return 'hsl(0, 84%, 55%)';
}
