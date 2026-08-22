import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTravelData(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parser = new CSVParser();
      const result = parser.parse(text);
      resolve(result.data);
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

export function prepareRecommendationData(data: any[]): Map<string, number[]> {
  const recommendations = new Map();
  data.forEach(item => {
    const key = `${item.origin}-${item.destination}`;
    if (!recommendations.has(key)) {
      recommendations.set(key, []);
    }
    recommendations.get(key).push(item.duration);
  });
  return recommendations;
}
