// ============================================
//  MAIN.JS - Common Functions for All Pages
//  Niraj With Mehndi
// ============================================

let CONFIG = {};

// ============================================
//  LOAD CONFIG
// ============================================
async function loadConfig() {
    const localConfig = localStorage.getItem('mehndiConfig');
    if (localConfig) {
        try {
            CONFIG = JSON.parse(localConfig);
            return CONFIG;
        } catch (e) {
            console.error('Config parse error:', e);
        }
    }

    try {
        const response = await fetch('data/config.json');
        CONFIG = await response.json();
        return CONFIG;
    } catch (error) {
        try {
            const response = await fetch('../data/config.json');
            CONFIG = await response.json();
            return CONFIG;
        } catch (e) {
            console.error('Config load failed:', e);
            return null;
        }
    }
}

// ============================================
//  LOAD NAVBAR
// ============================================
function loadNavbar(currentPage) {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const isHome = currentPage === 'home';

    navbar.innerHTML = `
        <div class="container">
            <a href="${isHome ? 'index.html' : '../index.html'}" class="nav-brand">
                <span>🌿 Niraj With Mehndi</span>
            </a>
            <button class="hamburger" id="hamburger" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="navLinks">
    <li><a href="index.html">🏠 Home</a></li>
    <li><a href="index.html#gallery">🎨 Gallery</a></li>
    <li><a href="about.html">👤 About</a></li>
    <li><a href="reviews.html">⭐ Reviews</a></li>
    <li><a href="contact.html">📞 Contact</a></li>
    <li><a href="faq.html">❓ FAQ</a></li>
    <li><a href="https://wa.me/919719312956?text=Hi%20Niraj%20ji%2C%20I%20want%20to%20book%20mehndi" class="nav-cta" target="_blank">💬 Book Now</a></li>
</ul>
        </div>
    `;

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// ============================================
//  LOAD FOOTER
// ============================================
function loadFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;

    footer.innerHTML = `
    <div class="footer-bg"></div>
    <div class="footer-container">
        
        <!-- Logo + Brand -->
        <div class="footer-brand">
            <div class="footer-logo">
                <span style="font-size:40px;">🪷</span>
            </div>
            <h3>Niraj With Mehndi</h3>
            <p>Premium Mehndi Artist</p>
            <p class="footer-location">📍 Mant, Vrindavan</p>
        </div>

        <!-- Contact Buttons -->
<div class="footer-contact">
    <a href="tel:+919027535231" class="footer-glass-btn">
        <span class="btn-icon">📞</span> Call
    </a>
    <a href="https://wa.me/919719312956" target="_blank" class="footer-glass-btn">
        <span class="btn-icon">💬</span> WhatsApp
    </a>
    <a href="https://instagram.com/nirajwithmehndi" target="_blank" class="footer-glass-btn">
        <span class="btn-icon">📷</span> Instagram
    </a>
</div>

        <!-- Quick Links -->
        <div class="footer-links">
            <a href="index.html">Home</a>
            <span>•</span>
            <a href="index.html#gallery">Gallery</a>
            <span>•</span>
            <a href="about.html">About</a>
            <span>•</span>
            <a href="reviews.html">Reviews</a>
            <span>•</span>
            <a href="faq.html">FAQ</a>
            <span>•</span>
            <a href="policy.html">Policy</a>
        </div>

        <!-- Bottom -->
        <div class="footer-bottom">
            <p>© 2026 Niraj With Mehndi</p>
            <p>Made with ❤️ in Mant, Vrindavan</p>
        </div>
    </div>
    `;
}

