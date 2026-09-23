import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Pre-warm and decode all perfume assets into GPU/browser cache immediately
const ALL_PERFUME_IMAGES = [
  "/images/perfumes/givenchy-gentleman.jpg",
  "/images/perfumes/la-uno.jpg",
  "/images/perfumes/for-him-black.jpg",
  "/images/perfumes/seoul.jpg",
  "/images/perfumes/intense-dark.jpg",
  "/images/perfumes/versace-crystal-noir.jpg",
  "/images/perfumes/lattafa-khamrah.jpg",
  "/images/perfumes/rich-warm-addictive.jpg",
  "/images/perfumes/ck-one.jpg",
  "/images/perfumes/ck2.jpg",
  "/images/perfumes/sunrise.jpg",
  "/images/perfumes/seoul-winter.jpg"
];

if (typeof window !== "undefined") {
  ALL_PERFUME_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
    if (img.decode) {
      img.decode().catch(() => {});
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

