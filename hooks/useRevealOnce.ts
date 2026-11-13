import { useEffect, useRef, useState } from 'react';

/**
 * Estado de uma animação de entrada que roda uma vez, quando o bloco entra na tela.
 *
 * - 'shown' é o padrão: sem JavaScript, com `prefers-reduced-motion` ou com o
 *   bloco já visível na abertura da página, nada fica escondido.
 * - 'pending' só vale enquanto um IntersectionObserver vigia o bloco. Todo caminho
 *   que não cria o observador volta para 'shown', e uma rede de segurança mostra o
 *   bloco se ele já estiver na tela e o observador não tiver respondido.
 */
export const useRevealOnce = <T extends Element>(threshold = 0.35) => {
  const ref = useRef<T>(null);
  const [state, setState] = useState<'pending' | 'shown'>('shown');

  useEffect(() => {
    const el = ref.current;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const inView = () => {
      const r = el!.getBoundingClientRect();
      return r.top < window.innerHeight * 0.9 && r.bottom > 0;
    };
    if (!el || reduced || typeof IntersectionObserver === 'undefined' || inView()) {
      setState('shown');
      return;
    }

    setState('pending');
    const show = () => {
      setState('shown');
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) show();
    }, { threshold });
    // Rede de segurança: se o bloco entrou na tela e o observador não respondeu
    // (aba em segundo plano, renderizador sem IntersectionObserver confiável), mostra.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.setTimeout(() => {
        ticking = false;
        if (inView()) show();
      }, 400);
    };
    io.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return { ref, pending: state === 'pending' };
};