// ============================================
//  WHATSAPP FUNCTION
// ============================================
function openWhatsApp(message) {
    const phone = CONFIG.whatsapp || '919719312956';
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;
    const whatsappWebURL = `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
    
    const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
    
    if (isMobile) {
        window.location.href = whatsappURL;
    } else {
        const newWindow = window.open(whatsappWebURL, '_blank', 'noopener,noreferrer');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            window.location.href = whatsappWebURL;
        }
    }
}

// ============================================
//  INIT ALL PAGES
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    loadFooter();
});

// ============================================
//  MEHNDI LEAF SNAKE - ZIG-ZAG POORI SCREEN
//  POPUP / IMAGES / BUTTONS / FORM PAR NAHI AAYEGA
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const particle = document.getElementById('magicParticle');
    if (!particle) return;

    document.addEventListener('click', function(e) {
        // Modal ya popup ke andar? Ignore
        if (e.target.closest('.modal-overlay')) return;
        if (e.target.closest('.modal')) return;
        if (e.target.closest('#bookingModal')) return;
        if (e.target.closest('#confirmationModal')) return;
        
        // Booking bar? Ignore
        if (e.target.closest('.booking-bar')) return;
        if (e.target.closest('#bookingBar')) return;
        
        // Image? Ignore
        if (e.target.closest('img')) return;
        if (e.target.closest('.design-card-image')) return;
        
        // Button? Ignore
        if (e.target.closest('button')) return;
        if (e.target.closest('.btn')) return;
        if (e.target.closest('.select-btn')) return;
        
        // Form input? Ignore
        if (e.target.closest('input')) return;
        if (e.target.closest('textarea')) return;
        if (e.target.closest('select')) return;
        
        // Navbar link? Ignore
        if (e.target.closest('.nav-links')) return;
        if (e.target.closest('.nav-cta')) return;
        
        // Sidebar category? Ignore
        if (e.target.closest('.category-btn')) return;
        
        // Design card body? Ignore
        if (e.target.closest('.design-card-body')) return;
        if (e.target.closest('.design-card')) return;

        // Sirf khali jagah click — particle aayega
        const x = e.clientX;
        const y = e.clientY;
        
        particle.style.left = (x - 20) + 'px';
        particle.style.top = (y - 20) + 'px';
        particle.classList.add('fly-to-click');
        particle.classList.remove('return-magic');
        
        setTimeout(() => {
            particle.classList.remove('fly-to-click');
            particle.classList.add('return-magic');
            particle.style.left = '';
            particle.style.top = '';
        }, 1200);
    });
});
// ============================================
//  HOME REVIEWS — ANIMATED SCROLLING
// ============================================
async function loadHomeReviews() {
    const scroll = document.getElementById('homeReviewsScroll');
    const dots = document.getElementById('reviewsDots');
    if (!scroll || !dots) return;

    try {
        let response = await fetch('data/reviews.json');
        if (!response.ok) response = await fetch('../data/reviews.json');
        const reviews = await response.json();

        if (reviews.length === 0) return;

        scroll.innerHTML = reviews.map((r, i) => `
            <div class="review-slide-card">
                <div class="review-card-header">
                    <div class="review-avatar">${r.name.charAt(0)}</div>
                    <div class="review-card-info">
                        <div class="review-card-name">${r.name}</div>
                        <div class="review-card-stars">
                            ${Array(r.stars).fill('<span>⭐</span>').join('')}
                        </div>
                    </div>
                </div>
                <p class="review-card-text">"${r.review.substring(0, 120)}..."</p>
                <div class="review-card-mehndi" style="background-image:url('${r.mehndiPhoto}');"></div>
            </div>
        `).join('');

        // Dots
        dots.innerHTML = reviews.map((_, i) => `
            <div class="reviews-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
        `).join('');

        // Scroll event
        scroll.addEventListener('scroll', () => {
            const index = Math.round(scroll.scrollLeft / (scroll.scrollWidth / reviews.length));
            document.querySelectorAll('.reviews-dot').forEach((d, i) => {
                d.classList.toggle('active', i === index);
            });
        });

        // Dot click
        document.querySelectorAll('.reviews-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                const card = scroll.children[index];
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            });
        });

    } catch (e) {
        console.error('Reviews load failed:', e);
    }
}
// ============================================
//  INSTAGRAM COUNTER ANIMATION
// ============================================
function animateInstaCounters() {
    const counters = document.querySelectorAll('.insta-stat-num');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                        counter.classList.add('counted');
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

document.addEventListener('DOMContentLoaded', () => {
    animateInstaCounters();
});