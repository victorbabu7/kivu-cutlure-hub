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

//  NAV 
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}
const burger   = document.getElementById('burger');
const navLiens = document.querySelector('.nav-liens');
if (burger && navLiens) {
    burger.addEventListener('click', () => {
        navLiens.style.display = navLiens.style.display === 'flex' ? 'none' : 'flex';
        navLiens.style.flexDirection = 'column';
        navLiens.style.position = 'absolute';
        navLiens.style.top = '68px';
        navLiens.style.left = '0';
        navLiens.style.width = '100%';
        navLiens.style.background = '#fff';
        navLiens.style.padding = '1rem 5vw';
        navLiens.style.borderBottom = '1px solid #e8e4de';
    });
}
document.querySelectorAll('a[href^="#"]').forEach(lien => {
    lien.addEventListener('click', function(e) {
        const cible = document.querySelector(this.getAttribute('href'));
        if (cible) { e.preventDefault(); cible.scrollIntoView({ behavior: 'smooth' }); }
        if (navLiens) navLiens.style.display = 'none';
    });
});

// REVEAL
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ══ CONTACT INDEX ══
window.envoyerMessage = async function() {
    const nom     = document.getElementById('contact-nom')?.value.trim();
    const email   = document.getElementById('contact-email')?.value.trim();
    const sujet   = document.getElementById('contact-sujet')?.value;
    const message = document.getElementById('contact-message')?.value.trim();
    if (!nom || !email || !message) { alert('Remplissez tous les champs.'); return; }
    try {
        await addDoc(collection(db, 'kivu-messages'), { nom, email, sujet, message, date: new Date().toLocaleDateString('fr-FR') });
        alert('Message envoyé !');
        ['contact-nom','contact-email','contact-sujet','contact-message'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    } catch(e) { alert('Erreur : ' + e.message); }
};


// PAGE INDEX

if (document.querySelector('.hero-stats') || document.querySelector('.categories-grille')) {

    async function chargerDonneesIndex() {
        try {
            const [snapArt, snapOeu, snapNews] = await Promise.all([
                getDocs(collection(db, 'kivu-artistes')),
                getDocs(collection(db, 'kivu-oeuvres')),
                getDocs(collection(db, 'kivu-news'))
            ]);

            // ── Stats hero ──
            const statItems = document.querySelectorAll('.stat-chiffre');
            if (statItems[0]) statItems[0].textContent = snapArt.size + '+';
            if (statItems[1]) statItems[1].textContent = '6';
            if (statItems[2]) statItems[2].textContent = snapOeu.size + '+';

            // ── Compteurs filières (section categories) ──
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
                countEl.textContent = (filiereCount[key] || 0) + ' artiste(s)';
            });

            // Grille artistes en vedette (index) 
            const grilleArt = document.querySelector('.artistes-grille');
            if (grilleArt) {
                const artistes = [];
                snapArt.forEach(d => artistes.push({ id: d.id, ...d.data() }));
                // Trier par likes desc, prendre les 4 premiers
                artistes.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                const top4 = artistes.slice(0, 4);
                grilleArt.innerHTML = '';
                const delays = ['reveal-delay-1','reveal-delay-2','reveal-delay-3','reveal-delay-4'];
                const tagClass = { musique:'tag-rouge', danse:'tag-vert', theatre:'tag-or',
                     peinture:'tag-bleu', sculpture:'tag-orange', 
                     cinema:'tag-violet', artisanat:'tag-orange' };
                const emojis   = { musique:'🎵', danse:'💃', theatre:'🎭', peinture:'🎨', sculpture:'🗿', cinema:'🎬', artisanat:'🏺' };
                const photoBgs = ['photo-bg-1','photo-bg-2','photo-bg-3','photo-bg-4'];
                top4.forEach((a, i) => {
                    const tc = tagClass[a.filiere] || 'tag-rouge';
                    const em = emojis[a.filiere] || '🎭';
                    const pb = photoBgs[i % 4];
                    grilleArt.innerHTML += `
                        <div class="artiste-carte reveal ${delays[i]}">
                            <div class="artiste-photo">
                                <div class="artiste-photo-bg ${pb}" style="${a.photo ? `background-image:url(${a.photo});background-size:cover;` : ''}">${a.photo ? '' : em}</div>
                                <button class="artiste-like-btn" data-id="${a.id}">❤ ${a.likes || 0}</button>
                                <span class="artiste-filiere-badge tag ${tc}">${a.filiere}</span>
                            </div>
                            <div class="artiste-info">
                                <div class="artiste-nom">${a.nom}</div>
                                <div class="artiste-ville">📍 ${a.ville || 'Bukavu, Sud-Kivu'}</div>
                            </div>
                            <a href="artiste.html?id=${a.id}" class="artiste-lien">Voir le profil</a>
                        </div>`;
                });
                // Observer les nouveaux éléments
                document.querySelectorAll('.artiste-carte.reveal').forEach(el => observer.observe(el));
            }

            // ── Grille œuvres en vedette (index) 
            const grilleOeu = document.querySelector('.oeuvres-grille');
            if (grilleOeu) {
                const oeuvres = [];
                snapOeu.forEach(d => oeuvres.push({ id: d.id, ...d.data() }));
                const top5 = oeuvres.slice(0, 5);
                const typeEmojis = { audio:'🎵', video:'🎬', peinture:'🎨', sculpture:'🗿', photo:'📷', theatre:'🎭' };
                const bgs = ['ob-1','ob-2','ob-3','ob-4'];
                let html = '';
                top5.forEach((o, i) => {
                    html += `
                        <div class="oeuvre-carte${i === 0 ? ' grande' : ''} reveal${i > 0 ? ' reveal-delay-' + i : ''}">
                            <div class="oeuvre-bg ${bgs[i % 4]}"></div>
                            <div class="oeuvre-play">${typeEmojis[o.type] || '🎭'}</div>
                            <div class="oeuvre-overlay">
                                <span class="oeuvre-type">${typeEmojis[o.type] || ''} ${o.type}</span>
                                <div class="oeuvre-titre">${o.titre}</div>
                                <div class="oeuvre-artiste">par ${o.artiste}</div>
                            </div>
                        </div>`;
                });
                grilleOeu.innerHTML = html;
                document.querySelectorAll('.oeuvre-carte.reveal').forEach(el => observer.observe(el));
            }

            // ── News index ──
            const grilleNews = document.getElementById('news-grille');
            if (grilleNews && !document.querySelector('.news-page-grille')) {
                const newsArr = [];
                snapNews.forEach(d => newsArr.push({ id: d.id, ...d.data() }));
                newsArr.reverse(); // plus récentes en premier
                const top3 = newsArr.slice(0, 3);
                grilleNews.innerHTML = '';
                top3.forEach(n => {
                    grilleNews.innerHTML += `
                        <div class="news-carte reveal">
                            <div class="news-date">${n.date || ''}</div>
                            <div class="news-titre">${n.titre}</div>
                            <div class="news-texte">${(n.texte || '').substring(0, 120)}...</div>
                            <a href="actualiteid.html?id=${n.id}" class="artiste-lien" style="margin-top:0.5rem;display:inline-block;">Lire →</a>
                        </div>`;
                });
                document.querySelectorAll('.news-carte.reveal').forEach(el => observer.observe(el));
            }

        } catch(e) { console.error('Erreur chargement index:', e); }
    }

    chargerDonneesIndex();

    // Likes sur index (avec sauvegarde Firebase)
    document.addEventListener('click', async function(e) {
        const btn = e.target.closest('.artiste-like-btn[data-id]');
        if (!btn) return;
        const id = btn.dataset.id;
        try {
            await updateDoc(doc(db, 'kivu-artistes', id), { likes: increment(1) });
            const current = parseInt(btn.textContent.replace('❤ ', '')) || 0;
            btn.textContent = `❤ ${current + 1}`;
            btn.style.background = '#c0392b';
            btn.style.color = '#fff';
        } catch(e) { console.error(e); }
    });
}

