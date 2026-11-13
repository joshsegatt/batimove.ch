import React from 'react';
import ReactDOM from 'react-dom/client';
import './src/index.css';
import App from './App';

// Depois de um deploy, os arquivos JS das páginas carregadas sob demanda mudam
// de nome e os antigos deixam de existir. Quem estava com o site aberto e clica
// numa dessas páginas receberia a tela de erro: recarrega uma vez para buscar a
// versão nova. O intervalo mínimo evita recarregar em loop se o problema for outro.
window.addEventListener('vite:preloadError', (event) => {
  const KEY = 'batimove.chunk-reload-at';
  let last = 0;
  try {
    last = Number(window.sessionStorage.getItem(KEY)) || 0;
  } catch {
    /* armazenamento bloqueado */
  }
  if (Date.now() - last < 10_000) return;
  try {
    window.sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* idem */
  }
  event.preventDefault();
  window.location.reload();
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);