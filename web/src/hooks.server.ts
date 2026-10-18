import type { ServerInit } from '@sveltejs/kit';
import { initDb } from '$lib/server/db';

export const init: ServerInit = async () => {
  await initDb();
};
