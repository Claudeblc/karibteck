import type { APIRoute } from 'astro';
import { buildAiTxt } from '@/lib/geo';

export const GET: APIRoute = () =>
  new Response(buildAiTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