// PAGE ARTISTES

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
                const emoji    = { musique:'🎵', danse:'💃', theatre:'🎭', peinture:'🎨', sculpture:'🗿', cinema:'🎬', artisanat:'🏺' }[a.filiere] || '🎭';
                const tagClass = { musique:'tag-rouge', danse:'tag-vert', theatre:'tag-or', peinture:'tag-bleu', sculpture:'tag-orange', cinema:'tag-violet', artisanat:'tag-orange' }[a.filiere] || 'tag-rouge';
                grille.innerHTML += `
                    <div class="artiste-carte-page" data-filiere="${a.filiere}">
                        <div class="artiste-photo-page">
                            <div class="artiste-photo-bg photo-bg-1" style="${a.photo ? `background-image:url(${a.photo});background-size:cover;` : ''}">${a.photo ? '' : emoji}</div>
                            <button class="artiste-like-btn" data-id="${d.id}">❤ ${a.likes || 0}</button>
                            <span class="artiste-filiere-badge tag ${tagClass}">${a.filiere}</span>
                        </div>
                        <div class="artiste-info-page">
                            <div class="artiste-nom-page">${a.nom}</div>
                            <div class="artiste-ville-page"> ${a.ville || 'Bukavu'}</div>
                            <div class="artiste-bio-page">${a.bio || ''}</div>
                            <a href="artiste.html?id=${d.id}" class="artiste-lien-page">Voir le profil →</a>
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


// PAGE PROFIL ARTISTE

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
            if (blocTel) blocTel.innerHTML = `<span class="profil-contact-icone">📞</span> <span>${a.tel || 'Non renseigné'}</span>`;

            const blocEmail = document.getElementById('profil-email');
            if (blocEmail) blocEmail.innerHTML = `<span class="profil-contact-icone">📧</span> <span>${a.email || 'Non renseigné'}</span>`;

            // ── CORRECTION : onglet "Contacter l'artiste" ──
            const contactTel = document.getElementById('contact-tel');
            if (contactTel) contactTel.textContent = a.tel || 'Non renseigné';

            const contactEmailAffich = document.getElementById('contact-email-affich');
            if (contactEmailAffich) contactEmailAffich.textContent = a.email || 'Non renseigné';

            // Photo
            const photo = document.getElementById('profil-photo');
            if (photo) {
                if (a.photo) {
                    photo.style.backgroundImage = `url(${a.photo})`;
                    photo.style.backgroundSize = 'cover';
                    photo.textContent = '';
                } else {
                    const emoji = { musique:'🎵', danse:'💃', theatre:'🎭', peinture:'🎨', sculpture:'🗿', cinema:'🎬', artisanat:'🏺' }[a.filiere] || '🎭';
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
                    } catch(e) { console.error(e); }
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
                    grilleOeuvres.innerHTML += `
                        <div class="oeuvre-carte">
                            <div class="oeuvre-visuel" style="${o.url && o.type !== 'audio' && o.type !== 'video' ? `background-image:url(${o.url});
                            background-size:cover;` : ''}">
                                ${o.type === 'audio' ? '<span style="font-size:3rem;">🎵</span>' : ''}
                                ${o.type === 'video' ? '<span style="font-size:3rem;">🎬</span>' : ''}
                                <span class="oeuvre-badge tag">${o.type}</span>
                            </div>
                            <div class="oeuvre-info">
                                <h3 class="oeuvre-nom">${o.titre}</h3>
                                <p class="oeuvre-annee">${o.annee || ''}</p>
                                <p style="font-size:0.9rem;color:#666;margin-top:0.5rem;">${o.desc || ''}</p>
                                ${o.url && o.type === 'audio' ? 
                                    `<audio controls style="width:100%;
                                    margin-top:1rem;"><source src="${o.url}" type="audio/mp3"></audio>` : ''}
                                ${o.url && o.type === 'video' ? 
                                    `<video controls style="width:100%;margin-top:1rem;max-height:200px;
                                    "><source src="${o.url}" type="video/mp4"></video>` : ''}
                            </div>
                        </div>`;
                });
                if (nb === 0) {
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
            await addDoc(collection(db, 'kivu-messages'), {
                nom, email, sujet, message,
                artiste: artiste || 'inconnu',
                date: new Date().toLocaleDateString('fr-FR')
            });
            alert('Message envoyé à ' + artiste + ' !');
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


// ══════════════════════════════════════════
// PAGE NEWS DETAIL
// ══════════════════════════════════════════
if (document.getElementById('news-titre')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    async function chargerNewsDetail() {
        if (!id) return;
        try {
            const snap = await getDoc(doc(db, 'kivu-news', id));
            if (!snap.exists()) { document.getElementById('news-texte').textContent = 'Article introuvable.'; return; }
            const n = snap.data();
            document.getElementById('news-titre').textContent      = n.titre;
            document.getElementById('news-breadcrumb').textContent = n.titre;
            document.getElementById('news-date').textContent       = n.date;
            document.getElementById('news-texte').innerHTML        = `<p>${n.texte}</p>`;
            document.title = n.titre + ' — Kivu Culture Hub';
            const tags = { artiste:'tag-vert', evenement:'tag-rouge', urbain:'tag-or' };
            const tag = document.getElementById('news-tag');
            tag.textContent = n.cat; tag.className = 'tag ' + (tags[n.cat] || 'tag-rouge');
            const emojis = { artiste:'🎨', evenement:'🎪', urbain:'🏙' };
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
                            <a href="actualiteid.html?id=${d.id}" class="sidebar-news-titre">${o.titre}</a>
                        </div>`;
                });
            }
        } catch(e) { console.error(e); }
    }
    chargerNewsDetail();
}


