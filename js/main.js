// ══════════════════════════════════════════
// EMAILJS CONFIG
// ══════════════════════════════════════════
const EMAILJS_SERVICE_ID  = 'service_y7lzb7p';
const EMAILJS_TEMPLATE_MSG = 'template_el25udq';   // messages du site → toi
const EMAILJS_TEMPLATE_APR = 'template_8rdrwum';   // approbation → artiste
const EMAILJS_PUBLIC_KEY   = 'RsBv86JBrVoayzqVX';

function emailjsEnvoyer(templateId, params) {
    return fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            service_id:  EMAILJS_SERVICE_ID,
            template_id: templateId,
            user_id:     EMAILJS_PUBLIC_KEY,
            template_params: params
        })
    });
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore, collection, getDocs, addDoc, deleteDoc,
    doc, getDoc, updateDoc, increment, serverTimestamp, orderBy, query, limit
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAKDCrAwbfIaISav4SW3JD3LMGBFW7qNOQ",
    authDomain: "kivu-culture-hub-78805.firebaseapp.com",
    projectId: "kivu-culture-hub-78805",
    storageBucket: "kivu-culture-hub-78805.firebasestorage.app",
    messagingSenderId: "365124930673",
    appId: "1:365124930673:web:87b86ee43d20b65ff11fd0"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ══════════════════════════════════════════
// SYSTÈME I18N — CHANGEMENT DE LANGUE FR/EN
// ══════════════════════════════════════════
const TRANSLATIONS = {
    fr: {
        // Navigation
        'nav.accueil':       'Accueil',
        'nav.artistes':      'Artistes',
        'nav.oeuvres':       'Œuvres',
        'nav.actualites':    'Actualités',
        'nav.contact':       'Contact',
        'nav.rejoindre':     'Rejoindre',

        // Boutons & liens communs
        'btn.voir-profil':   'Voir le profil',
        'btn.voir-profil-arrow': 'Voir le profil →',
        'btn.lire':          'Lire →',
        'btn.envoyer':       'Envoyer le message',
        'btn.tous':          'Tous',

        // Index — héro & stats
        'hero.titre':        'La Culture du Kivu, Vivante et Rayonnante',
        'hero.sous-titre':   'Découvrez les artistes, œuvres et événements culturels de la région du Kivu',
        'hero.cta1':         'Explorer les artistes',
        'hero.cta2':         'Voir les œuvres',
        'stat.artistes':     'Artistes',
        'stat.filieres':     'Filières',
        'stat.oeuvres':      'Œuvres',

        // Catégories
        'cat.titre':         'Nos Filières Artistiques',
        'cat.sous-titre':    'Explorez la richesse des disciplines artistiques du Kivu',

        // Section artistes vedette
        'vedette.titre':     'Artistes en Vedette',
        'vedette.sous-titre':'Rencontrez les talents qui font briller la culture du Kivu',
        'vedette.voir-tous': 'Voir tous les artistes →',

        // Section œuvres
        'oeuvres.titre':     'Œuvres Récentes',
        'oeuvres.sous-titre':'Découvrez les créations artistiques de nos talents',
        'oeuvres.voir-tous': 'Voir toutes les œuvres →',

        // Section news
        'news.titre':        'Actualités Culturelles',
        'news.sous-titre':   'Restez informé des événements et nouvelles du Kivu artistique',
        'news.voir-toutes':  'Voir toutes les actualités →',

        // Contact
        'contact.titre':     'Contactez-Nous',
        'contact.nom':       'Votre nom',
        'contact.email':     'Votre email',
        'contact.message':   'Votre message...',
        'contact.envoyer':   'Envoyer',

        // Alerts
        'alert.champs':      'Remplissez tous les champs.',
        'alert.envoye':      'Message envoyé !',
        'alert.erreur':      'Erreur : ',

        // Page artistes
        'artistes.titre':    'Nos Artistes',
        'artistes.recherche':'Rechercher un artiste...',
        'artistes.total':    'artiste(s) enregistré(s)',
        'artistes.vide':     'Aucun artiste trouvé.',

        // Profil artiste
        'profil.likes':      'Likes',
        'profil.filiere':    'Filière',
        'profil.ville':      'Ville',
        'profil.oeuvres':    'Œuvres',
        'profil.contacter':  'Contacter',
        'profil.telephone':  'Téléphone',
        'profil.non-renseigne': 'Non renseigné',

        // Filières
        'filiere.musique':   'Musique',
        'filiere.danse':     'Danse',
        'filiere.theatre':   'Théâtre',
        'filiere.peinture':  'Peinture',
        'filiere.cinema':    'Cinéma',
        'filiere.artisanat': 'Artisanat',
        'filiere.sculpture': 'Sculpture',

        // Chargement
        'chargement':        'Chargement...',
        'artiste-s':         'artiste(s)',

        // Espace artiste
        'ea.titre':          'Espace Artiste',
        'ea.sous':           'Connectez-vous pour gérer votre profil et vos œuvres',
        'ea.login-btn':      'Se connecter →',
        'ea.deconnexion':    'Déconnexion',

        // Inscription
        'insc.titre':        'Créer un compte Artiste',
        'insc.sous':         'Rejoignez la communauté culturelle du Kivu',
        'insc.btn':          'Envoyer ma demande →',
        'btn.envoyer':       'Envoyer le message',
    },
    en: {
        // Navigation
        'nav.accueil':       'Home',
        'nav.artistes':      'Artists',
        'nav.oeuvres':       'Works',
        'nav.actualites':    'News',
        'nav.contact':       'Contact',
        'nav.rejoindre':     'Join Us',

        // Boutons & liens communs
        'btn.voir-profil':   'View profile',
        'btn.voir-profil-arrow': 'View profile →',
        'btn.lire':          'Read →',
        'btn.envoyer':       'Send message',
        'btn.tous':          'All',

        // Index — héro & stats
        'hero.titre':        'The Culture of Kivu, Alive and Radiant',
        'hero.sous-titre':   'Discover the artists, works and cultural events of the Kivu region',
        'hero.cta1':         'Explore artists',
        'hero.cta2':         'View works',
        'stat.artistes':     'Artists',
        'stat.filieres':     'Disciplines',
        'stat.oeuvres':      'Works',

        // Catégories
        'cat.titre':         'Our Artistic Disciplines',
        'cat.sous-titre':    'Explore the richness of artistic disciplines in Kivu',

        // Section artistes vedette
        'vedette.titre':     'Featured Artists',
        'vedette.sous-titre':'Meet the talents shining a light on Kivu\'s culture',
        'vedette.voir-tous': 'See all artists →',

        // Section œuvres
        'oeuvres.titre':     'Recent Works',
        'oeuvres.sous-titre':'Discover the artistic creations of our talents',
        'oeuvres.voir-tous': 'See all works →',

        // Section news
        'news.titre':        'Cultural News',
        'news.sous-titre':   'Stay informed about events and news from artistic Kivu',
        'news.voir-toutes':  'See all news →',

        // Contact
        'contact.titre':     'Contact Us',
        'contact.nom':       'Your name',
        'contact.email':     'Your email',
        'contact.message':   'Your message...',
        'contact.envoyer':   'Send',

        // Alerts
        'alert.champs':      'Please fill in all fields.',
        'alert.envoye':      'Message sent!',
        'alert.erreur':      'Error: ',

        // Page artistes
        'artistes.titre':    'Our Artists',
        'artistes.recherche':'Search for an artist...',
        'artistes.total':    'registered artist(s)',
        'artistes.vide':     'No artist found.',

        // Profil artiste
        'profil.likes':      'Likes',
        'profil.filiere':    'Discipline',
        'profil.ville':      'City',
        'profil.oeuvres':    'Works',
        'profil.contacter':  'Contact',
        'profil.telephone':  'Phone',
        'profil.non-renseigne': 'Not provided',

        // Filières
        'filiere.musique':   'Music',
        'filiere.danse':     'Dance',
        'filiere.theatre':   'Theatre',
        'filiere.peinture':  'Painting',
        'filiere.cinema':    'Cinema',
        'filiere.artisanat': 'Crafts',
        'filiere.sculpture': 'Sculpture',

        // Chargement
        'chargement':        'Loading...',
        'artiste-s':         'artist(s)',

        // Espace artiste
        'ea.titre':          'Artist Space',
        'ea.sous':           'Log in to manage your profile and works',
        'ea.login-btn':      'Log in →',
        'ea.deconnexion':    'Logout',

        // Inscription
        'insc.titre':        'Create an Artist Account',
        'insc.sous':         'Join the cultural community of Kivu',
        'insc.btn':          'Submit my application →',
        'btn.envoyer':       'Send message',
    }
};

// Langue active (fr par défaut)
let langueActuelle = localStorage.getItem('kivu-langue') || 'fr';

// Traduit tous les éléments [data-i18n] de la page
function appliquerTraductions() {
    const t = TRANSLATIONS[langueActuelle];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const cle = el.getAttribute('data-i18n');
        if (t[cle] !== undefined) {
            // Placeholder pour inputs
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[cle];
            } else {
                el.textContent = t[cle];
            }
        }
    });
    // Mettre à jour le label du bouton toggle
    const btn = document.getElementById('kivu-lang-toggle');
    if (btn) {
        btn.innerHTML = langueActuelle === 'fr'
            ? '<span class="kivu-lang-active">FR</span> | <span>EN</span>'
            : '<span>FR</span> | <span class="kivu-lang-active">EN</span>';
    }
    // Mettre à jour l'attribut lang du html
    document.documentElement.lang = langueActuelle === 'fr' ? 'fr' : 'en';
}

// Retourne la traduction d'une clé (utile dans le JS dynamique)
window.t = function(cle) {
    return TRANSLATIONS[langueActuelle][cle] || cle;
};

// Retourne la langue actuelle
window.getLang = function() { return langueActuelle; };

