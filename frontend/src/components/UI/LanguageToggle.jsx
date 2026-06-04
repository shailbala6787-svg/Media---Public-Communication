import React from 'react';
import { useLang } from '../../context/LanguageContext.jsx';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <div className="lang-toggle" title="Toggle Language / भाषा बदलें">
      <button
        className={`lang-btn${lang === 'en' ? ' active' : ''}`}
        onClick={() => lang !== 'en' && toggleLang()}
      >
        EN
      </button>
      <button
        className={`lang-btn${lang === 'hi' ? ' active' : ''}`}
        onClick={() => lang !== 'hi' && toggleLang()}
      >
        हि
      </button>
    </div>
  );
}
