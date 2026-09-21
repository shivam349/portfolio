import { handleSeoRequest } from '../scripts/seo-handler.mjs';

export default async function handler(req, res) {
  return handleSeoRequest(req, res);
}