// Crée et injecte le bouton flottant de langue
function creerBoutonLangue() {
    if (document.getElementById('kivu-lang-toggle')) return;

    // Style du bouton
    const style = document.createElement('style');
    style.textContent = `
        #kivu-lang-toggle {
            position: fixed;
            top: 18px;
            right: 18px;
            z-index: 9999;
            background: #fff;
            border: 1.5px solid #c0392b;
            border-radius: 20px;
            padding: 5px 14px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            cursor: pointer;
            color: #333;
            box-shadow: 0 2px 8px rgba(0,0,0,0.13);
            transition: box-shadow 0.2s, background 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
            font-family: inherit;
        }
        #kivu-lang-toggle:hover {
            background: #fdf0ee;
            box-shadow: 0 4px 14px rgba(192,57,43,0.18);
        }
        #kivu-lang-toggle .kivu-lang-active {
            color: #c0392b;
        }
        @media (max-width: 600px) {
            #kivu-lang-toggle { top: auto; bottom: 22px; right: 16px; }
        }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'kivu-lang-toggle';
    btn.setAttribute('aria-label', 'Changer la langue / Change language');
    btn.addEventListener('click', () => {
        langueActuelle = langueActuelle === 'fr' ? 'en' : 'fr';
        localStorage.setItem('kivu-langue', langueActuelle);
        appliquerTraductions();
    });
    document.body.appendChild(btn);
    appliquerTraductions();
}

// Initialiser dès que le DOM est prêt



const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}
const burger   = document.getElementById('burger');
const navLiens = document.querySelector('.nav-liens');

function isMobile() { return window.innerWidth <= 768; }

function fermerMenuMobile() {
    if (!navLiens) return;
    navLiens.classList.remove('nav-open');
    if (isMobile()) navLiens.style.display = '';
}

if (burger && navLiens) {
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navLiens.classList.contains('nav-open')) {
            fermerMenuMobile();
        } else {
            navLiens.classList.add('nav-open');
            navLiens.style.display = 'flex';
            navLiens.style.flexDirection = 'column';
            navLiens.style.position = 'absolute';
            navLiens.style.top = '68px';
            navLiens.style.left = '0';
            navLiens.style.width = '100%';
            navLiens.style.background = '#fff';
            navLiens.style.padding = '1rem 5vw';
            navLiens.style.borderBottom = '1px solid #e8e4de';
            navLiens.style.zIndex = '999';
        }
    });
    navLiens.querySelectorAll('a').forEach(lien => {
        lien.addEventListener('click', () => { if (isMobile()) fermerMenuMobile(); });
    });
    document.addEventListener('click', (e) => {
        if (isMobile() && !burger.contains(e.target) && !navLiens.contains(e.target)) fermerMenuMobile();
    });
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            navLiens.classList.remove('nav-open');
            ['display','flexDirection','position','top','left','width','background','padding','borderBottom','zIndex']
                .forEach(p => navLiens.style[p] = '');
        }
    });
}
document.querySelectorAll('a[href^="#"]').forEach(lien => {
    lien.addEventListener('click', function(e) {
        const cible = document.querySelector(this.getAttribute('href'));
        if (cible) {
             e.preventDefault(); cible.scrollIntoView({ 
                behavior: 'smooth' }); }
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { 
        if (e.isIntersecting) e.target.classList.add('visible'); });
}, 
{ threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

//  CONTACT INDEX

window.envoyerMessage = async function() {
    const nom = document.getElementById('contact-nom')?.value.trim();
    const email= document.getElementById('contact-email')?.value.trim();
    const sujet = document.getElementById('contact-sujet')?.value;
    const message= document.getElementById('contact-message')?.value.trim();
    if (!nom || !email || !message) {
         alert(window.t('alert.champs'));
          return; }
    try {
        await addDoc(collection(db, 'kivu-messages'), 
        { nom, email, sujet, message, date: new Date().toLocaleDateString('fr-FR') 

        }
    );
        await emailjsEnvoyer(EMAILJS_TEMPLATE_MSG, { from_name: nom, from_email: email, subject: sujet || 'Contact', message: message });
        alert(window.t('alert.envoye'));
        ['contact-nom','contact-email','contact-sujet','contact-message'].forEach(id=>{
         const el = document.getElementById(id);
         if (el) el.value = '';
        });
    } catch(e) { alert(window.t('alert.erreur') + e.message); }
};
// PAGE INDEX

if (document.querySelector('.hero-stats')||document.querySelector('.categories-grille')) {

    async function chargerDonneesIndex() {
        try {
            const [snapArt, snapOeu, snapNews] = await Promise.all([
                getDocs(collection(db, 'kivu-artistes')),
                getDocs(collection(db, 'kivu-oeuvres')),
                getDocs(collection(db, 'kivu-news'))
            ]);
//chiffre dinamique  
            const statItems = document.querySelectorAll('.stat-chiffre');
            if (statItems[0]) statItems[0].textContent = snapArt.size + '+';
            if (statItems[1]) statItems[1].textContent = '6';
            if (statItems[2]) statItems[2].textContent = snapOeu.size + '+';
// Compteurs filières (section categories)
            const filiereCount = {};
            snapArt.forEach(d => {
                const f = d.data().filiere;
                if (f) filiereCount[f] = (filiereCount[f] || 0) + 1;
            });
            document.querySelectorAll('.categorie-carte').forEach(carte => {
                const nomEl = carte.querySelector('.categorie-nom');
                const countEl = carte.querySelector('.categorie-count');
                if (!nomEl || !countEl) return;
                const nom = nomEl.textContent.toLowerCase().trim();
                const map = {
                    'musique': 'musique', 'danse': 'danse', 'théâtre': 'theatre',
                    'peinture': 'peinture', 'cinéma': 'cinema', 'artisanat': 'artisanat',
                    'sculpture': 'sculpture'
                };
                const key = map[nom] || nom;
                countEl.textContent = (filiereCount[key] || 0) + ' ' + window.t('artiste-s');
            });

// Grille artistes en vedette (index) 

            const grilleArt = document.querySelector('.artistes-grille');
            if (grilleArt) {
                const artistes = [];
                snapArt.forEach(d => artistes.push({ id: d.id, ...d.data() }));
                

                artistes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                const top4 = artistes.slice(0, 4);
                grilleArt.innerHTML = '';
                const delays = ['reveal-delay-1','reveal-delay-2','reveal-delay-3','reveal-delay-4'];
                const tagClass = { musique:'tag-rouge', danse:'tag-vert', theatre:'tag-or',
                     peinture:'tag-bleu', sculpture:'tag-orange', 
                     cinema:'tag-violet', artisanat:'tag-orange' };
                const emojis   = { musique:'🎵', danse:'💃', theatre:'🎭', 
                    peinture:'🎨', sculpture:'🗿', cinema:'🎬', artisanat:'🏺' 
                };

                const photoBgs = ['photo-bg-1','photo-bg-2','photo-bg-3','photo-bg-4'];
                top4.forEach((a, i) => {
                    const tc = tagClass[a.filiere] || 'tag-rouge';
                    const em = emojis[a.filiere] || '🎭';
                    const pb = photoBgs[i % 4];
                    grilleArt.innerHTML += `
                        <div class="artiste-carte reveal ${delays[i]}">
                            <div class="artiste-photo">
                                <div class="artiste-photo-bg ${pb}
                                "style="${a.photo ? `background-image:url(${a.photo});background-size:cover;`: ''}
                                ">${a.photo ? '' : em}</div>
                                <button class="artiste-like-btn" data-id="${a.id}">❤ ${a.likes || 0}</button>
                                <span class="artiste-filiere-badge tag ${tc}">${a.filiere}</span>
                            </div>
                            <div class="artiste-info">
                                <div class="artiste-nom">${a.nom}</div>
                                <div class="artiste-ville">📍 ${a.ville || 'kivu'}</div>
                            </div>
                            <a href="artiste.html?id=${a.id}" class="artiste-lien">${window.t('btn.voir-profil')}</a>
                        </div>`;
                });
// Observer les nouveaux éléments
                document.querySelectorAll('.artiste-carte.reveal').forEach(el => observer.observe(el));
            }

            // Grille œuvres 
            const grilleOeu = document.querySelector('.oeuvres-grille');
            if (grilleOeu) {
                const oeuvres = [];
                snapOeu.forEach(d => oeuvres.push({ id: d.id, ...d.data() }));
                const top5 = oeuvres.slice(0, 5);
                const typeEmojis = { 
                audio:'🎵',video:'🎬',peinture:'🎨',sculpture:'🗿',photo:'📷',theatre:'🎭' 
                };
                const bgs = ['ob-1','ob-2','ob-3','ob-4'];
                let html = '';
                top5.forEach((o, i) => {
                    const ytEmbed = youtubeEmbed(o.url);
                    const isImage = o.type === 'photo' || o.type === 'peinture' || o.type === 'sculpture';
                    const isVideo = o.type === 'video';
                    const ytId = ytEmbed ? ytEmbed.split('/embed/')[1] : null;

                    // Fond : image réelle si dispo, sinon couleur CSS
                    let bgDiv = '';
                    if (isImage && o.url) {
                        bgDiv = `<div class="oeuvre-bg" style="background-image:url('${o.url}');background-size:cover;background-position:center;"></div>`;
                    } else if (ytId) {
                        bgDiv = `<div class="oeuvre-bg" style="background-color:#111;">
                            <img src="https://img.youtube.com/vi/${ytId}/hqdefault.jpg" 
                                 style="width:100%;height:100%;object-fit:cover;opacity:0.75;display:block;"
                                 onerror="this.parentElement.style.background='#c0392b';">
                        </div>`;
                    } else if (isVideo && o.url) {
                        bgDiv = `<div class="oeuvre-bg ${bgs[i % 4]}" style="display:flex;align-items:center;justify-content:center;font-size:3rem;">🎬</div>`;
                    } else {
                        bgDiv = `<div class="oeuvre-bg ${bgs[i % 4]}"></div>`;
                    }

                    // Clic lightbox
                    let onclick = '';
                    if (isImage && o.url) onclick = `onclick="ouvrirLightbox('${o.url}','${o.titre.replace(/'/g,"\\'")}','photo')"`;
                    else if (ytEmbed) onclick = `onclick="ouvrirLightbox('${ytEmbed}','${o.titre.replace(/'/g,"\\'")}','youtube')"`;
                    else if (isVideo && o.url) onclick = `onclick="ouvrirLightbox('${o.url}','${o.titre.replace(/'/g,"\\'")}','video')"`;

                    html += `
                        <div class="oeuvre-carte${i === 0 ? ' grande' : ''} reveal${i > 0 ? ' reveal-delay-' + i : ''}"
                             ${onclick} style="${onclick ? 'cursor:pointer;' : ''}">
                            ${bgDiv}
                            <div class="oeuvre-play">${typeEmojis[o.type]||'🎭'}</div>
                            <div class="oeuvre-overlay">
                                <span class="oeuvre-type">${typeEmojis[o.type]||''} ${o.type}</span>
                                <div class="oeuvre-titre">${o.titre}</div>
                                <div class="oeuvre-artiste">par ${o.artiste}</div>
                            </div>
                        </div>`;
                });
                grilleOeu.innerHTML = html;
                document.querySelectorAll('.oeuvre-carte.reveal').forEach(el => observer.observe(el));
            }
//News index 
            const grilleNews = document.getElementById('news-grille');
            if (grilleNews && !document.querySelector('.news-page-grille')) {
                const newsArr = [];
                snapNews.forEach(d => newsArr.push({ id: d.id, ...d.data() }));
//plus récentes en premier                
            newsArr.reverse(); 
                const top3 = newsArr.slice(0, 3);
                grilleNews.innerHTML = '';
                top3.forEach(n => {
                    grilleNews.innerHTML += `
                        <div class="news-carte reveal">
                            <div class="news-date">${n.date || ''}</div>
                            <div class="news-titre">${n.titre}</div>
                            <div class="news-texte">${(n.texte || '').substring(0, 120)}...</div>
                            <a href="actualiteid.html?id=${n.id}
                            " class="artiste-lien" style="margin-top:0.5rem;display:inline-block;">${window.t('btn.lire')}</a>
                        </div>`;
                });
                document.querySelectorAll('.news-carte.reveal').forEach(el => observer.observe(el));
           }
        } catch(e) { console.error('Erreur chargement index:', e); }
    }
    chargerDonneesIndex();

    // Likes sur index 

    document.addEventListener('click', async function(e) {
        const btn = e.target.closest('.artiste-like-btn[data-id]');
        if (!btn) return;
        const id = btn.dataset.id;
        try {
            await updateDoc(doc(db, 'kivu-artistes', id), 
            { likes: increment(1) 

            });
            const current = parseInt(btn.textContent.replace('❤ ', '')) || 0;
            btn.textContent = `❤ ${current + 1}`;
            btn.style.background = '#c0392b';
            btn.style.color = '#fff';
        } catch(e) 
        { 
            console.error(e);
         }
    });
}
//Page artiste

if (document.querySelector('.artistes-grille-page')) {
    const grille      = document.querySelector('.artistes-grille-page');
    const chargement  = document.getElementById('chargement');
    const vide        = document.getElementById('vide');
    const filtresBtns = document.querySelectorAll('.filtre-btn[data-filiere]');
    const rechInput   = document.getElementById('recherche-artiste');

    async function chargerArtistesPage() {
        try {
            const snap = await getDocs(collection(db, 'kivu-artistes'));
            if (chargement) chargement.style.display = 'none';
            if (snap.empty) { if (vide) vide.style.display = 'flex'; return; }
            grille.innerHTML = '';
            const totalEl = document.getElementById('total-artistes');
            if (totalEl) totalEl.textContent = snap.size;

            snap.forEach(d => {
                const a = d.data();
                const emoji = { musique:'🎵', danse:'💃', theatre:'🎭', peinture:'🎨',
                     sculpture:'🗿', cinema:'🎬', artisanat:'🏺' }[a.filiere] || '🎭';
                const tagClass= { musique:'tag-rouge', danse:'tag-vert', 
                    theatre:'tag-or', peinture:'tag-bleu', 
                    sculpture:'tag-orange', cinema:'tag-violet',
                    artisanat:'tag-orange' }[a.filiere] || 'tag-rouge';
                grille.innerHTML += `
                    <div class="artiste-carte-page" data-filiere="${a.filiere}">
                        <div class="artiste-photo-page">
                        <div class="artiste-photo-bg photo-bg-1" style="${a.photo ? `background-image:url(${a.photo});
                        background-size:cover;` : ''}
                        ">${a.photo ? '' : emoji}</div>
                            <button class="artiste-like-btn" data-id="${d.id}">❤ ${a.likes || 0}</button>
                            <span class="artiste-filiere-badge tag ${tagClass}">${a.filiere}</span>
                        </div>
                        <div class="artiste-info-page">
                            <div class="artiste-nom-page">${a.nom}</div>
                            <div class="artiste-ville-page"> ${a.ville || 'Bukavu'}</div>
                            <div class="artiste-bio-page">${a.bio || ''}</div>
                            <a href="artiste.html?id=${d.id}" class="artiste-lien-page">${window.t('btn.voir-profil-arrow')}</a>
                        </div>
                    </div>`;
                     });
// Likes avec Firebase
            document.querySelectorAll('.artiste-like-btn[data-id]').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const id = this.dataset.id;
                    try {
                        await updateDoc(doc(db, 'kivu-artistes', id), { likes: increment(1) });
                        const n = parseInt(this.textContent.replace('❤ ','')) || 0;
                        this.textContent = `❤ ${n + 1}`;
                        this.style.background = '#c0392b';
                        this.style.color = '#fff';
                    } catch(e) { console.error(e); }
                });
            });
