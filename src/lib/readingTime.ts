import readingTime from 'reading-time';

export function computeReadingTime(body: string): number {
  return Math.max(1, Math.round(readingTime(body).minutes));
}
