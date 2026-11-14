import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * <img> que aparece em fade quando termina de baixar (CSS em src/index.css).
 * Começa visível: só esconde se, ao montar, a imagem ainda não chegou. Assim o
 * HTML pré-renderizado, o cache e quem está sem JS veem a foto normalmente.
 */
export const FadeImg: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ onLoad, onError, ...props }) => {
  const ref = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const img = ref.current;
    if (img && !img.complete) setLoading(true);
  }, []);

  return (
    <img
      ref={ref}
      {...props}
      data-fade=""
      data-loading={loading ? 'true' : undefined}
      onLoad={(e) => { setLoading(false); onLoad?.(e); }}
      onError={(e) => { setLoading(false); onError?.(e); }}
    />
  );
};