// Filtres
            filtresBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filtresBtns.forEach(b => b.classList.remove('actif'));
                    this.classList.add('actif');
                    const filiere = this.dataset.filiere;
                    let nb = 0;
                    document.querySelectorAll('.artiste-carte-page').forEach(c => {
                        const show = filiere === 'tous' || c.dataset.filiere === filiere;
                        c.classList.toggle('cache', !show);
                        if (show) nb++;
                    });
                    if (vide) vide.style.display = nb === 0 ? 'flex' : 'none';
                });
            });
            // Recherche
            if (rechInput) {
                rechInput.addEventListener('input', function() {
                    const val = this.value.toLowerCase().trim();
                    let nb = 0;
                    document.querySelectorAll('.artiste-carte-page').forEach(c => {
                        const nom = c.querySelector('.artiste-nom-page').textContent.toLowerCase();
                        const bio = c.querySelector('.artiste-bio-page').textContent.toLowerCase();
                        const fil = c.dataset.filiere.toLowerCase();
                        const show = !val || nom.includes(val) || bio.includes(val) || fil.includes(val);
                        c.classList.toggle('cache', !show);
                        if (show) nb++;
                    });
                    if (vide) vide.style.display = nb === 0 ? 'flex' : 'none';
                });
            }

        } catch(e) { console.error(e); if (chargement) chargement.style.display = 'none'; }
    }
    chargerArtistesPage();
}
// Pge profil artiste 

if (document.getElementById('profil-nom')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    async function chargerProfil() {
        if (!id) return;
        try {
            const docSnap = await getDoc(doc(db, 'kivu-artistes', id));
            if (!docSnap.exists()) {
                document.getElementById('profil-nom').textContent = "Artiste introuvable";
                return;
            }
            const a = docSnap.data();

            document.getElementById('profil-nom-breadcrumb').textContent = a.nom;
            document.getElementById('profil-nom').textContent = a.nom;
            document.getElementById('profil-ville').textContent = '📍 ' + (a.ville || 'Bukavu');
            document.getElementById('profil-bio').textContent = a.bio || '';
            document.getElementById('profil-likes').textContent = a.likes || 0;
            document.title = a.nom + ' — Kivu Culture Hub';
    // Contacts section hero
            const blocTel = document.getElementById('profil-tel');
            if (blocTel) blocTel.innerHTML = 
            `<span class="profil-contact-icone">📞</span> <span>${a.tel || window.t('profil.non-renseigne')}</span>`;

            const blocEmail = document.getElementById('profil-email');
            if (blocEmail) blocEmail.innerHTML = 
            `<span class="profil-contact-icone">📧</span> <span>${a.email || window.t('profil.non-renseigne')}</span>`;

    //CORRECTION  onglet "Contacter l'artiste"
            const contactTel = document.getElementById('contact-tel');
            if (contactTel) contactTel.textContent = a.tel || window.t('profil.non-renseigne');

            const contactEmailAffich = document.getElementById('contact-email-affich');
            if (contactEmailAffich) contactEmailAffich.textContent = a.email || window.t('profil.non-renseigne');

        // Photo
            const photo = document.getElementById('profil-photo');
            if (photo) {
                if (a.photo) {
                    photo.style.backgroundImage = `url(${a.photo})`;
                    photo.style.backgroundSize = 'cover';
                    photo.textContent = '';
                } else {
                    const emoji = 
                    { musique:'🎵', danse:'💃', theatre:'🎭', peinture:'🎨', sculpture:'🗿', cinema:'🎬', artisanat:'🏺' }
                    [a.filiere] || '🎭';
                    photo.textContent = emoji;
                    photo.style.backgroundImage = 'none';
                }
            }
// Badge filière
            const tagClass = { musique:'tag-rouge',
                 danse:'tag-vert', theatre:'tag-or',
                  peinture:'tag-bleu', 
                  sculpture:'tag-orange', 
                  cinema:'tag-violet', 
                  artisanat:'tag-orange' }[a.filiere] || 'tag-rouge';
            const tag = document.getElementById('profil-filiere-tag');
            if (tag) { tag.textContent = a.filiere; tag.className = 'tag ' + tagClass; }

            // Bouton like profil
            const likeBtn = document.getElementById('profil-like-btn');
            if (likeBtn) {
                likeBtn.addEventListener('click', async function() {
                    try {
                        await updateDoc(doc(db, 'kivu-artistes', id), { likes: increment(1) });
                        const n = parseInt(document.getElementById('profil-likes').textContent) || 0;
                        document.getElementById('profil-likes').textContent = n + 1;
                        this.style.background = '#c0392b';
                        this.style.color = '#fff';
                    } catch(e) { console.error(e);

                     }
                });
            }
    // Œuvres liées à cet artiste
            const grilleOeuvres = document.getElementById('profil-oeuvres-grille');
            if (grilleOeuvres) {
                grilleOeuvres.innerHTML = '<p style="padding:1rem;color:#666;">Chargement des œuvres...</p>';
                const snapOeuvres = await getDocs(collection(db, 'kivu-oeuvres'));
                grilleOeuvres.innerHTML = '';
                let nb = 0;
                snapOeuvres.forEach(d => {
                    const o = d.data();
                    if (o.artiste?.toLowerCase().trim() !== a.nom.toLowerCase().trim()) return;
                    nb++;
                    const ytEmbed = youtubeEmbed(o.url);
                    const isImage = (o.type === 'photo' || o.type === 'peinture' || o.type === 'sculpture');
                    const isVideo = o.type === 'video';
                    const isAudio = o.type === 'audio';
                    let visuelStyle = '';
                    let visuelContent = '';
                    let clickable = '';
                    if (isImage && o.url) {
                        visuelStyle = `background-image:url(${o.url});background-size:cover;background-position:center;cursor:pointer;`;
                        clickable = `onclick="ouvrirLightbox('${o.url}','${(o.titre||'').replace(/'/g,"\\'")}','photo')"`;
                    } else if (isVideo && ytEmbed) {
                        visuelStyle = `background:#000;cursor:pointer;`;
                        visuelContent = `<img src="https://img.youtube.com/vi/${ytEmbed.split('/embed/')[1]}/hqdefault.jpg" style="width:100%;height:100%;object-fit:cover;opacity:0.8;" onerror="this.style.display='none'"><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;">▶️</span>`;
                        clickable = `onclick="ouvrirLightbox('${ytEmbed}','${(o.titre||'').replace(/'/g,"\\'")}','youtube')"`;
                    } else if (isVideo && o.url) {
                        visuelStyle = `background:#111;cursor:pointer;`;
                        visuelContent = `<span style="font-size:3rem;">▶️</span>`;
                        clickable = `onclick="ouvrirLightbox('${o.url}','${(o.titre||'').replace(/'/g,"\\'")}','video')"`;
                    } else if (isAudio) {
                        visuelStyle = ``;
                        visuelContent = `<span style="font-size:3rem;">🎵</span>`;
                    }
                    grilleOeuvres.innerHTML += `
                        <div class="oeuvre-carte">
                            <div class="oeuvre-visuel" style="${visuelStyle}" ${clickable}>
                                ${visuelContent}
                                <span class="oeuvre-badge tag">${o.type}</span>
                            </div>
                            <div class="oeuvre-info">
                                <h3 class="oeuvre-nom">${o.titre}</h3>
                                <p class="oeuvre-annee">${o.annee || ''}</p>
                                <p style="font-size:0.9rem;color:#666;margin-top:0.5rem;">${o.desc || ''}</p>
                                ${isAudio && o.url ? 
                                    `<audio controls style="width:100%;margin-top:1rem;"><source src="${o.url}" type="audio/mp3"></audio>` : ''}
                            </div>
                        </div>`;
                });
                if (nb === 0) 
                    {
                    grilleOeuvres.innerHTML = `
                        <div style="grid-column:1/-1;text-align:center;padding:3rem;border:1px dashed #ccc;">
                            <span style="font-size:2rem;">🖼</span>
                            <p style="margin-top:0.5rem;color:#666;">Aucune œuvre répertoriée pour cet artiste.</p>
                        </div>`;
                }
            }
        } catch(e) { console.error("Erreur profil:", e); }
    }
    chargerProfil();

// Envoyer message à l'artiste
    window.envoyerMessageArtiste = async function() {
        const nom     = document.getElementById('msg-nom')?.value.trim();
        const email   = document.getElementById('msg-email')?.value.trim();
        const sujet   = document.getElementById('msg-sujet')?.value.trim();
        const message = document.getElementById('msg-message')?.value.trim();
        const artiste = document.getElementById('profil-nom')?.textContent;
        if (!nom || !email || !message) { alert('Remplissez tous les champs obligatoires.'); return; }
        try {
            // Récupérer l'email de l'artiste depuis Firestore
            const params = new URLSearchParams(window.location.search);
            const artisteId = params.get('id');
            let emailArtiste = null;
            if (artisteId) {
                const artisteSnap = await getDoc(doc(db, 'kivu-artistes', artisteId));
                if (artisteSnap.exists()) {
                    emailArtiste = artisteSnap.data().email || null;
                }
            }

            // Sauvegarder le message dans Firestore
            await addDoc(collection(db, 'kivu-messages'), {
                nom, email, sujet, message,
                artiste: artiste || 'inconnu',
                emailArtiste: emailArtiste || '',
                date: new Date().toLocaleDateString('fr-FR')
            });

            if (emailArtiste) {
                // Envoyer directement à l'email de l'artiste
                await emailjsEnvoyer(EMAILJS_TEMPLATE_MSG, {
                    from_name:  nom,
                    from_email: email,
                    subject:    sujet || ('Message de ' + nom),
                    message:    message,
                    to_email:   emailArtiste,   // ← email de l'artiste
                    to_name:    artiste
                });
                alert('Message envoyé à ' + artiste + ' !');
            } else {
                // Fallback : envoyer à la plateforme si l'artiste n'a pas d'email
                await emailjsEnvoyer(EMAILJS_TEMPLATE_MSG, {
                    from_name:  nom,
                    from_email: email,
                    subject:    (sujet || 'Message') + ' — pour ' + artiste + ' (email artiste manquant)',
                    message:    message,
                    to_name:    'Kivu Culture Hub'
                });
                alert('Message envoyé ! (transmis à la plateforme, email artiste non renseigné)');
            }

            ['msg-nom','msg-email','msg-sujet','msg-message'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
        } catch(e) { alert('Erreur : ' + e.message); }
    };
}

// PAGE ACTUALITE

if (document.getElementById('news-grille') && document.querySelector('.news-page-grille')) {
    const grille      = document.querySelector('.news-page-grille');
    const vide        = document.getElementById('vide');
    const filtresBtns = document.querySelectorAll('.filtre-btn[data-cat]');
    const rechInput   = document.getElementById('recherche-news');

    async function chargerActualites() {
        try {
            const snap = await getDocs(collection(db, 'kivu-news'));
            if (snap.empty) { if (vide) vide.style.display = 'flex'; grille.innerHTML = ''; return; }
            grille.innerHTML = '';
            const emojis = { artiste:'🎨', evenement:'🎪', urbain:'🏙' };
            const tags   = { artiste:'tag-vert', evenement:'tag-rouge', urbain:'tag-or' };
            const bgs    = ['ob-1','ob-2','ob-3','ob-4'];
            let i = 0;
    // Plus récents en premier
            const newsArr = [];
            snap.forEach(d => newsArr.push({ id: d.id, ...d.data() }));
            newsArr.reverse();
            newsArr.forEach(n => {
                grille.innerHTML += `
                    <div class="news-page-carte" data-cat="${n.cat}">
                        <div class="news-page-visuel ${bgs[i%4]}">
                   <span class="news-page-emoji">${emojis[n.cat] || '📰'}</span>
                        </div>
                        <div class="news-page-info">
                          <div class="news-page-header">
                        <span class="tag ${tags[n.cat] || 'tag-rouge'}">${n.cat}</span>
                        <span class="news-page-date">${n.date}</span>
                        </div>
                      <h2 class="news-page-titre">${n.titre}</h2>
                     <p class="news-page-texte">${(n.texte || '').substring(0,200)}...</p>
                          <a href="actualiteid.html?id=${n.id}" class="news-page-lien">Lire la suite →</a>
                   </div>
                    </div>`;
                    i++;
            });

            // Filtres
            filtresBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                 filtresBtns.forEach(b => b.classList.remove('actif'));
                 this.classList.add('actif');
                   const cat = this.dataset.cat;
                   let nb = 0;
                    document.querySelectorAll('.news-page-carte').forEach(c => {
                        const show = cat === 'tous' || c.dataset.cat === cat;
                        c.classList.toggle('cache', !show);
                        if (show) nb++;
                    });
                    if (vide) vide.style.display = nb === 0 ? 'flex' : 'none';
                });
            });

            // Recherche
            if (rechInput) {
                rechInput.addEventListener('input', function() {
                    const val = this.value.toLowerCase().trim();
                    let nb = 0;
                    document.querySelectorAll('.news-page-carte').forEach(c => {
                        const titre = c.querySelector('.news-page-titre').textContent.toLowerCase();
                        const show = !val || titre.includes(val);
                        c.classList.toggle('cache', !show);
                        if (show) nb++;
                    });
                    if (vide) vide.style.display = nb === 0 ? 'flex' : 'none';
          });
          }
        } catch(e) { console.error(e); }
    }
    chargerActualites();
}

