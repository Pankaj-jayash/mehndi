// ============================================
//  MAIN.JS - Common Functions for All Pages
//  Mehndi By Niraj
// ============================================

let CONFIG = {};

// ============================================
//  LOAD CONFIG
// ============================================
async function loadConfig() {
    // Pehle localStorage check karo
    const localConfig = localStorage.getItem('mehndiConfig');
    if (localConfig) {
        try {
            CONFIG = JSON.parse(localConfig);
            return CONFIG;
        } catch (e) {
            console.error('Config parse error:', e);
        }
    }

    // Fallback to JSON file
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
                <span>🌿 Mehndi By Niraj</span>
            </a>
            <button class="hamburger" id="hamburger" aria-label="Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="navLinks">
                <li><a href="${isHome ? 'index.html' : '../index.html'}" class="${currentPage === 'home' ? 'active' : ''}">🏠 Home</a></li>
                <li><a href="${isHome ? 'index.html#gallery' : '../index.html#gallery'}">🎨 Gallery</a></li>
                <li><a href="${isHome ? 'about.html' : '../about.html'}" class="${currentPage === 'about' ? 'active' : ''}">👤 About</a></li>
                <li><a href="${isHome ? 'reviews.html' : '../reviews.html'}" class="${currentPage === 'reviews' ? 'active' : ''}">⭐ Reviews</a></li>
                <li><a href="${isHome ? 'contact.html' : '../contact.html'}" class="${currentPage === 'contact' ? 'active' : ''}">📞 Contact</a></li>
                <li><a href="${isHome ? 'faq.html' : '../faq.html'}" class="${currentPage === 'faq' ? 'active' : ''}">❓ FAQ</a></li>
                <li><a href="https://wa.me/919719312956?text=Hi%20Niraj%20ji%2C%20I%20want%20to%20book%20mehndi" class="nav-cta" target="_blank">💬 Book Now</a></li>
            </ul>
        </div>
    `;

    // Mobile menu toggle
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

    const isHome = window.location.pathname.includes('index.html') || 
                   !window.location.pathname.includes('/');

    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4>🌿 Mehndi By Niraj</h4>
                    <p>Professional Mehndi Artist<br>Mathura, Uttar Pradesh</p>
                    <div class="social-links">
                        <a href="https://wa.me/919719312956" target="_blank" aria-label="WhatsApp">💬</a>
                        <a href="https://instagram.com/mehndibyniraj" target="_blank" aria-label="Instagram">📷</a>
                        <a href="tel:+919027535231" aria-label="Phone">📞</a>
                    </div>
                </div>
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <p><a href="${isHome ? 'index.html' : '../index.html'}">Home</a></p>
                    <p><a href="${isHome ? 'index.html#gallery' : '../index.html#gallery'}">Gallery</a></p>
                    <p><a href="${isHome ? 'about.html' : '../about.html'}">About</a></p>
                    <p><a href="${isHome ? 'reviews.html' : '../reviews.html'}">Reviews</a></p>
                    <p><a href="${isHome ? 'contact.html' : '../contact.html'}">Contact</a></p>
                </div>
                <div class="footer-col">
                    <h4>Help</h4>
                    <p><a href="${isHome ? 'faq.html' : '../faq.html'}">FAQ</a></p>
                    <p><a href="${isHome ? 'policy.html' : '../policy.html'}">Booking Policy</a></p>
                </div>
                <div class="footer-col">
                    <h4>Contact</h4>
                    <p>📱 <a href="tel:+919027535231">9027535231</a></p>
                    <p>💬 <a href="https://wa.me/919719312956">9719312956</a></p>
                    <p>📍 Mathura, UP</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© ${new Date().getFullYear()} Mehndi By Niraj. All Rights Reserved. | Made with ❤️ in Mathura</p>
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