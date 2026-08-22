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

export function calculateRecommendations(data: any[]): Map<string, number[]> {
  const recommendations = new Map();
  
  // Calculate average duration for each origin-destination pair
  data.forEach(item => {
    const key = `${item.origin}-${item.destination}`;
    if (!recommendations.has(key)) {
      recommendations.set(key, []);
    }
    recommendations.get(key).push(item.duration);
  });

  // Calculate average duration for each route
  const averagedRecommendations = new Map();
  recommendations.forEach((values, key) => {
    const average = values.reduce((sum, duration) => sum + duration, 0) / values.length;
    averagedRecommendations.set(key, average);
  });

  return averagedRecommendations;
}

export function getRecommendations(origin: string, destination: string, data: any[]): number {
  const filteredData = data.filter(item => {
    return item.origin === origin && item.destination === destination;
  });

  if (filteredData.length === 0) return 0;

  // Simple collaborative filtering: average duration for this route
  const averageDuration = filteredData.reduce((sum, item) => sum + item.duration, 0) / filteredData.length;
  return averageDuration;
}
