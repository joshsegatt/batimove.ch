import { useEffect, useState } from 'react';
import { GOOGLE_RATING } from '../data/reviews';

/**
 * Nota Google da Batimove em tempo (quase) real, via /api/google-rating
 * (função da Vercel com cache de 6 h). Até a resposta chegar, ou se a função
 * falhar ou não estiver configurada, vale a nota de data/reviews.ts.
 */
export interface Rating {
  value: number;
  count: number;
}

const KEY = 'batimove.google-rating';
let inflight: Promise<Rating | null> | null = null;

const valid = (r: unknown): r is Rating => {
  const x = r as Rating;
  return !!x && typeof x.value === 'number' && x.value > 0 && x.value <= 5 && typeof x.count === 'number' && x.count >= 0;
};

const load = () =>
  (inflight ??= fetch('/api/google-rating')
    .then((res) => (res.ok ? res.json() : null))
    .then((d) => {
      const r = d && { value: Math.round(Number(d.rating) * 10) / 10, count: Number(d.count) };
      return valid(r) ? r : null;
    })
    .catch(() => null));

const stored = (): Rating | null => {
  try {
    const r = JSON.parse(window.sessionStorage.getItem(KEY) || 'null');
    return valid(r) ? r : null;
  } catch {
    return null;
  }
};

export const useGoogleRating = (): Rating => {
  const [rating, setRating] = useState<Rating>(() => stored() ?? GOOGLE_RATING);
  useEffect(() => {
    let alive = true;
    load().then((r) => {
      if (!r || !alive) return;
      try {
        window.sessionStorage.setItem(KEY, JSON.stringify(r));
      } catch {
        /* sem sessionStorage: só não guarda */
      }
      setRating(r);
    });
    return () => {
      alive = false;
    };
  }, []);
  return rating;
};
