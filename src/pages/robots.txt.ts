import type { APIRoute } from 'astro';
import { buildRobotsTxt } from '@/lib/geo';

export const GET: APIRoute = () =>
  new Response(buildRobotsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