// dataille 

if (document.getElementById('news-titre')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    async function chargerNewsDetail() {
        if (!id) return;
        try {
            const snap = await getDoc(doc(db, 'kivu-news', id));
            if (!snap.exists()) { 
                document.getElementById('news-texte').textContent = 'Article introuvable.'; return;
             }
            const n = snap.data();
            document.getElementById('news-titre').textContent      = n.titre;
            document.getElementById('news-breadcrumb').textContent = n.titre;
            document.getElementById('news-date').textContent       = n.date;
            document.getElementById('news-texte').innerHTML        = `<p>${n.texte}</p>`;
            document.title = n.titre + ' — Kivu Culture Hub';
            const tags = {
                 artiste:'tag-vert', evenement:'tag-rouge', urbain:'tag-or' 
                };
            const tag = document.getElementById('news-tag');
            tag.textContent = n.cat; tag.className = 'tag ' + (tags[n.cat] || 'tag-rouge');
            const emojis = { 
                artiste:'🎨', evenement:'🎪', urbain:'🏙' 
            };
            document.getElementById('news-emoji').textContent = emojis[n.cat] || '📰';

            const autresNews = document.getElementById('autres-news');
            if (autresNews) {
                const snapAll = await getDocs(collection(db, 'kivu-news'));
                autresNews.innerHTML = '';
                snapAll.forEach(d => {
                if (d.id === id) return;
                    const o = d.data();
                 autresNews.innerHTML += `
                      <div class="sidebar-news-item">
                            <div class="sidebar-news-date">${o.date}</div>
                            <a href="actualiteid.html?id=${d.id}
                         
                       " class="sidebar-news-titre">${o.titre}
                            </a>
                    </div>`;
                });
            }
        } catch(e) {
             console.error(e); 
            }
    }
    chargerNewsDetail();
}

