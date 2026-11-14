import type React from 'react';

/**
 * Entrada "que cai no lugar", usada com hooks/useRevealOnce: o bloco desce 24px e
 * aparece em 700ms com a curva da casa, cada item um pouco depois do anterior.
 * Só vale enquanto o hook está em 'pending'; com movimento reduzido nada se mexe.
 */
export const dropClass = (pending: boolean) =>
  `transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
    pending ? '-translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
  }`;

export const dropStyle = (i: number): React.CSSProperties => ({ transitionDelay: `${i * 110}ms` });

/** Filete que se desenha da esquerda (DESIGN.md, The Ruled Line Rule). */
export const lineStyle = (pending: boolean, delayMs: number): React.CSSProperties => ({
  transform: pending ? 'scaleX(0)' : 'scaleX(1)',
  transitionDelay: `${delayMs}ms`,
});
