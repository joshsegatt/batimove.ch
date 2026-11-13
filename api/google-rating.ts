// Função da Vercel: nota e número de avaliações da Batimove no Google.
// Consulta a Places API (New) e deixa a resposta em cache na CDN da Vercel por
// 6 h, então o Google é chamado poucas vezes por dia, não a cada visita.
//
// Configuração (painel da Vercel > Settings > Environment Variables):
//   GOOGLE_PLACES_API_KEY  chave do Google Cloud com a "Places API (New)" ativada
//   GOOGLE_PLACE_ID        Place ID da ficha Batimove no Google
// Sem as duas, responde 503 e o site mostra a nota de data/reviews.ts.

declare const process: { env: Record<string, string | undefined> };

const json = (body: unknown, status: number, cache: string) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': cache },
  });

export async function GET(): Promise<Response> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const place = process.env.GOOGLE_PLACE_ID;
  if (!key || !place) return json({ error: 'not-configured' }, 503, 'no-store');

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(place)}`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount' },
    });
    if (!res.ok) return json({ error: 'upstream', status: res.status }, 502, 'public, s-maxage=300');
    const data = (await res.json()) as { rating?: number; userRatingCount?: number };
    if (typeof data.rating !== 'number') return json({ error: 'no-rating' }, 502, 'public, s-maxage=300');
    return json(
      { rating: data.rating, count: data.userRatingCount ?? 0 },
      200,
      'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400'
    );
  } catch {
    return json({ error: 'fetch-failed' }, 502, 'public, s-maxage=300');
  }
}