//link youtube 
function youtubeEmbed(url) {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

// ══════════════════════════════════════════
// LIGHTBOX — agrandissement photo/vidéo
// ══════════════════════════════════════════
(function() {
    const style = document.createElement('style');
    style.textContent = `
        #kivu-lightbox { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:99999;
            align-items:center; justify-content:center; flex-direction:column; padding:1rem; }
        #kivu-lightbox.open { display:flex; }
        #kivu-lightbox-close { position:absolute; top:1rem; right:1.5rem; color:#fff; font-size:2rem;
            cursor:pointer; background:none; border:none; font-weight:700; line-height:1; }
        #kivu-lightbox-close:hover { color:#c0392b; }
        #kivu-lightbox-img { max-width:92vw; max-height:80vh; border-radius:8px; object-fit:contain; box-shadow:0 8px 40px rgba(0,0,0,0.5); }
        #kivu-lightbox-iframe { width:min(90vw,900px); height:min(80vh,506px); border:none; border-radius:8px; }
        #kivu-lightbox-video { max-width:92vw; max-height:80vh; border-radius:8px; outline:none; }
        #kivu-lightbox-titre { color:#fff; margin-top:0.8rem; font-size:1rem; font-weight:600; text-align:center; opacity:0.85; }
    `;
    document.head.appendChild(style);
    const lb = document.createElement('div');
    lb.id = 'kivu-lightbox';
    lb.innerHTML = `<button id="kivu-lightbox-close" onclick="fermerLightbox()">✕</button>
        <div id="kivu-lightbox-content"></div>
        <div id="kivu-lightbox-titre"></div>`;
    document.body.appendChild(lb);
    lb.addEventListener('click', e => { if (e.target === lb) fermerLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerLightbox(); });
})();

window.ouvrirLightbox = function(url, titre, type) {
    const lb = document.getElementById('kivu-lightbox');
    const content = document.getElementById('kivu-lightbox-content');
    const titreEl = document.getElementById('kivu-lightbox-titre');
    content.innerHTML = '';
    if (type === 'youtube') {
        const autoUrl = url.includes('?') ? url + '&autoplay=1' : url + '?autoplay=1';
        content.innerHTML = `<iframe id="kivu-lightbox-iframe" src="${autoUrl}" allowfullscreen allow="autoplay"></iframe>`;
    } else if (type === 'video') {
        content.innerHTML = `<video id="kivu-lightbox-video" controls autoplay><source src="${url}"></video>`;
    } else {
        content.innerHTML = `<img id="kivu-lightbox-img" src="${url}" alt="${titre||''}">`;
    }
    titreEl.textContent = titre || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
};
window.fermerLightbox = function() {
    const lb = document.getElementById('kivu-lightbox');
    lb.classList.remove('open');
    document.getElementById('kivu-lightbox-content').innerHTML = '';
    document.body.style.overflow = '';
};

// page oeuvres
if (document.getElementById('oeuvres-grille')) {
    const grille = document.getElementById('oeuvres-grille');
    const vide  = document.getElementById('vide');
    const filtresBtns= document.querySelectorAll('.filtre-btn[data-type]');
    const rechInput = document.getElementById('recherche-oeuvre');

    async function chargerOeuvresPage() {
// Charger artistes pour retrouver l'ID depuis le nom
        let artistesMap = {};
        try {
            const snapArt = await getDocs(collection(db, 'kivu-artistes'));
            snapArt.forEach(d => { 
                artistesMap[d.data().nom.toLowerCase().trim()] = d.id;
             });
        } catch(e) {}

        try {
            const snap = await getDocs(collection(db, 'kivu-oeuvres'));
            if (snap.empty) { 
                if (vide) vide.style.display = 'flex'; grille.innerHTML = '';
                 return; 
                }
            grille.innerHTML = '';
            const bgs  = ['ob-1','ob-2','ob-3','ob-4'];
            const tags = {
                 audio:'tag-rouge', video:'tag-vert', peinture:'tag-bleu', 
                 sculpture:'tag-orange', photo:'tag-bleu', theatre:'tag-or' };
            let i = 0;
            snap.forEach(d => {
                const o = d.data();
                const artisteId = artistesMap[o.artiste?.toLowerCase().trim()];
                const profilUrl = artisteId ? 
                `artiste.html?id=${artisteId}#oeuvres-artiste` : null;

 // Média YouTube audio vidéo
            let mediaHtml = '';
                if (o.url) {
                    const ytEmbed = youtubeEmbed(o.url);
                    if (ytEmbed) {
                        mediaHtml = `<iframe style="width:100%;
                        height:150px;border:none;border-radius:8px;
                        margin-top:0.8rem;" src="${ytEmbed}" allowfullscreen></iframe>`;
                    } else if (o.type === 'audio') {
                        mediaHtml = `<audio controls class="profil-audio">
                        <source src="${o.url}" type="audio/mp3"></audio>`;
                    } else if (o.type === 'video') {
                        mediaHtml = `<video controls class="oeuvre-video">
                        <source src="${o.url}" type="video/mp4"></video>`;
                    }
                }
                grille.innerHTML += `
                    <div class="oeuvre-carte-page" data-type="${o.type}">
                        <div class="oeuvre-visuel ${bgs[i%4]}
                        " style="${o.url && (o.type==='peinture'||o.type==='photo') ? `background-image:url(${o.url});
                        background-size:cover;` : ''}">
                            <div class="oeuvre-overlay">
                                <span class="oeuvre-type">${o.type}</span>
                                <div class="oeuvre-titre">${o.titre}</div>
                                <div class="oeuvre-artiste">${o.artiste}</div>
                            </div>
                            <span class="oeuvre-badge tag ${tags[o.type] || 'tag-rouge'}">${o.type}</span>
                        </div>
                        <div class="oeuvre-info-page">
                            <div class="oeuvre-nom">${o.titre}</div>
                            <div class="oeuvre-meta">
                                ${profilUrl
                                    ? `<a href="${profilUrl}
                                    " class="oeuvre-artiste-lien" style="color:#c0392b;
                                    
                                    font-weight:600;text-decoration:none;">👤 ${o.artiste}</a>`
                                    : `<span class="oeuvre-artiste-lien">${o.artiste}</span>`
                                }
                                <span class="oeuvre-annee">${o.annee || ''}</span>
                            </div>
                            ${mediaHtml}
                            <div class="oeuvre-actions">
                                <button class="oeuvre-like-btn" data-id="${d.id}">❤ ${o.likes || 0}</button>
                               ${profilUrl ? `<a href="${profilUrl}
                               " class="oeuvre-dl-btn" 
                               style="text-decoration:none;">  voir profil de l'auteur </a>` : ''}
                                ${o.url && !youtubeEmbed(o.url) ? `<a href="${o.url}
                                " target="_blank" class="oeuvre-dl-btn">⬇ Ouvrir</a>` : ''}
                            
                        </div>
                        </div>
                        </div>`;
                i++;
            });
            // Likes œuvres avec Firebase
            document.querySelectorAll('.oeuvre-like-btn[data-id]').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const id = this.dataset.id;
                    try {
                        await updateDoc(doc(db, 'kivu-oeuvres', id),
                         { 
                            likes: increment(1) });
                        const n = parseInt(this.textContent.replace('❤ ','')) || 0;
                        this.textContent = `❤ ${n + 1}`;
                        this.style.background = '#c0392b';
                        this.style.color = '#fff';
                    } catch(e) { console.error(e); }
                });
                });
 // Filtres
            filtresBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filtresBtns.forEach(b => b.classList.remove('actif'));
                    this.classList.add('actif');
                    const type = this.dataset.type;
                    let nb = 0;
                    document.querySelectorAll('.oeuvre-carte-page').forEach(c => {
                        const show = type === 'tous' || c.dataset.type === type;
                        c.classList.toggle('cache', !show);
                        if (show) nb++;
                    });
                    if (vide) vide.style.display = nb === 0 ? 'flex' : 'none';
                });
            });

            // Recherche
            if (rechInput) {
                rechInput.addEventListener('input', function() {
                    const val = this.value.toLowerCase().trim();
                    document.querySelectorAll('.oeuvre-carte-page').forEach(c => {
                        const nom = c.querySelector('.oeuvre-nom').textContent.toLowerCase();
                        c.classList.toggle('cache', val && !nom.includes(val));
                    });
                   });
                   }
        } catch(e) 
        { 
            console.error(e); 
        }
    }
    chargerOeuvresPage();
}
//  autentification 
function hashSimple(str) {
    
    let h = 0;
    for (let i = 0; i < str.length; i++)
         {
             h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; 
            }return h.toString(16);
}

async function creerSuperAdminSiAbsent() {
    // Vérifie si un super admin existe déjà
    const snap = await getDocs(collection(db, 'kivu-admins'));
    if (snap.empty) {
        await addDoc(collection(db, 'kivu-admins'), {
            nom: 'Super Admin',
            email: 'adminhubkivu@gmail.com',
            username: 'superadmin',
            motDePasse: hashSimple('Rubona2003@'),
            motSecurite: hashSimple('Bukavu'),
            role: 'super',
            dateCreation: new Date().toLocaleDateString('fr-FR')
        });
    }
}
// PAGE LOGIN

// ══════════════════════════════════════════
// CONNEXION UNIFIÉE (admin + artiste)
// ══════════════════════════════════════════
if (document.getElementById('cx-login-btn')) {

    creerSuperAdminSiAbsent().catch(console.error);

    window.connexionUnifiee = async function() {
        const userVal = document.getElementById('cx-login-user')?.value.trim().toLowerCase();
        const passVal = document.getElementById('cx-login-pass')?.value;
        const errEl   = document.getElementById('cx-login-erreur');
        errEl.style.display = 'none';
        if (!userVal || !passVal) {
            errEl.textContent = 'Remplissez tous les champs.';
            errEl.style.display = 'block'; return;
        }
        const btn = document.getElementById('cx-login-btn');
        btn.textContent = 'Connexion...'; btn.disabled = true;

        try {
            // 1. Chercher dans les admins
            const snapAdmins = await getDocs(collection(db, 'kivu-admins'));
            let admin = null;
            snapAdmins.forEach(d => {
                const a = d.data();
                const emailMatch    = (a.email||'').toLowerCase() === userVal;
                const usernameMatch = (a.username||'').toLowerCase() === userVal;
                const passMatch     = a.motDePasse === hashSimple(passVal);
                if ((emailMatch || usernameMatch) && passMatch) admin = { id: d.id, ...a };
            });
            if (admin) {
                sessionStorage.setItem('kivu-admin-ok', '1');
                sessionStorage.setItem('kivu-admin-id', admin.id);
                sessionStorage.setItem('kivu-admin-nom', admin.nom);
                sessionStorage.setItem('kivu-admin-role', admin.role);
                window.location.href = 'admin.html';
                return;
            }

            // 2. Chercher dans les artistes
            const snapArtistes = await getDocs(collection(db, 'kivu-artistes-comptes'));
            let artiste = null;
            snapArtistes.forEach(d => {
                const a = d.data();
                if ((a.email||'') === userVal && a.motDePasse === hashSimple(passVal))
                    artiste = { id: d.id, ...a };
            });
            if (artiste) {
                if (artiste.statut !== 'approuve') {
                    errEl.textContent = '⏳ Votre compte est en attente d\'approbation par l\'administrateur.';
                    errEl.style.display = 'block';
                    btn.textContent = 'Se connecter →'; btn.disabled = false; return;
                }
                sessionStorage.setItem('kivu-ea-id', artiste.id);
                window.location.href = 'artiste_espace.html';
                return;
            }

            // 3. Rien trouvé
            errEl.textContent = 'Email/username ou mot de passe incorrect.';
            errEl.style.display = 'block';
            btn.textContent = 'Se connecter →'; btn.disabled = false;

        } catch(e) {
            errEl.textContent = 'Erreur : ' + e.message;
            errEl.style.display = 'block';
            btn.textContent = 'Se connecter →'; btn.disabled = false;
        }
    };

    // Récupération unifiée (admin + artiste)
    window.verifierRecupUnifiee = async function() {
        const emailVal = document.getElementById('cx-recup-email')?.value.trim().toLowerCase();
        const motSec   = document.getElementById('cx-recup-mot-sec')?.value;
        const msgEl    = document.getElementById('cx-recup-msg');
        if (!emailVal || !motSec) {
            msgEl.textContent = 'Remplissez email et mot de sécurité.';
            msgEl.style.color = '#c0392b'; return;
        }
        try {
            let trouve = null; let type = null;
            // Chercher admin
            const snapA = await getDocs(collection(db, 'kivu-admins'));
            snapA.forEach(d => {
                const a = d.data();
                if ((a.email||'').toLowerCase() === emailVal && a.motSecurite === hashSimple(motSec))
                    { trouve = { id: d.id }; type = 'admin'; }
            });
            // Chercher artiste
            if (!trouve) {
                const snapE = await getDocs(collection(db, 'kivu-artistes-comptes'));
                snapE.forEach(d => {
                    const a = d.data();
                    if ((a.email||'').toLowerCase() === emailVal && a.motSecurite === hashSimple(motSec))
                        { trouve = { id: d.id }; type = 'artiste'; }
                });
            }
            if (trouve) {
                const bloc = document.getElementById('cx-recup-reset-bloc');
                bloc.style.display = 'block';
                bloc.dataset.compteId = trouve.id;
                bloc.dataset.type = type;
                msgEl.textContent = '✅ Identité vérifiée. Définissez un nouveau mot de passe.';
                msgEl.style.color = '#27ae60';
            } else {
                msgEl.textContent = 'Email ou mot de sécurité incorrect.';
                msgEl.style.color = '#c0392b';
            }
        } catch(e) { msgEl.textContent = 'Erreur : ' + e.message; msgEl.style.color = '#c0392b'; }
    };

    window.reinitialiserRecupUnifiee = async function() {
        const bloc     = document.getElementById('cx-recup-reset-bloc');
        const compteId = bloc?.dataset.compteId;
        const type     = bloc?.dataset.type;
        const newPass  = document.getElementById('cx-recup-new-pass')?.value;
        const msgEl    = document.getElementById('cx-recup-msg');
        if (!compteId || !newPass || newPass.length < 6) {
            msgEl.textContent = 'Mot de passe trop court (min. 6 caractères).';
            msgEl.style.color = '#c0392b'; return;
        }
        try {
            const coll = type === 'admin' ? 'kivu-admins' : 'kivu-artistes-comptes';
            await updateDoc(doc(db, coll, compteId), { motDePasse: hashSimple(newPass) });
            msgEl.textContent = '✅ Mot de passe réinitialisé ! Vous pouvez vous connecter.';
            msgEl.style.color = '#27ae60';
            setTimeout(() => { document.getElementById('cx-recup-bloc').style.display = 'none'; }, 2000);
        } catch(e) { msgEl.textContent = 'Erreur : ' + e.message; msgEl.style.color = '#c0392b'; }
    };
}

window.adminLogout = function() {
    sessionStorage.removeItem('kivu-admin-ok');
    sessionStorage.removeItem('kivu-admin-id');
    sessionStorage.removeItem('kivu-admin-nom');
    sessionStorage.removeItem('kivu-admin-role');
    window.location.href = 'connexion.html?tab=admin';
};

if (document.getElementById('panel-artistes')) {
    if (!sessionStorage.getItem('kivu-admin-ok')) { 
        window.location.href = 'connexion.html?tab=admin'; 
    }

    const currentAdminRole = sessionStorage.getItem('kivu-admin-role') || 'admin';
    const currentAdminId   = sessionStorage.getItem('kivu-admin-id') || '';
    const currentAdminNom  = sessionStorage.getItem('kivu-admin-nom') || 'Admin';
    const estSuperAdmin    = currentAdminRole === 'super';


    const nomEl = document.getElementById('admin-nom-connecte');
    if (nomEl) nomEl.textContent = currentAdminNom + (estSuperAdmin ? ' (Super Admin)' : '');

    window.adminToast = function adminToast(msg) {
        const t = document.getElementById('admin-toast');
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2500);
    }
    async function chargerArtistes() {
        const liste = document.getElementById('liste-artistes');
        const count = document.getElementById('count-artistes');
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-artistes'));
            if (snap.empty) { 
                liste.innerHTML = '<div class="admin-vide">Aucun artiste.</div>';
                 count.textContent = '0 artiste(s)'; 
                 return;
                 }
            liste.innerHTML = '';
            count.textContent = snap.size + ' artiste(s)';
            snap.forEach(d => {
                const a = d.data();
                liste.innerHTML += `
                    <div class="admin-item" id="item-art-${d.id}">
                        <div class="admin-item-info">
                        <div class="admin-item-nom">${a.nom}</div>
                        <div class="admin-item-meta">${a.filiere} · ${a.ville || 'Bukavu'} · ❤ ${a.likes || 0}</div>
                        </div>
                        <div style="display:flex;gap:0.5rem;">
                            <button class="admin-btn-edit" onclick="modifierArtiste('${d.id}')">Modifier</button>
                            <button class="admin-btn-delete" onclick="supprimerArtiste('${d.id}')">Supprimer</button>
                        </div>
                    </div>`;
            });
        } catch(e) {
             liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; 
            }
    }

    async function chargerOeuvres() {
        const liste = document.getElementById('liste-oeuvres');
        const count = document.getElementById('count-oeuvres');
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-oeuvres'));
            if (snap.empty) { 
                liste.innerHTML = '<div class="admin-vide">Aucune œuvre.</div>'; 
                count.textContent = '0 œuvre(s)';
                 return;
                 }
            liste.innerHTML = '';
            count.textContent = snap.size + ' œuvre(s)';
            snap.forEach(d => {
                const o = d.data();
                liste.innerHTML += `
                    <div class="admin-item" id="item-oeu-${d.id}">
                        <div class="admin-item-info">
                    <div class="admin-item-nom">${o.titre}</div>
                       <div class="admin-item-meta">${o.type} · ${o.artiste} · ❤ ${o.likes || 0}</div>
                        </div>
                        <div style="display:flex;gap:0.5rem;">
                            <button class="admin-btn-edit" onclick="modifierOeuvre('${d.id}')">✏ Modifier</button>
                            <button class="admin-btn-delete" onclick="supprimerOeuvre('${d.id}')">Supprimer</button>
                        </div>
                    </div>`;
            });
        } catch(e) { liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }

    async function chargerNews() {
        const liste = document.getElementById('liste-news');
        const count = document.getElementById('count-news');
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-news'));
            if (snap.empty) { 
                liste.innerHTML = '<div class="admin-vide">Aucune actualité.</div>'; 
                count.textContent = '0 actualité(s)'; return;
             }
            liste.innerHTML = '';
            count.textContent = snap.size + ' actualité(s)';
            snap.forEach(d => {
                const n = d.data();
                liste.innerHTML += `
                    <div class="admin-item" id="item-news-${d.id}">
                        <div class="admin-item-info">
                            <div class="admin-item-nom">${n.titre}</div>
                            <div class="admin-item-meta">${n.cat} · ${n.date}</div>
                        </div>
                        <div style="display:flex;gap:0.5rem;">
                            <button class="admin-btn-edit" onclick="modifierNews('${d.id}')">✏ Modifier</button>
                            <button class="admin-btn-delete" onclick="supprimerNews('${d.id}')">Supprimer</button>
                        </div>
                    </div>`;
            });
        } catch(e) { 
            liste.innerHTML = '<div class="admin-vide">Erreur.</div>';
         }
    }

    //messages 
    async function chargerMessages() {
        const liste = document.getElementById('liste-messages');
        const count = document.getElementById('count-messages');
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-messages'));
            if (snap.empty) { liste.innerHTML =
                 '<div class="admin-vide">Aucun message.</div>'; 
                 count.textContent = '0 message(s)'; return;
                 }
            liste.innerHTML = '';
            count.textContent = snap.size + ' message(s)';
            snap.forEach(d => {
                const m = d.data();
                liste.innerHTML += `
                    <div class="admin-message-item">
                        <div class="admin-message-header">
                            <div>
                                <div class="admin-message-nom">
                                ${m.nom}</div>
                                <div class="admin-message-email">
                                ${m.email}</div>
                                ${m.artiste ? 
                                    `<div class="admin-item-meta">Pour : 
                                    ${m.artiste}</div>` : ''}
                            </div>
                            <div>
                                <div class="admin-message-date">${m.date||''}</div>
                                <button class="admin-btn-delete" onclick="supprimerMessage('${d.id}')">Supprimer</button>
                            </div>
                        </div>
                        ${m.sujet ?
                             `<div class="admin-message-sujet">${m.sujet}</div>` : ''}
                        <div class="admin-message-texte">${m.message}</div>
                    </div>`;
            });
        } catch(e) { liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }

    // Top Likes
    async function chargerTopLikes() {
        const liste = document.getElementById('liste-top-likes');
        if (!liste) return;
        try {
            const snap = await getDocs(collection(db, 'kivu-artistes'));
            const artistes = [];
            snap.forEach(d => artistes.push({ id: d.id, ...d.data() }));
            artistes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            liste.innerHTML = '';
            artistes.slice(0, 10).forEach((a, i) => {
                liste.innerHTML += `
                    <div class="admin-item">
                        <div class="admin-item-info">
                            <div class="admin-item-nom">${i + 1}. ${a.nom}</div>
                            <div class="admin-item-meta">${a.filiere} · ${a.ville || 'Bukavu'}</div>
                        </div>
                        <div style="font-size:1.2rem;font-weight:700;color:#c0392b;">❤ ${a.likes || 0}</div>
                    </div>`;
            });
        } catch(e) { 
            liste.innerHTML = '<div class="admin-vide">Erreur.</div>';
         }
    }

    //  Tabs 
    window.adminTab = function(nom) {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('actif'));
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('actif'));
        document.querySelectorAll('.admin-tab').forEach(t => {
            if (t.textContent.toLowerCase().includes(nom) || t.dataset.tab === nom) t.classList.add('actif');
        });
        const panel = document.getElementById('panel-' + nom);
        if (panel) panel.classList.add('actif');
        if (nom === 'artistes') chargerArtistes();
        if (nom === 'oeuvres')  chargerOeuvres();
        if (nom === 'news')     chargerNews();
        if (nom === 'messages') chargerMessages();
        if (nom === 'toplikes') chargerTopLikes();
    };

    // ── Ajout artiste ──
    window.adminAjouterArtiste = async function() {
        const nom     = document.getElementById('art-nom').value.trim();
        const filiere = document.getElementById('art-filiere').value;
        const bio     = document.getElementById('art-bio').value.trim();
        const tel     = document.getElementById('art-tel').value.trim();
        const email   = document.getElementById('art-email').value.trim();
        const ville   = document.getElementById('art-ville').value.trim();
        const photoEl = document.getElementById('art-photo');
        if (photoEl && photoEl.dataset.fileData) photoEl.value = photoEl.dataset.fileData;
        const photo   = photoEl ? photoEl.value.trim() : '';
        if (!nom || !filiere) { alert('Nom et filière obligatoires.'); return; }
        try {
            await addDoc(collection(db, 'kivu-artistes'),
             { nom, filiere, bio, tel, email, ville: ville||'Bukavu, Sud-Kivu', photo, likes: 0, date: new Date().toLocaleDateString('fr-FR') });
            adminToast('Artiste ajouté !');
            ['art-nom','art-bio','art-tel','art-email','art-ville','art-photo'].forEach(i => document.getElementById(i).value = '');
            document.getElementById('art-filiere').value = '';
            chargerArtistes();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    // Modifier artiste 
    window.modifierArtiste = async function(id) {
        try {
            const snap = await getDoc(doc(db, 'kivu-artistes', id));
            if (!snap.exists()) return;
            const a = snap.data();
            document.getElementById('art-nom').value = a.nom || '';
            document.getElementById('art-filiere').value= a.filiere || '';
            document.getElementById('art-bio').value  = a.bio || '';
            document.getElementById('art-tel').value  = a.tel || '';
            document.getElementById('art-email').value = a.email || '';
            document.getElementById('art-ville').value= a.ville || '';
            document.getElementById('art-photo').value = a.photo || '';
            
            const btn = document.querySelector('.admin-btn-add');
            btn.textContent = '💾 Enregistrer les modifications';
            btn.onclick = async function() {
                const newNom  = document.getElementById('art-nom').value.trim();
                const newFiliere = document.getElementById('art-filiere').value;
                if (!newNom ||!newFiliere) { 
                    alert('Nom et filière obligatoires.'); return;
                 }
                const photoEl2 = document.getElementById('art-photo');
                if (photoEl2 && photoEl2.dataset.fileData) photoEl2.value = photoEl2.dataset.fileData;
                try {
                    await updateDoc(doc(db, 'kivu-artistes', id), {
                        nom:newNom,
                        filiere: newFiliere,
                        bio:  document.getElementById('art-bio').value.trim(),
                        tel:  document.getElementById('art-tel').value.trim(),
                        email: document.getElementById('art-email').value.trim(),
                        ville: document.getElementById('art-ville').value.trim() || 'Bukavu, Sud-Kivu',
                        photo:document.getElementById('art-photo').value.trim()
                    });
                    adminToast('Artiste modifié !');
                    btn.textContent = '+ Ajouter l\'artiste';
                    btn.onclick = window.adminAjouterArtiste;
                    ['art-nom','art-bio','art-tel','art-email','art-ville','art-photo'].forEach(i => document.getElementById(i).value = '');
                    document.getElementById('art-filiere').value = '';
                    chargerArtistes();
                } catch(e) { alert('Erreur : ' + e.message); }
            };
            document.querySelector('.admin-form-bloc').scrollIntoView({ behavior: 'smooth' });
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    // Supprimer artiste 
    window.supprimerArtiste = async function(id) {
        if (!confirm('Supprimer cet artiste ?')) return;
        await deleteDoc(doc(db, 'kivu-artistes', id));
        adminToast('Supprimé.'); chargerArtistes();
    };

    // Ajout œuvre 
    window.adminAjouterOeuvre = async function() {
        const titre = document.getElementById('oeu-titre').value.trim();
        const type = document.getElementById('oeu-type').value;
        const artiste = document.getElementById('oeu-artiste').value.trim();
        const annee = document.getElementById('oeu-annee').value.trim();
        const urlEl = document.getElementById('oeu-url');
        if (urlEl && urlEl.dataset.fileData) urlEl.value = urlEl.dataset.fileData;
        const url = urlEl ? urlEl.value.trim() : '';
        const desc    = document.getElementById('oeu-desc').value.trim();
        if (!titre || !type || !artiste)
            { alert('Titre, type et artiste obligatoires.'); return; 

            }
        try {
            await addDoc(collection(db, 'kivu-oeuvres'),
             { titre, type, artiste, annee, url, desc, likes: 0, date: new Date().toLocaleDateString('fr-FR')
                
             });
            adminToast('Œuvre ajoutée !');
            ['oeu-titre','oeu-artiste','oeu-annee','oeu-url','oeu-desc'].forEach(i => document.getElementById(i).value = '');
            document.getElementById('oeu-type').value = '';
            chargerOeuvres();
        } catch(e) { 
            alert('Erreur : ' + e.message); 

        }
    };
    // Modifier œuvre 
    window.modifierOeuvre = async function(id) {
        try {
            const snap = await getDoc(doc(db, 'kivu-oeuvres', id));
            if (!snap.exists()) return;
            const o = snap.data();
            document.getElementById('oeu-titre').value = o.titre || '';
            document.getElementById('oeu-type').value = o.type || '';
            document.getElementById('oeu-artiste').value = o.artiste || '';
            document.getElementById('oeu-annee').value = o.annee || '';
            document.getElementById('oeu-url').value  = o.url || '';
            document.getElementById('oeu-desc').value = o.desc || '';
            const btn = document.querySelector('#panel-oeuvres .admin-btn-add');
            btn.textContent = '💾 Enregistrer les modifications';
            btn.onclick = async function() {
                const newTitre = document.getElementById('oeu-titre').value.trim();
                const newType = document.getElementById('oeu-type').value;
                const newArtiste= document.getElementById('oeu-artiste').value.trim();
                if (!newTitre || !newType || !newArtiste) { alert('Titre, type et artiste obligatoires.'); 
                    return;

                }
                const urlEl2 = document.getElementById('oeu-url');
                if (urlEl2 && urlEl2.dataset.fileData) urlEl2.value = urlEl2.dataset.fileData;
                try {
                    await updateDoc(doc(db, 'kivu-oeuvres', id), {
                        titre:   newTitre,
                        type:    newType,
                        artiste: newArtiste,
                        annee:   document.getElementById('oeu-annee').value.trim(),
                        url:     document.getElementById('oeu-url').value.trim(),
                        desc:    document.getElementById('oeu-desc').value.trim()
                    });
                    adminToast('Œuvre modifiée !');
                    btn.textContent = '+ Ajouter l\'œuvre';
                    btn.onclick = window.adminAjouterOeuvre;
                    ['oeu-titre','oeu-artiste','oeu-annee','oeu-url','oeu-desc'].forEach(i => document.getElementById(i).value = '');
                    document.getElementById('oeu-type').value = '';
                    chargerOeuvres();
                } catch(e) { alert('Erreur : ' + e.message); }
            };
            document.querySelector('#panel-oeuvres .admin-form-bloc').scrollIntoView({ 
                behavior: 'smooth' 
            });
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    // Supprimer œuvre
    window.supprimerOeuvre = async function(id) {
        if (!confirm('Supprimer cette œuvre ?')) return;
        await deleteDoc(doc(db, 'kivu-oeuvres', id));
        adminToast('Supprimé.'); chargerOeuvres();
    };

    //Ajout news 
    window.adminAjouterNews = async function() {
        const titre = document.getElementById('news-titre-admin').value.trim();
        const cat   = document.getElementById('news-cat').value;
        const texte = document.getElementById('news-texte-admin').value.trim();
        if (!titre || !texte) { alert('Titre et texte obligatoires.'); return; }
        try {
            await addDoc(collection(db, 'kivu-news'), 
            { titre, cat, texte, date: new Date().toLocaleDateString('fr-FR',
                 { 
                    day:'numeric', month:'long', year:'numeric' 
                }) 
            });
            adminToast('Publié !');
            document.getElementById('news-titre-admin').value = '';
            document.getElementById('news-texte-admin').value = '';
            chargerNews();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    //  Modifier news 
    window.modifierNews = async function(id) {
        try {
            const snap = await getDoc(doc(db, 'kivu-news', id));
            if (!snap.exists()) return;
            const n = snap.data();
            document.getElementById('news-titre-admin').value = n.titre || '';
            document.getElementById('news-cat').value         = n.cat || 'artiste';
            document.getElementById('news-texte-admin').value = n.texte || '';
            const btn = document.querySelector('#panel-news .admin-btn-add');
            btn.textContent = ' Enregistrer les modifications';
            btn.onclick = async function() {
                const newTitre = document.getElementById('news-titre-admin').value.trim();
                const newTexte = document.getElementById('news-texte-admin').value.trim();
                if (!newTitre || !newTexte) { alert('Titre et texte obligatoires.'); return; }
                try {
                    await updateDoc(doc(db, 'kivu-news', id), {
                        titre: newTitre,
                        cat:   document.getElementById('news-cat').value,
                        texte: newTexte
                    });
                    adminToast('Actualité modifiée !');
                    btn.textContent = '+ Publier l\'actualité';
                    btn.onclick = window.adminAjouterNews;
                    document.getElementById('news-titre-admin').value = '';
                    document.getElementById('news-texte-admin').value = '';
                    chargerNews();
                } catch(e) { alert('Erreur : ' + e.message); }
            };
            document.querySelector('#panel-news .admin-form-bloc').scrollIntoView({ behavior: 'smooth' });
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    //  Supprimer news 
    window.supprimerNews = async function(id) {
        if (!confirm('Supprimer cette actualité ?')) return;
        await deleteDoc(doc(db, 'kivu-news', id));
        adminToast('Supprimé.'); chargerNews();
    };
    // Supprimer message 
    window.supprimerMessage = async function(id) {
        if (!confirm('Supprimer ce message ?')) return;
        await deleteDoc(doc(db, 'kivu-messages', id));
        adminToast('Supprimé.'); chargerMessages();
    };

    // gestions des compte admin
    async function chargerAdmins() {
        if (!estSuperAdmin) return;  
        const liste = document.getElementById('liste-admins');
        const count = document.getElementById('count-admins');
        if (!liste) return;
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-admins'));
            liste.innerHTML = '';
            if (count) count.textContent = snap.size + ' compte(s)';
            snap.forEach(d => {
                const a = d.data();
                const estLui = d.id === currentAdminId;
                liste.innerHTML += `
                    <div class="admin-item">
                        <div class="admin-item-info">
                            <div class="admin-item-nom">${a.nom} ${a.role === 'super' ? '' : ''}</div>
                            <div class="admin-item-meta">
                                ${a.email} · @${a.username} · <strong>${a.role === 'super' ? 'Super Admin' : 'Admin'}</strong>
                            </div>
                        </div>
                        <div style="display:flex;gap:0.5rem;">
                            ${!estLui && a.role !== 'super' ? 
                                `<button class="admin-btn-delete" 
                                onclick="supprimerAdmin('${d.id}')">Supprimer</button>` : ''
                            }
                            ${estLui ? '<span style="font-size:0.8rem;color:#888;">(vous)</span>' : ''}
                        </div>
                    </div>`;
            });
        } catch(e) { if (liste) liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }
    window.adminAjouterAdmin = async function() {
        if (!estSuperAdmin) { alert('Accès refusé.'); return; }
        const nom   = document.getElementById('new-admin-nom')?.value.trim();
        const email  = document.getElementById('new-admin-email')?.value.trim().toLowerCase();
        const username = document.getElementById('new-admin-username')?.value.trim().toLowerCase();
        const pass  = document.getElementById('new-admin-pass')?.value;
        const motSec = document.getElementById('new-admin-mot-sec')?.value.trim();
        if (!nom || !email || !username || !pass || !motSec) { alert('Tous les champs sont obligatoires.'); return; }
        if (pass.length < 6) { alert('Mot de passe trop court (min. 6 caractères).'); return; }
        try {
            // Vérifier unicité email/username
            const snap = await getDocs(collection(db, 'kivu-admins'));
            let doublon = false;
            snap.forEach(d => {
                const a = d.data();
                if ((a.email || '') === email || (a.username || '') === username) doublon = true;
            });
            if (doublon) { 
                alert('Email ou username déjà utilisé.'); return;

             }
            await addDoc(collection(db, 'kivu-admins'), {
                nom, email, username,
                motDePasse: hashSimple(pass),
                motSecurite: hashSimple(motSec),
                role: 'admin',
                dateCreation: new Date().toLocaleDateString('fr-FR')
            });
            adminToast('Admin créé !');
            ['new-admin-nom','new-admin-email','new-admin-username','new-admin-pass','new-admin-mot-sec'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            chargerAdmins();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    window.supprimerAdmin = async function(id) {
        if (!estSuperAdmin) { alert('Accès refusé.'); return; }
        if (!confirm('Supprimer ce compte admin ?')) return;
        await deleteDoc(doc(db, 'kivu-admins', id));
        adminToast('Compte supprimé.'); chargerAdmins();
    };
    // Cacher la tab "Admins" si pas super admin

    if (!estSuperAdmin) {
        const tabAdmins = document.querySelector('[onclick*="admins-comptes"]');
        if (tabAdmins) tabAdmins.style.display = 'none';
        const panelAdmins = document.getElementById('panel-admins-comptes');
        if (panelAdmins) panelAdmins.style.display = 'none';
    }

    // Mise à jour adminTab pour inclure le nouveau panel 

    const _origAdminTab = window.adminTab;
    window.adminTab = function(nom) {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('actif'));
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('actif'));
// Trouver le bon tab

        document.querySelectorAll('.admin-tab').forEach(t => {
            if (t.getAttribute('onclick')?.includes(nom)) t.classList.add('actif');
        });
        const panel = document.getElementById('panel-' + nom);
        if (panel) panel.classList.add('actif');
        if(nom === 'artistes')chargerArtistes();
        if (nom === 'oeuvres') chargerOeuvres();
        if(nom === 'news') chargerNews();
        if (nom === 'messages')chargerMessages();
        if (nom === 'toplikes')chargerTopLikes();
        if (nom === 'admins-comptes') chargerAdmins();
        if (nom === 'mon-compte') { /* panel already visible */ }
    };

    chargerArtistes();
}
window.modifierEmail = async function() {
    const currentAdminId = sessionStorage.getItem('kivu-admin-id') || '';
    const newEmail = document.getElementById('compte-email').value.trim().toLowerCase();
    const pass = document.getElementById('compte-pass-confirm').value;
    if (!newEmail || !pass) 

        { alert('Remplissez tous les champs.'); return; 

        }
    try {
        const snap = await getDoc(doc(db, 'kivu-admins', currentAdminId));
        if (!snap.exists() || snap.data().motDePasse !== hashSimple(pass))
             { alert('Mot de passe incorrect.'); return; 

             }
        await updateDoc(doc(db, 'kivu-admins', currentAdminId),
         { email: newEmail });
        adminToast('Email modifié !');
        document.getElementById('compte-email').value = '';
        document.getElementById('compte-pass-confirm').value = '';
    } catch(e) {
         alert('Erreur : ' + e.message);
         }
};

window.modifierMotDePasse = async function() {
    const currentAdminId = sessionStorage.getItem('kivu-admin-id') || '';
    const ancienPass = document.getElementById('compte-ancien-pass').value;
    const newPass = document.getElementById('compte-new-pass').value;
    if (!ancienPass || !newPass) 
        { alert('Remplissez tous les champs.');
             return; }
    if (newPass.length < 6) 
        { alert('Mot de passe trop court.'); return;

         }
    try {
        const snap = await getDoc(doc(db, 'kivu-admins', currentAdminId));
        if (!snap.exists() || snap.data().motDePasse !== hashSimple(ancienPass))
             { alert('Mot de passe actuel incorrect.'); return; }
        await updateDoc(doc(db, 'kivu-admins', currentAdminId),
         { 
            motDePasse: hashSimple(newPass) 
        });
        adminToast('Mot de passe modifié !');
        document.getElementById('compte-ancien-pass').value = '';
        document.getElementById('compte-new-pass').value = '';
    } catch(e) 
    {
         alert('Erreur : ' + e.message);
         }
};
// ══════════════════════════════════════════
// INSCRIPTION ARTISTE
// ══════════════════════════════════════════
if (document.getElementById('insc-form')) {
    window.soumettreDemande = async function() {
        const prenom = document.getElementById('insc-prenom').value.trim();
        const nom    = document.getElementById('insc-nom').value.trim();
        const email  = document.getElementById('insc-email').value.trim().toLowerCase();
        const tel    = document.getElementById('insc-tel').value.trim();
        const naiss  = document.getElementById('insc-naissance').value;
        const adr    = document.getElementById('insc-adresse').value.trim();
        const fil    = document.getElementById('insc-filiere').value;
        const desc   = document.getElementById('insc-description').value.trim();
        const pass   = document.getElementById('insc-pass').value;
        const pass2  = document.getElementById('insc-pass2').value;
        const errEl  = document.getElementById('insc-erreur');
        errEl.style.display = 'none';

        if (!prenom||!nom||!email||!tel||!naiss||!adr||!fil||!desc||!pass||!pass2) {
            errEl.textContent = 'Tous les champs obligatoires doivent être remplis.';
            errEl.style.display = 'block'; return;
        }
        if (pass !== pass2) {
            errEl.textContent = 'Les mots de passe ne correspondent pas.';
            errEl.style.display = 'block'; return;
        }
        if (pass.length < 6) {
            errEl.textContent = 'Mot de passe trop court (min. 6 caractères).';
            errEl.style.display = 'block'; return;
        }
        const btn = document.querySelector('.insc-btn') || document.querySelector('#cx-panel-inscription .cx-btn');
        btn.disabled = true; btn.textContent = 'Envoi en cours...';
        try {
            // Vérifier si email déjà utilisé
            const snap = await getDocs(collection(db, 'kivu-artistes-comptes'));
            let doublon = false;
            snap.forEach(d => { if ((d.data().email||'') === email) doublon = true; });
            if (doublon) {
                errEl.textContent = 'Cet email est déjà utilisé.';
                errEl.style.display = 'block';
                btn.disabled = false; btn.textContent = 'Envoyer ma demande →'; return;
            }
            await addDoc(collection(db, 'kivu-artistes-comptes'), {
                prenom, nom, email, tel, naiss, adresse: adr, filiere: fil,
                description: desc, motDePasse: hashSimple(pass),
                statut: 'en_attente',
                profilPublie: false,
                dateInscription: new Date().toLocaleDateString('fr-FR')
            });
            document.getElementById('insc-form').style.display = 'none';
            document.getElementById('insc-success').style.display = 'block';
        } catch(e) {
            errEl.textContent = 'Erreur : ' + e.message;
            errEl.style.display = 'block';
            btn.disabled = false; btn.textContent = 'Envoyer ma demande →';
        }
    };
}

// ══════════════════════════════════════════
// ESPACE ARTISTE
// ══════════════════════════════════════════
if (document.getElementById('ea-dashboard') || document.getElementById('ea-login-email')) {
    let eaCompteId = null;
    let eaCompteData = null;

    function eaToast(msg) {
        const t = document.getElementById('ea-toast');
        t.textContent = msg; t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2500);
    }

    // Vérifier session
    const eaSession = sessionStorage.getItem('kivu-ea-id');
    if (eaSession) {
        eaCompteId = eaSession;
        chargerEspaceArtiste();
    }

    window.eaLogin = async function() {
        const email = document.getElementById('ea-login-email').value.trim().toLowerCase();
        const pass  = document.getElementById('ea-login-pass').value;
        const errEl = document.getElementById('ea-login-erreur');
        errEl.style.display = 'none';
        if (!email || !pass) { errEl.textContent = 'Remplissez tous les champs.'; errEl.style.display = 'block'; return; }
        const btn = document.querySelector('#cx-panel-artiste .cx-btn') || document.querySelector('#ea-login-section .ea-btn');
        btn.disabled = true; btn.textContent = 'Connexion...';
        try {
            const snap = await getDocs(collection(db, 'kivu-artistes-comptes'));
            let trouve = null;
            snap.forEach(d => {
                const a = d.data();
                if ((a.email||'') === email && a.motDePasse === hashSimple(pass)) trouve = { id: d.id, ...a };
            });
            if (!trouve) {
                errEl.textContent = 'Email ou mot de passe incorrect.';
                errEl.style.display = 'block';
                btn.disabled = false; btn.textContent = 'Se connecter →'; return;
            }
            if (trouve.statut !== 'approuve') {
                errEl.textContent = '⏳ Votre compte est en attente d\'approbation par l\'administrateur.';
                errEl.style.display = 'block';
                btn.disabled = false; btn.textContent = 'Se connecter →'; return;
            }
            eaCompteId = trouve.id;
            eaCompteData = trouve;
            sessionStorage.setItem('kivu-ea-id', trouve.id);
            afficherDashboard();
        } catch(e) {
            errEl.textContent = 'Erreur : ' + e.message;
            errEl.style.display = 'block';
            btn.disabled = false; btn.textContent = 'Se connecter →';
        }
    };

    async function chargerEspaceArtiste() {
        try {
            const snap = await getDoc(doc(db, 'kivu-artistes-comptes', eaCompteId));
            if (!snap.exists()) { sessionStorage.removeItem('kivu-ea-id'); return; }
            eaCompteData = snap.data();
            if (eaCompteData.statut !== 'approuve') {
                document.getElementById('ea-login-erreur').textContent = '⏳ Votre compte est en attente d\'approbation.';
                document.getElementById('ea-login-erreur').style.display = 'block';
                return;
            }
            afficherDashboard();
        } catch(e) { sessionStorage.removeItem('kivu-ea-id'); }
    }

    function afficherDashboard() {
        // If we are on connexion.html, redirect to artiste_espace.html
        if (window.location.pathname.includes('connexion')) {
            window.location.href = 'artiste_espace.html';
            return;
        }
        const loginSection = document.getElementById('ea-login-section');
        const dashboard = document.getElementById('ea-dashboard');
        if (loginSection) loginSection.style.display = 'none';
        if (dashboard) dashboard.style.display = 'flex';
        const nomEl = document.getElementById('ea-nom-connecte');
        if (nomEl) nomEl.textContent = (eaCompteData.prenom||'') + ' ' + (eaCompteData.nom||'');
        remplirFormulaireProf();
        chargerMesOeuvres();
    }

    function remplirFormulaireProf() {
        const d = eaCompteData;
        document.getElementById('ea-nom').value = d.nomArtiste || (d.prenom + ' ' + d.nom) || '';
        document.getElementById('ea-filiere').value = d.filiere || '';
        document.getElementById('ea-ville').value = d.ville || '';
        document.getElementById('ea-tel').value = d.tel || '';
        document.getElementById('ea-email-contact').value = d.emailContact || d.email || '';
        document.getElementById('ea-bio').value = d.bio || '';
        document.getElementById('ea-photo-url').value = d.photo || '';
        // preview
        const nomArt = d.nomArtiste || (d.prenom + ' ' + d.nom);
        document.getElementById('ea-preview-nom').textContent = nomArt;
        document.getElementById('ea-preview-filiere').textContent = d.filiere || '';
        document.getElementById('ea-preview-ville').textContent = d.ville ? '📍 ' + d.ville : '';
        const av = document.getElementById('ea-avatar-preview');
        if (d.photo) { av.innerHTML = `<img src="${d.photo}" alt="">`; } 
        else { const emojis={musique:'🎵',danse:'💃',theatre:'🎭',peinture:'🎨',sculpture:'🗿',cinema:'🎬',artisanat:'🏺'}; av.textContent = emojis[d.filiere]||'🎭'; }
        // bouton publier/dépublier
        if (d.profilPublie) {
            document.getElementById('ea-pub-btn').style.display = 'none';
            document.getElementById('ea-depub-btn').style.display = 'inline-block';
        } else {
            document.getElementById('ea-pub-btn').style.display = 'inline-block';
            document.getElementById('ea-depub-btn').style.display = 'none';
        }
    }

    window.sauvegarderProfil = async function() {
        const nom = document.getElementById('ea-nom').value.trim();
        const fil = document.getElementById('ea-filiere').value;
        if (!nom || !fil) { alert('Nom et filière obligatoires.'); return; }
        const photoUrl = document.getElementById('ea-photo-url');
        if (photoUrl.dataset.fileData) photoUrl.value = photoUrl.dataset.fileData;
        try {
            await updateDoc(doc(db, 'kivu-artistes-comptes', eaCompteId), {
                nomArtiste: nom, filiere: fil,
                ville: document.getElementById('ea-ville').value.trim(),
                tel: document.getElementById('ea-tel').value.trim(),
                emailContact: document.getElementById('ea-email-contact').value.trim(),
                bio: document.getElementById('ea-bio').value.trim(),
                photo: photoUrl.value.trim()
            });
            // Mettre à jour aussi dans kivu-artistes si profil lié
            if (eaCompteData.artisteId) {
                await updateDoc(doc(db, 'kivu-artistes', eaCompteData.artisteId), {
                    nom, filiere: fil,
                    ville: document.getElementById('ea-ville').value.trim(),
                    tel: document.getElementById('ea-tel').value.trim(),
                    email: document.getElementById('ea-email-contact').value.trim(),
                    bio: document.getElementById('ea-bio').value.trim(),
                    photo: photoUrl.value.trim()
                });
            }
            eaCompteData = { ...eaCompteData, nomArtiste: nom, filiere: fil };
            eaToast('Profil enregistré !');
            remplirFormulaireProf();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    window.publierProfil = async function() {
        if (!confirm('Publier votre profil sur la plateforme ?')) return;
        try {
            const d = eaCompteData;
            const nom = document.getElementById('ea-nom').value.trim() || d.prenom + ' ' + d.nom;
            const fil = document.getElementById('ea-filiere').value || d.filiere;
            const photoEl = document.getElementById('ea-photo-url');
            if (photoEl.dataset.fileData) photoEl.value = photoEl.dataset.fileData;
            let artisteId = d.artisteId;
            if (!artisteId) {
                // Créer dans kivu-artistes
                const ref = await addDoc(collection(db, 'kivu-artistes'), {
                    nom, filiere: fil,
                    ville: document.getElementById('ea-ville').value.trim() || 'Kivu',
                    tel: document.getElementById('ea-tel').value.trim() || d.tel,
                    email: document.getElementById('ea-email-contact').value.trim() || d.email,
                    bio: document.getElementById('ea-bio').value.trim() || d.description,
                    photo: photoEl.value.trim(),
                    likes: 0,
                    compteId: eaCompteId,
                    date: new Date().toLocaleDateString('fr-FR')
                });
                artisteId = ref.id;
            }
            await updateDoc(doc(db, 'kivu-artistes-comptes', eaCompteId), {
                profilPublie: true, artisteId
            });
            eaCompteData.profilPublie = true;
            eaCompteData.artisteId = artisteId;
            eaToast('Profil publié ! Il est maintenant visible sur la plateforme.');
            remplirFormulaireProf();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    window.depublierProfil = async function() {
        if (!confirm('Retirer votre profil de la plateforme publique ?')) return;
        try {
            if (eaCompteData.artisteId) {
                await deleteDoc(doc(db, 'kivu-artistes', eaCompteData.artisteId));
            }
            await updateDoc(doc(db, 'kivu-artistes-comptes', eaCompteId), {
                profilPublie: false, artisteId: null
            });
            eaCompteData.profilPublie = false;
            eaCompteData.artisteId = null;
            eaToast('Profil dépublié.');
            remplirFormulaireProf();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    async function chargerMesOeuvres() {
        const liste = document.getElementById('ea-liste-oeuvres');
        liste.innerHTML = '<div class="ea-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-oeuvres'));
            const nomArt = (eaCompteData.nomArtiste || (eaCompteData.prenom + ' ' + eaCompteData.nom)).toLowerCase().trim();
            const miennes = [];
            snap.forEach(d => { if ((d.data().compteId === eaCompteId) || (d.data().artiste||'').toLowerCase().trim() === nomArt) miennes.push({ id: d.id, ...d.data() }); });
            if (miennes.length === 0) { liste.innerHTML = '<div class="ea-vide">🖼 Aucune œuvre publiée pour l\'instant.<br><br><a href="#" onclick="eaTab(\'ajouter-oeuvre\')" style="color:#c0392b;font-weight:700;">+ Ajouter une œuvre</a></div>'; return; }
            liste.innerHTML = '';
            miennes.forEach(o => {
                liste.innerHTML += `<div class="ea-oeuvre-item">
                    <div>
                        <div class="ea-oeuvre-nom">${o.titre}</div>
                        <div class="ea-oeuvre-meta">${o.type} · ${o.annee||''}</div>
                    </div>
                    <div class="ea-oeuvre-actions">
                        <button class="ea-btn-edit" onclick="eaModifierOeuvre('${o.id}')">✏ Modifier</button>
                        <button class="ea-btn-delete" onclick="eaSupprimerOeuvre('${o.id}')">🗑 Supprimer</button>
                    </div>
                </div>`;
            });
        } catch(e) { liste.innerHTML = '<div class="ea-vide">Erreur de chargement.</div>'; }
    }

    window.eaAjouterOeuvre = async function() {
        const titre = document.getElementById('ea-oeu-titre').value.trim();
        const type  = document.getElementById('ea-oeu-type').value;
        const annee = document.getElementById('ea-oeu-annee').value.trim();
        const urlEl = document.getElementById('ea-oeu-url');
        if (urlEl.dataset.fileData) urlEl.value = urlEl.dataset.fileData;
        const url   = urlEl.value.trim();
        const desc  = document.getElementById('ea-oeu-desc').value.trim();
        const nomArt = eaCompteData.nomArtiste || (eaCompteData.prenom + ' ' + eaCompteData.nom);
        if (!titre || !type) { alert('Titre et type obligatoires.'); return; }
        const btn = document.getElementById('ea-oeu-btn');
        btn.disabled = true; btn.textContent = 'Publication...';
        try {
            const editId = btn.dataset.editId;
            if (editId) {
                await updateDoc(doc(db, 'kivu-oeuvres', editId), { titre, type, annee, url, desc });
                eaToast('Œuvre modifiée !');
                btn.dataset.editId = '';
                document.getElementById('ea-oeu-titre-form').innerHTML = 'Ajouter une <span>œuvre</span>';
                btn.textContent = '➕ Publier l\'œuvre';
            } else {
                await addDoc(collection(db, 'kivu-oeuvres'), {
                    titre, type, annee, url, desc,
                    artiste: nomArt,
                    compteId: eaCompteId,
                    likes: 0,
                    date: new Date().toLocaleDateString('fr-FR')
                });
                eaToast('Œuvre publiée !');
                btn.textContent = '➕ Publier l\'œuvre';
            }
            ['ea-oeu-titre','ea-oeu-annee','ea-oeu-url','ea-oeu-desc'].forEach(i => document.getElementById(i).value = '');
            document.getElementById('ea-oeu-type').value = '';
            btn.disabled = false;
            eaTab('oeuvres');
            chargerMesOeuvres();
        } catch(e) { alert('Erreur : ' + e.message); btn.disabled = false; }
    };

    window.eaModifierOeuvre = async function(id) {
        const snap = await getDoc(doc(db, 'kivu-oeuvres', id));
        if (!snap.exists()) return;
        const o = snap.data();
        document.getElementById('ea-oeu-titre').value = o.titre||'';
        document.getElementById('ea-oeu-type').value  = o.type||'';
        document.getElementById('ea-oeu-annee').value = o.annee||'';
        document.getElementById('ea-oeu-url').value   = o.url||'';
        document.getElementById('ea-oeu-desc').value  = o.desc||'';
        const btn = document.getElementById('ea-oeu-btn');
        btn.textContent = '💾 Enregistrer les modifications';
        btn.dataset.editId = id;
        document.getElementById('ea-oeu-titre-form').innerHTML = 'Modifier l\'<span>œuvre</span>';
        eaTab('ajouter-oeuvre');
    };

    window.eaSupprimerOeuvre = async function(id) {
        if (!confirm('Supprimer cette œuvre ?')) return;
        await deleteDoc(doc(db, 'kivu-oeuvres', id));
        eaToast('Œuvre supprimée.');
        chargerMesOeuvres();
    };

    window.eaLogout = function() {
        sessionStorage.removeItem('kivu-ea-id');
        window.location.reload();
    };

    window.eaTab = function(nom) {
        document.querySelectorAll('.ea-tab').forEach(t => t.classList.remove('actif'));
        document.querySelectorAll('.ea-panel').forEach(p => p.classList.remove('actif'));
        document.querySelectorAll('.ea-tab').forEach(t => {
            if (t.getAttribute('onclick')?.includes(nom)) t.classList.add('actif');
        });
        const panel = document.getElementById('ea-panel-' + nom);
        if (panel) panel.classList.add('actif');
        if (nom === 'oeuvres') chargerMesOeuvres();
    };

    // Toggle photo mode
    window.togglePhotoMode = function(mode, btn) {
        document.querySelectorAll('.upload-toggle button').forEach(b => b.classList.remove('actif'));
        btn.classList.add('actif');
        document.getElementById('ea-photo-url').style.display = mode === 'url' ? 'block' : 'none';
        document.getElementById('ea-photo-file').style.display = mode === 'file' ? 'block' : 'none';
    };
    window.previewPhoto = function(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('ea-photo-url').dataset.fileData = e.target.result;
            document.getElementById('ea-photo-url').value = e.target.result;
            const prev = document.getElementById('ea-photo-preview');
            prev.src = e.target.result; prev.style.display = 'block';
        };
        reader.readAsDataURL(file);
    };
    window.toggleOeuMode = function(mode, btn) {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('actif'));
        btn.classList.add('actif');
        document.getElementById('ea-oeu-url').style.display = mode === 'url' ? 'block' : 'none';
        document.getElementById('ea-oeu-file').style.display = mode === 'file' ? 'block' : 'none';
    };
    window.handleOeuFile = function(input) {
        const file = input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('ea-oeu-url').dataset.fileData = e.target.result;
            document.getElementById('ea-oeu-url').value = e.target.result;
        };
        reader.readAsDataURL(file);
    };
}

// ══════════════════════════════════════════
// ADMIN — PANEL DEMANDES
// ══════════════════════════════════════════
if (document.getElementById('panel-artistes')) {
    async function chargerDemandes() {
        const liste = document.getElementById('liste-demandes');
        const count = document.getElementById('count-demandes');
        const badge = document.getElementById('badge-demandes');
        if (!liste) return;
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-artistes-comptes'));
            const demandes = [];
            snap.forEach(d => demandes.push({ id: d.id, ...d.data() }));
            const enAttente = demandes.filter(d => d.statut === 'en_attente');
            if (count) count.textContent = demandes.length + ' compte(s) · ' + enAttente.length + ' en attente';
            if (badge) {
                if (enAttente.length > 0) { badge.textContent = enAttente.length; badge.style.display = 'inline'; }
                else badge.style.display = 'none';
            }
            if (demandes.length === 0) { liste.innerHTML = '<div class="admin-vide">Aucune demande.</div>'; return; }
            liste.innerHTML = '';
            demandes.forEach(d => {
                const statutColor = d.statut === 'approuve' ? '#27ae60' : d.statut === 'refuse' ? '#c0392b' : '#f39c12';
                const statutLabel = d.statut === 'approuve' ? '✅ Approuvé' : d.statut === 'refuse' ? '❌ Refusé' : '⏳ En attente';
                liste.innerHTML += `<div class="admin-item" style="flex-direction:column;align-items:stretch;">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
                        <div class="admin-item-info">
                            <div class="admin-item-nom">${d.prenom||''} ${d.nom||''}</div>
                            <div class="admin-item-meta">${d.email} · ${d.tel||''} · ${d.filiere||''}</div>
                            <div class="admin-item-meta">📅 ${d.dateInscription||''} · <strong style="color:${statutColor}">${statutLabel}</strong></div>
                        </div>
                        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                            ${d.statut !== 'approuve' ? 
                                `<button class="admin-btn-edit" onclick="approuverArtiste('${d.id}')">✅ Approuver</button>` : ''}
                            ${d.statut !== 'refuse' ? 
                                `<button class="admin-btn-delete" onclick="refuserArtiste('${d.id}')">❌ Refuser</button>` : ''}
                            <button class="admin-btn-delete" onclick="supprimerDemande('${d.id}')">🗑 Supprimer</button>
                        </div>
                    </div>
                    ${d.description ?
                         `<div style="margin-top:0.5rem;
                         font-size:0.85rem;color:#555;
                         border-top:1px solid #eee;padding-top:0.5rem;
                         ">${d.description}</div>` : ''}
                </div>`;
            });
        } catch(e) { if (liste) liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }

    window.approuverArtiste = async function(id) {
        if (!confirm('Approuver ce compte artiste ?')) return;
        try {
            // Récupérer les infos de l'artiste
            const snap = await getDoc(doc(db, 'kivu-artistes-comptes', id));
            const d = snap.data();
            // Mettre à jour le statut
            await updateDoc(doc(db, 'kivu-artistes-comptes', id), 
            {
                 statut: 'approuve' 
                });
            // Envoyer email de confirmation à l'artiste
            await emailjsEnvoyer(EMAILJS_TEMPLATE_APR, {
                artiste_nom:   (d.prenom || '') + ' ' + (d.nom || ''),
                artiste_email: d.email
            });
            window.adminToast('Compte approuvé ! Email envoyé à ' + d.email);
        } catch(e) {
            window.adminToast('Approuvé (email non envoyé : ' + e.message + ')');
        }
        chargerDemandes();
    };
    window.refuserArtiste = async function(id) {
        if (!confirm('Refuser ce compte artiste ?')) return;
        await updateDoc(doc(db, 'kivu-artistes-comptes', id),
         {
             statut: 'refuse' });
        window.adminToast('Demande refusée.');
        chargerDemandes();
    };
    window.supprimerDemande = async function(id) {
        if (!confirm('Supprimer définitivement cette demande ?')) return;
        await deleteDoc(doc(db, 'kivu-artistes-comptes', id));
        window.adminToast('Demande supprimée.');
        chargerDemandes();
    };


    const _adminTabOrig2 = window.adminTab;
    window.adminTab = function(nom) {
        _adminTabOrig2(nom);
        if (nom === 'demandes') chargerDemandes();
    };

    chargerDemandes();
}
window.eaLogout = function() {
    // 1. Nettoyer les sessions locales pour déconnecter l'artiste
    localStorage.removeItem('artiste_connecte'); 
    localStorage.clear(); // Sécurité : vide le reste du stockage local si nécessaire

    // 2. Rediriger immédiatement vers la page de connexion
    window.location.href = "connexion.html"; 
};