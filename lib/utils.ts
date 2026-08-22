import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type TravelDataRow = Record<string, string | number>

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let value = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      values.push(value.trim())
      value = ''
    } else {
      value += character
    }
  }

  values.push(value.trim())
  return values
}

export function parseTravelData(file: File): Promise<TravelDataRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split(/\r?\n/).filter(Boolean)
      const headers = lines.length ? parseCsvLine(lines[0]) : []
      const rows = lines.slice(1).map((line) => {
        const values = parseCsvLine(line)
        return headers.reduce<TravelDataRow>((row, header, index) => {
          row[header] = values[index] ?? ''
          return row
        }, {})
      })
      resolve(rows)
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

export function prepareRecommendationData(data: TravelDataRow[]): Map<string, number[]> {
  const recommendations = new Map<string, number[]>();
  data.forEach(item => {
    const key = `${item.origin ?? ''}-${item.destination ?? ''}`;
    if (!recommendations.has(key)) {
      recommendations.set(key, []);
    }
    recommendations.get(key)!.push(Number(item.duration) || 0);
  });
  return recommendations;
}

export function calculateRecommendations(data: TravelDataRow[]): Map<string, number> {
  const recommendations = new Map<string, number[]>();
  
  // Calculate average duration for each origin-destination pair
  data.forEach(item => {
    const key = `${item.origin ?? ''}-${item.destination ?? ''}`;
    if (!recommendations.has(key)) {
      recommendations.set(key, []);
    }
    recommendations.get(key)!.push(Number(item.duration) || 0);
  });

  // Calculate average duration for each route
  const averagedRecommendations = new Map<string, number>();
  recommendations.forEach((values, key) => {
    const average = values.reduce((sum, duration) => sum + duration, 0) / values.length;
    averagedRecommendations.set(key, average);
  });

  return averagedRecommendations;
}

export function getRecommendations(origin: string, destination: string, data: TravelDataRow[]): number {
  const filteredData = data.filter(item => {
    return item.origin === origin && item.destination === destination;
  });

  if (filteredData.length === 0) return 0;

  // Simple collaborative filtering: average duration for this route
  const averageDuration = filteredData.reduce((sum, item) => sum + Number(item.duration), 0) / filteredData.length;
  return averageDuration;
}