// UTILITAIRE YOUTUBE

function youtubeEmbed(url) {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

// PAGE OEUVRES
if (document.getElementById('oeuvres-grille')) {
    const grille      = document.getElementById('oeuvres-grille');
    const vide        = document.getElementById('vide');
    const filtresBtns = document.querySelectorAll('.filtre-btn[data-type]');
    const rechInput   = document.getElementById('recherche-oeuvre');

    async function chargerOeuvresPage() {
        // Charger artistes pour retrouver l'ID depuis le nom
        let artistesMap = {};
        try {
            const snapArt = await getDocs(collection(db, 'kivu-artistes'));
            snapArt.forEach(d => { artistesMap[d.data().nom.toLowerCase().trim()] = d.id; });
        } catch(e) {}

        try {
            const snap = await getDocs(collection(db, 'kivu-oeuvres'));
            if (snap.empty) { if (vide) vide.style.display = 'flex'; grille.innerHTML = ''; return; }
            grille.innerHTML = '';
            const bgs  = ['ob-1','ob-2','ob-3','ob-4'];
            const tags = { audio:'tag-rouge', video:'tag-vert', peinture:'tag-bleu', sculpture:'tag-orange', photo:'tag-bleu', theatre:'tag-or' };
            let i = 0;
            snap.forEach(d => {
                const o = d.data();
                const artisteId = artistesMap[o.artiste?.toLowerCase().trim()];
                const profilUrl = artisteId ? `artiste.html?id=${artisteId}#oeuvres-artiste` : null;

                // Média : YouTube, audio, vidéo
                let mediaHtml = '';
                if (o.url) {
                    const ytEmbed = youtubeEmbed(o.url);
                    if (ytEmbed) {
                        mediaHtml = `<iframe style="width:100%;
                        height:150px;border:none;border-radius:8px;
                        margin-top:0.8rem;" src="${ytEmbed}" allowfullscreen></iframe>`;
                    } else if (o.type === 'audio') {
                        mediaHtml = `<audio controls class="profil-audio"><source src="${o.url}" type="audio/mp3"></audio>`;
                    } else if (o.type === 'video') {
                        mediaHtml = `<video controls class="oeuvre-video"><source src="${o.url}" type="video/mp4"></video>`;
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
                                    ? `<a href="${profilUrl}" class="oeuvre-artiste-lien" style="color:#c0392b;font-weight:600;text-decoration:none;">👤 ${o.artiste}</a>`
                                    : `<span class="oeuvre-artiste-lien">${o.artiste}</span>`
                                }
                                <span class="oeuvre-annee">${o.annee || ''}</span>
                            </div>
                            ${mediaHtml}
                            <div class="oeuvre-actions">
                                <button class="oeuvre-like-btn" data-id="${d.id}">❤ ${o.likes || 0}</button>
                               ${profilUrl ? `<a href="${profilUrl}" class="oeuvre-dl-btn" style="text-decoration:none;">  voir profil de l'auteur </a>` : ''}
                                ${o.url && !youtubeEmbed(o.url) ? `<a href="${o.url}" target="_blank" class="oeuvre-dl-btn">⬇ Ouvrir</a>` : ''}
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
                        await updateDoc(doc(db, 'kivu-oeuvres', id), { likes: increment(1) });
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
        } catch(e) { console.error(e); }
    }
    chargerOeuvresPage();
}

// AUTH HELPERS
function hashSimple(str) {
    // Hash simple côté client (non cryptographique, suffisant pour ce cas)
    let h = 0;
    for (let i = 0; i < str.length; i++) { h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; }
    return h.toString(16);
}

async function creerSuperAdminSiAbsent() {
    // Vérifie si un super admin existe déjà
    const snap = await getDocs(collection(db, 'kivu-admins'));
    if (snap.empty) {
        // Crée le super admin par défaut
        await addDoc(collection(db, 'kivu-admins'), {
            nom: 'Super Admin',
            email: 'admin@kivuculturehub.cd',
            username: 'superadmin',
            motDePasse: hashSimple('KivuAdmin2026!'),
            motSecurite: hashSimple('Bukavu'),
            role: 'super',
            dateCreation: new Date().toLocaleDateString('fr-FR')
        });
    }
}
// PAGE LOGIN
if (document.getElementById("login-form")) {

    // S'assurer que le super admin existe
    creerSuperAdminSiAbsent().catch(console.error);

    window.adminLogin = async function() {
        const userVal = document.getElementById("login-email")?.value.trim().toLowerCase();
        const passVal = document.getElementById("login-pass")?.value;
        const errEl   = document.getElementById("login-erreur");
        if (!userVal || !passVal) {
            if (errEl) { errEl.textContent = "Remplissez tous les champs."; errEl.style.display = "block"; }
            return;
        }
        const btn = document.querySelector('.login-btn');
        if (btn) { btn.textContent = 'Connexion...'; btn.disabled = true; }
        try {
            const snap = await getDocs(collection(db, 'kivu-admins'));
            let trouve = null;
            snap.forEach(d => {
                const a = d.data();
                const emailMatch    = (a.email || '').toLowerCase() === userVal;
                const usernameMatch = (a.username || '').toLowerCase() === userVal;
                const passMatch     = a.motDePasse === hashSimple(passVal);
                if ((emailMatch || usernameMatch) && passMatch) trouve = { id: d.id, ...a };
            });
            if (trouve) {
                sessionStorage.setItem('kivu-admin-ok', '1');
                sessionStorage.setItem('kivu-admin-id', trouve.id);
                sessionStorage.setItem('kivu-admin-nom', trouve.nom);
                sessionStorage.setItem('kivu-admin-role', trouve.role);
                window.location.href = 'admin.html';
            } else {
                if (errEl) { errEl.textContent = 'Email/username ou mot de passe incorrect.'; errEl.style.display = 'block'; }
                if (btn) { btn.textContent = 'Se connecter →'; btn.disabled = false; }
            }
        } catch(e) {
            if (errEl) { errEl.textContent = 'Erreur de connexion : ' + e.message; errEl.style.display = 'block'; }
            if (btn) { btn.textContent = 'Se connecter →'; btn.disabled = false; }
        }
    };

    // Mot de sécurité — récupération
    window.afficherRecup = function() {
        const bloc = document.getElementById('recup-bloc');
        if (bloc) bloc.style.display = bloc.style.display === 'none' ? 'block' : 'none';
    };

    window.verifierMotSecurite = async function() {
        const emailVal = document.getElementById('recup-email')?.value.trim().toLowerCase();
        const motSec   = document.getElementById('recup-mot-sec')?.value;
        const msgEl    = document.getElementById('recup-msg');
        if (!emailVal || !motSec) {
            if (msgEl) { msgEl.textContent = 'Remplissez email et mot de sécurité.'; msgEl.style.color = '#c0392b'; }
            return;
        }
        try {
            const snap = await getDocs(collection(db, 'kivu-admins'));
            let trouve = null;
            snap.forEach(d => {
                const a = d.data();
                if ((a.email || '').toLowerCase() === emailVal && a.motSecurite === hashSimple(motSec)) {
                    trouve = { id: d.id, ...a };
                }
            });
            if (trouve) {
                // Afficher le bloc de réinitialisation
                document.getElementById('recup-reset-bloc').style.display = 'block';
                document.getElementById('recup-reset-bloc').dataset.adminId = trouve.id;
                if (msgEl) { msgEl.textContent = ' Identité vérifiée. Définissez un nouveau mot de passe.'; msgEl.style.color = '#27ae60'; }
            } else {
                if (msgEl) { msgEl.textContent = 'Email ou mot de sécurité incorrect.'; msgEl.style.color = '#c0392b'; }
            }
        } catch(e) { if (msgEl) { msgEl.textContent = 'Erreur : ' + e.message; msgEl.style.color = '#c0392b'; } }
    };

    window.reinitialiserMotDePasse = async function() {
        const bloc      = document.getElementById('recup-reset-bloc');
        const adminId   = bloc?.dataset.adminId;
        const newPass   = document.getElementById('recup-new-pass')?.value;
        const msgEl     = document.getElementById('recup-msg');
        if (!adminId || !newPass || newPass.length < 6) {
            if (msgEl) { msgEl.textContent = 'Mot de passe trop court (min. 6 caractères).'; msgEl.style.color = '#c0392b'; }
            return;
        }
        try {
            await updateDoc(doc(db, 'kivu-admins', adminId), { motDePasse: hashSimple(newPass) });
            if (msgEl) { msgEl.textContent = ' Mot de passe réinitialisé ! Vous pouvez vous connecter.'; msgEl.style.color = '#27ae60'; }
            setTimeout(() => {
                document.getElementById('recup-bloc').style.display = 'none';
            }, 2000);
        } catch(e) { if (msgEl) { msgEl.textContent = 'Erreur : ' + e.message; msgEl.style.color = '#c0392b'; } }
    };

    document.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && !document.getElementById('recup-bloc')?.style.display?.includes('block')) {
            window.adminLogin();
        }
    });
}

window.adminLogout = function() {
    sessionStorage.removeItem('kivu-admin-ok');
    sessionStorage.removeItem('kivu-admin-id');
    sessionStorage.removeItem('kivu-admin-nom');
    sessionStorage.removeItem('kivu-admin-role');
    window.location.href = 'login.html';
};


// ══════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════
if (document.getElementById('panel-artistes')) {
    // Guard: rediriger vers login si pas authentifié
    if (!sessionStorage.getItem('kivu-admin-ok')) { window.location.href = 'login.html'; }

    const currentAdminRole = sessionStorage.getItem('kivu-admin-role') || 'admin';
    const currentAdminId   = sessionStorage.getItem('kivu-admin-id') || '';
    const currentAdminNom  = sessionStorage.getItem('kivu-admin-nom') || 'Admin';
    const estSuperAdmin    = currentAdminRole === 'super';

    // Afficher le nom de l'admin connecté
    const nomEl = document.getElementById('admin-nom-connecte');
    if (nomEl) nomEl.textContent = currentAdminNom + (estSuperAdmin ? ' (Super Admin)' : '');

    function adminToast(msg) {
        const t = document.getElementById('admin-toast');
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2500);
    }

    // ── Artistes ──
    async function chargerArtistes() {
        const liste = document.getElementById('liste-artistes');
        const count = document.getElementById('count-artistes');
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-artistes'));
            if (snap.empty) { liste.innerHTML = '<div class="admin-vide">Aucun artiste.</div>'; count.textContent = '0 artiste(s)'; return; }
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
                            <button class="admin-btn-edit" onclick="modifierArtiste('${d.id}')">✏ Modifier</button>
                            <button class="admin-btn-delete" onclick="supprimerArtiste('${d.id}')">Supprimer</button>
                        </div>
                    </div>`;
            });
        } catch(e) { liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }

    // ── Œuvres ──
    async function chargerOeuvres() {
        const liste = document.getElementById('liste-oeuvres');
        const count = document.getElementById('count-oeuvres');
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-oeuvres'));
            if (snap.empty) { liste.innerHTML = '<div class="admin-vide">Aucune œuvre.</div>'; count.textContent = '0 œuvre(s)'; return; }
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

    // ── News ──
    async function chargerNews() {
        const liste = document.getElementById('liste-news');
        const count = document.getElementById('count-news');
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-news'));
            if (snap.empty) { liste.innerHTML = '<div class="admin-vide">Aucune actualité.</div>'; count.textContent = '0 actualité(s)'; return; }
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
        } catch(e) { liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }

    // ── Messages ──
    async function chargerMessages() {
        const liste = document.getElementById('liste-messages');
        const count = document.getElementById('count-messages');
        liste.innerHTML = '<div class="admin-chargement">Chargement...</div>';
        try {
            const snap = await getDocs(collection(db, 'kivu-messages'));
            if (snap.empty) { liste.innerHTML = '<div class="admin-vide">Aucun message.</div>'; count.textContent = '0 message(s)'; return; }
            liste.innerHTML = '';
            count.textContent = snap.size + ' message(s)';
            snap.forEach(d => {
                const m = d.data();
                liste.innerHTML += `
                    <div class="admin-message-item">
                        <div class="admin-message-header">
                            <div>
                                <div class="admin-message-nom">${m.nom}</div>
                                <div class="admin-message-email">${m.email}</div>
                                ${m.artiste ? `<div class="admin-item-meta">Pour : ${m.artiste}</div>` : ''}
                            </div>
                            <div>
                                <div class="admin-message-date">${m.date||''}</div>
                                <button class="admin-btn-delete" onclick="supprimerMessage('${d.id}')">Supprimer</button>
                            </div>
                        </div>
                        ${m.sujet ? `<div class="admin-message-sujet">${m.sujet}</div>` : ''}
                        <div class="admin-message-texte">${m.message}</div>
                    </div>`;
            });
        } catch(e) { liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }

    // ── Top Likes ──
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
        } catch(e) { liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }

    // ── Tabs ──
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
        const photo   = document.getElementById('art-photo').value.trim();
        if (!nom || !filiere) { alert('Nom et filière obligatoires.'); return; }
        try {
            await addDoc(collection(db, 'kivu-artistes'), { nom, filiere, bio, tel, email, ville: ville||'Bukavu, Sud-Kivu', photo, likes: 0, date: new Date().toLocaleDateString('fr-FR') });
            adminToast('Artiste ajouté !');
            ['art-nom','art-bio','art-tel','art-email','art-ville','art-photo'].forEach(i => document.getElementById(i).value = '');
            document.getElementById('art-filiere').value = '';
            chargerArtistes();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    // ── Modifier artiste ──
    window.modifierArtiste = async function(id) {
        try {
            const snap = await getDoc(doc(db, 'kivu-artistes', id));
            if (!snap.exists()) return;
            const a = snap.data();
            document.getElementById('art-nom').value    = a.nom || '';
            document.getElementById('art-filiere').value= a.filiere || '';
            document.getElementById('art-bio').value    = a.bio || '';
            document.getElementById('art-tel').value    = a.tel || '';
            document.getElementById('art-email').value  = a.email || '';
            document.getElementById('art-ville').value  = a.ville || '';
            document.getElementById('art-photo').value  = a.photo || '';
            // Changer le bouton en "Enregistrer"
            const btn = document.querySelector('.admin-btn-add');
            btn.textContent = '💾 Enregistrer les modifications';
            btn.onclick = async function() {
                const newNom     = document.getElementById('art-nom').value.trim();
                const newFiliere = document.getElementById('art-filiere').value;
                if (!newNom || !newFiliere) { alert('Nom et filière obligatoires.'); return; }
                try {
                    await updateDoc(doc(db, 'kivu-artistes', id), {
                        nom:     newNom,
                        filiere: newFiliere,
                        bio:     document.getElementById('art-bio').value.trim(),
                        tel:     document.getElementById('art-tel').value.trim(),
                        email:   document.getElementById('art-email').value.trim(),
                        ville:   document.getElementById('art-ville').value.trim() || 'Bukavu, Sud-Kivu',
                        photo:   document.getElementById('art-photo').value.trim()
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

    // ── Supprimer artiste ──
    window.supprimerArtiste = async function(id) {
        if (!confirm('Supprimer cet artiste ?')) return;
        await deleteDoc(doc(db, 'kivu-artistes', id));
        adminToast('Supprimé.'); chargerArtistes();
    };

    // ── Ajout œuvre ──
    window.adminAjouterOeuvre = async function() {
        const titre   = document.getElementById('oeu-titre').value.trim();
        const type    = document.getElementById('oeu-type').value;
        const artiste = document.getElementById('oeu-artiste').value.trim();
        const annee   = document.getElementById('oeu-annee').value.trim();
        const url     = document.getElementById('oeu-url').value.trim();
        const desc    = document.getElementById('oeu-desc').value.trim();
        if (!titre || !type || !artiste) { alert('Titre, type et artiste obligatoires.'); return; }
        try {
            await addDoc(collection(db, 'kivu-oeuvres'), { titre, type, artiste, annee, url, desc, likes: 0, date: new Date().toLocaleDateString('fr-FR') });
            adminToast('Œuvre ajoutée !');
            ['oeu-titre','oeu-artiste','oeu-annee','oeu-url','oeu-desc'].forEach(i => document.getElementById(i).value = '');
            document.getElementById('oeu-type').value = '';
            chargerOeuvres();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    // ── Modifier œuvre ──
    window.modifierOeuvre = async function(id) {
        try {
            const snap = await getDoc(doc(db, 'kivu-oeuvres', id));
            if (!snap.exists()) return;
            const o = snap.data();
            document.getElementById('oeu-titre').value   = o.titre || '';
            document.getElementById('oeu-type').value    = o.type || '';
            document.getElementById('oeu-artiste').value = o.artiste || '';
            document.getElementById('oeu-annee').value   = o.annee || '';
            document.getElementById('oeu-url').value     = o.url || '';
            document.getElementById('oeu-desc').value    = o.desc || '';
            const btn = document.querySelector('#panel-oeuvres .admin-btn-add');
            btn.textContent = '💾 Enregistrer les modifications';
            btn.onclick = async function() {
                const newTitre   = document.getElementById('oeu-titre').value.trim();
                const newType    = document.getElementById('oeu-type').value;
                const newArtiste = document.getElementById('oeu-artiste').value.trim();
                if (!newTitre || !newType || !newArtiste) { alert('Titre, type et artiste obligatoires.'); return; }
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
            document.querySelector('#panel-oeuvres .admin-form-bloc').scrollIntoView({ behavior: 'smooth' });
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    // ── Supprimer œuvre ──
    window.supprimerOeuvre = async function(id) {
        if (!confirm('Supprimer cette œuvre ?')) return;
        await deleteDoc(doc(db, 'kivu-oeuvres', id));
        adminToast('Supprimé.'); chargerOeuvres();
    };

    // ── Ajout news ──
    window.adminAjouterNews = async function() {
        const titre = document.getElementById('news-titre-admin').value.trim();
        const cat   = document.getElementById('news-cat').value;
        const texte = document.getElementById('news-texte-admin').value.trim();
        if (!titre || !texte) { alert('Titre et texte obligatoires.'); return; }
        try {
            await addDoc(collection(db, 'kivu-news'), { titre, cat, texte, date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) });
            adminToast('Publié !');
            document.getElementById('news-titre-admin').value = '';
            document.getElementById('news-texte-admin').value = '';
            chargerNews();
        } catch(e) { alert('Erreur : ' + e.message); }
    };

    // ── Modifier news ──
    window.modifierNews = async function(id) {
        try {
            const snap = await getDoc(doc(db, 'kivu-news', id));
            if (!snap.exists()) return;
            const n = snap.data();
            document.getElementById('news-titre-admin').value = n.titre || '';
            document.getElementById('news-cat').value         = n.cat || 'artiste';
            document.getElementById('news-texte-admin').value = n.texte || '';
            const btn = document.querySelector('#panel-news .admin-btn-add');
            btn.textContent = '💾 Enregistrer les modifications';
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

    // ── Supprimer news ──
    window.supprimerNews = async function(id) {
        if (!confirm('Supprimer cette actualité ?')) return;
        await deleteDoc(doc(db, 'kivu-news', id));
        adminToast('Supprimé.'); chargerNews();
    };

    // ── Supprimer message ──
    window.supprimerMessage = async function(id) {
        if (!confirm('Supprimer ce message ?')) return;
        await deleteDoc(doc(db, 'kivu-messages', id));
        adminToast('Supprimé.'); chargerMessages();
    };

    // ══ GESTION DES COMPTES ADMINS ══
    async function chargerAdmins() {
        if (!estSuperAdmin) return; // Seul le super admin peut voir
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
                            ${!estLui && a.role !== 'super' ? `<button class="admin-btn-delete" onclick="supprimerAdmin('${d.id}')">Supprimer</button>` : ''}
                            ${estLui ? '<span style="font-size:0.8rem;color:#888;">(vous)</span>' : ''}
                        </div>
                    </div>`;
            });
        } catch(e) { if (liste) liste.innerHTML = '<div class="admin-vide">Erreur.</div>'; }
    }

    window.adminAjouterAdmin = async function() {
        if (!estSuperAdmin) { alert('Accès refusé.'); return; }
        const nom      = document.getElementById('new-admin-nom')?.value.trim();
        const email    = document.getElementById('new-admin-email')?.value.trim().toLowerCase();
        const username = document.getElementById('new-admin-username')?.value.trim().toLowerCase();
        const pass     = document.getElementById('new-admin-pass')?.value;
        const motSec   = document.getElementById('new-admin-mot-sec')?.value.trim();
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
            if (doublon) { alert('Email ou username déjà utilisé.'); return; }
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

    // ── Mise à jour adminTab pour inclure le nouveau panel 
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
        if (nom === 'artistes') chargerArtistes();
        if (nom === 'oeuvres')  chargerOeuvres();
        if (nom === 'news')     chargerNews();
        if (nom === 'messages') chargerMessages();
        if (nom === 'toplikes') chargerTopLikes();
        if (nom === 'admins-comptes') chargerAdmins();
    };

    chargerArtistes();
}
window.modifierEmail = async function() {
    const newEmail = document.getElementById('compte-email').value.trim().toLowerCase();
    const pass = document.getElementById('compte-pass-confirm').value;
    if (!newEmail || !pass) { alert('Remplissez tous les champs.'); return; }
    try {
        const snap = await getDoc(doc(db, 'kivu-admins', currentAdminId));
        if (!snap.exists() || snap.data().motDePasse !== hashSimple(pass)) { alert('Mot de passe incorrect.'); return; }
        await updateDoc(doc(db, 'kivu-admins', currentAdminId), { email: newEmail });
        adminToast('Email modifié !');
        document.getElementById('compte-email').value = '';
        document.getElementById('compte-pass-confirm').value = '';
    } catch(e) { alert('Erreur : ' + e.message); }
};

window.modifierMotDePasse = async function() {
    const ancienPass = document.getElementById('compte-ancien-pass').value;
    const newPass = document.getElementById('compte-new-pass').value;
    if (!ancienPass || !newPass) { alert('Remplissez tous les champs.'); return; }
    if (newPass.length < 6) { alert('Mot de passe trop court.'); return; }
    try {
        const snap = await getDoc(doc(db, 'kivu-admins', currentAdminId));
        if (!snap.exists() || snap.data().motDePasse !== hashSimple(ancienPass)) { alert('Mot de passe actuel incorrect.'); return; }
        await updateDoc(doc(db, 'kivu-admins', currentAdminId), { motDePasse: hashSimple(newPass) });
        adminToast('Mot de passe modifié !');
        document.getElementById('compte-ancien-pass').value = '';
        document.getElementById('compte-new-pass').value = '';
    } catch(e) { alert('Erreur : ' + e.message); }
};

