


const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

const burger  = document.getElementById('burger');
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
        e.preventDefault();
        const cible = document.querySelector(this.getAttribute('href'));
        if (cible) {
            cible.scrollIntoView({ behavior: 'smooth' });
        }
        if (navLiens) {
            navLiens.style.display = 'none';
        }
    });
});


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.artiste-like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const texte = this.textContent;
        const nombre = parseInt(texte.replace('❤ ', ''));
        this.textContent = `❤ ${nombre + 1}`;
        this.style.background = '#c0392b';
        this.style.color = '#fff';
    });
});

const rechercheBtn   = document.getElementById('recherche-btn');
const rechercheInput = document.getElementById('recherche-input');

if (rechercheBtn && rechercheInput) {
    rechercheBtn.addEventListener('click', () => {
        const valeur = rechercheInput.value.trim();
        if (valeur) {
            alert(`Recherche : "${valeur}" — Firebase sera connecté ici.`);
        }
    });

    rechercheInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            rechercheBtn.click();
        }
    });
}


window.envoyerMessage = function() {
    const nom     = document.getElementById('contact-nom').value.trim();
    const email   = document.getElementById('contact-email').value.trim();
    const sujet   = document.getElementById('contact-sujet').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!nom || !email || !message) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }


    alert('Message envoyé ! Merci, nous vous répondrons bientôt.');
    document.getElementById('contact-nom').value     = '';
    document.getElementById('contact-email').value   = '';
    document.getElementById('contact-sujet').value   = '';
    document.getElementById('contact-message').value = '';
};