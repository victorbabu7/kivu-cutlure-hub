# kivu-cutlure-hub


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', creerBoutonLangue);
} else {
    creerBoutonLangue();
}


 <div class="cx-lang">
            <button class="cx-lang-btn actif" onclick="setLang('fr', this)">FR</button>
            <button class="cx-lang-btn" onclick="setLang('en', this)">EN</button>
            <button class="cx-lang-btn" onclick="setLang('sw', this)">SW</button>
        </div>