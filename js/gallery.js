// ============================================
//  GALLERY.JS - Gallery Display & Multi-Select
//  Niraj With Mehndi
// ============================================

let allDesigns = [];
let selectedDesigns = [];
let currentCategory = 'all';
let currentPrice = 'all';
let currentGender = 'all';

// ============================================
//  LOAD DESIGNS - JSON FILE SE
// ============================================
async function loadDesigns() {
    try {
        let response = await fetch('data/designs.json');
        if (!response.ok) response = await fetch('../data/designs.json');
        const jsonData = await response.json();
        allDesigns = jsonData;
        console.log('✅ Loaded from JSON file:', allDesigns.length, 'designs');
        return allDesigns;
    } catch (error) {
        console.error('❌ Designs load failed:', error);
        allDesigns = [];
        return [];
    }
}

// ============================================
//  INIT GALLERY
// ============================================
async function initGallery() {
    await loadDesigns();
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category');
    if (urlCategory) currentCategory = urlCategory;
    renderGallery();
    setupAllListeners();
    setupClearSelection();
    initSwitchHighlight();
    initGenderSlider();
}

// ============================================
//  RENDER GALLERY
// ============================================
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('emptyState');
    if (!grid) return;

    let filteredDesigns = allDesigns;

    if (currentCategory !== 'all') {
        filteredDesigns = filteredDesigns.filter(d => d.category === currentCategory);
    }

    if (currentPrice === 'under1000') {
        filteredDesigns = filteredDesigns.filter(d => d.price < 1000);
    } else if (currentPrice === '1000to3000') {
        filteredDesigns = filteredDesigns.filter(d => d.price >= 1000 && d.price <= 3000);
    } else if (currentPrice === '3000to5000') {
        filteredDesigns = filteredDesigns.filter(d => d.price >= 3000 && d.price <= 5000);
    } else if (currentPrice === 'above5000') {
        filteredDesigns = filteredDesigns.filter(d => d.price > 5000);
    }

    if (currentGender !== 'all') {
        filteredDesigns = filteredDesigns.filter(d => d.gender === currentGender);
    }

    if (filteredDesigns.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        grid.innerHTML = filteredDesigns.map(design => {
            const isSelected = selectedDesigns.find(s => s.id === design.id);
            const imgSrc = design.image || '';
            return `
            <div class="design-card ${isSelected ? 'selected' : ''}" data-id="${design.id}">
                <div class="design-card-image" style="background-image:url('${imgSrc}'); background-size:cover; background-position:center;">
                    ${!imgSrc ? '🎨' : ''}
                </div>
                <div class="design-card-body">
                    <h4>${design.name}</h4>
                    <div class="design-card-price">₹${design.price.toLocaleString('en-IN')}</div>
                    <button class="select-btn ${isSelected ? 'selected-text' : ''}" data-id="${design.id}">
                        ${isSelected ? '✅ Selected' : '❤️ Select Design'}
                    </button>
                </div>
            </div>`;
        }).join('');

        grid.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDesign(parseInt(btn.dataset.id));
            });
        });
    }
    updateBookingBar();
}

// ============================================
//  TOGGLE SELECTION
// ============================================
function toggleDesign(designId) {
    const design = allDesigns.find(d => d.id === designId);
    if (!design) return;
    const index = selectedDesigns.findIndex(s => s.id === designId);
    if (index > -1) selectedDesigns.splice(index, 1);
    else selectedDesigns.push(design);
    renderGallery();
}

// ============================================
//  BOOKING BAR
// ============================================
function updateBookingBar() {
    const bar = document.getElementById('bookingBar');
    const count = document.getElementById('selectedCount');
    if (!bar || !count) return;
    if (selectedDesigns.length > 0) {
        bar.classList.remove('hidden');
        count.textContent = `${selectedDesigns.length} Design${selectedDesigns.length > 1 ? 's' : ''} Selected`;
    } else {
        bar.classList.add('hidden');
    }
}

// ============================================
//  CLEAR
// ============================================
function setupClearSelection() {
    const clearBtn = document.getElementById('clearSelection');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            selectedDesigns = [];
            renderGallery();
        });
    }
}

// ============================================
//  ALL LISTENERS
// ============================================
function setupAllListeners() {

    // ---- SWITCH BUTTONS (Magnetic Sidebar) ----
    document.querySelectorAll('.switch-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            currentCategory = this.dataset.category;
            document.querySelectorAll('.switch-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            moveHighlight();
            updateGlow(currentCategory);
            addClickRipple(this, e);
            renderGallery();
        });
    });

    // ---- OLD CATEGORY BUTTONS ----
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery();
        });
    });

    // ---- PRICE SLIDER ----
    const priceSlider = document.getElementById('priceSlider');
    const priceDisplay = document.getElementById('priceDisplay');
    if (priceSlider && priceDisplay) {
        priceSlider.max = 10000;
        priceSlider.value = 10000;
        priceDisplay.textContent = 'All Prices';
        priceSlider.addEventListener('input', function() {
            const val = parseInt(this.value);
            if (val >= 10000) { currentPrice = 'all'; priceDisplay.textContent = 'All Prices'; }
            else if (val >= 5000) { currentPrice = 'above5000'; priceDisplay.textContent = 'Above ₹5,000'; }
            else if (val >= 3000) { currentPrice = '3000to5000'; priceDisplay.textContent = '₹3,000 - ₹5,000'; }
            else if (val >= 1000) { currentPrice = '1000to3000'; priceDisplay.textContent = '₹1,000 - ₹3,000'; }
            else { currentPrice = 'under1000'; priceDisplay.textContent = 'Under ₹1,000'; }
            renderGallery();
        });
    }

    // ---- GENDER BUTTONS ----
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentGender = btn.dataset.gender;
            document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateGenderSlider();
            renderGallery();
        });
    });
}

// ============================================
//  MAGNETIC SWITCH HIGHLIGHT + GLOW
// ============================================
const glowColors = {
    'all': { bg: 'rgba(201,169,110,0.2)', border: '#C9A96E', ripple: 'rgba(201,169,110,0.3)', class: 'glow-all' },
    'bridal': { bg: 'rgba(196,30,58,0.2)', border: '#C41E3A', ripple: 'rgba(196,30,58,0.3)', class: 'glow-bridal' },
    'arabic': { bg: 'rgba(123,45,142,0.2)', border: '#7B2D8E', ripple: 'rgba(123,45,142,0.3)', class: 'glow-arabic' },
    'simple': { bg: 'rgba(233,30,99,0.2)', border: '#E91E63', ripple: 'rgba(233,30,99,0.3)', class: 'glow-simple' },
    'sangeet': { bg: 'rgba(255,111,0,0.2)', border: '#FF6F00', ripple: 'rgba(255,111,0,0.3)', class: 'glow-sangeet' },
    'leg': { bg: 'rgba(0,137,123,0.2)', border: '#00897B', ripple: 'rgba(0,137,123,0.3)', class: 'glow-leg' }
};

let switchHighlight, sidebarInner;

function initSwitchHighlight() {
    switchHighlight = document.getElementById('switchHighlight');
    sidebarInner = document.querySelector('.sidebar-inner');
    if (switchHighlight && sidebarInner) {
        setTimeout(() => { moveHighlight(); updateGlow(currentCategory); }, 100);
    }
}

function moveHighlight() {
    if (!switchHighlight) return;
    const active = document.querySelector('.switch-btn.active');
    if (active) {
        switchHighlight.style.top = active.offsetTop + 'px';
        switchHighlight.style.height = active.offsetHeight + 'px';
    }
}

function updateGlow(category) {
    if (!switchHighlight || !sidebarInner) return;
    const colors = glowColors[category] || glowColors['all'];
    switchHighlight.style.background = `linear-gradient(135deg, ${colors.bg}, rgba(255,255,255,0.7))`;
    switchHighlight.style.borderColor = colors.border;
    switchHighlight.style.boxShadow = `0 2px 12px ${colors.bg}, 0 0 0 1px ${colors.bg}`;
    Object.values(glowColors).forEach(c => sidebarInner.classList.remove(c.class));
    sidebarInner.classList.add(colors.class);
}

function addClickRipple(btn, e) {
    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    const colors = glowColors[currentCategory] || glowColors['all'];
    ripple.style.background = colors.ripple;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}

// ============================================
//  GENDER SLIDER
// ============================================
let genderSliderEl, genderScrollEl;

function initGenderSlider() {
    genderScrollEl = document.querySelector('.gender-scroll');
    if (genderScrollEl && !document.querySelector('.gender-slider')) {
        genderSliderEl = document.createElement('div');
        genderSliderEl.className = 'gender-slider';
        genderScrollEl.appendChild(genderSliderEl);
        setTimeout(updateGenderSlider, 100);
    }
}

function updateGenderSlider() {
    const activeBtn = document.querySelector('.gender-btn.active');
    if (activeBtn && genderSliderEl) {
        genderSliderEl.style.left = activeBtn.offsetLeft + 'px';
        genderSliderEl.style.width = activeBtn.offsetWidth + 'px';
    }
}

// ============================================
//  GETTERS
// ============================================
function getSelectedDesigns() { return selectedDesigns; }
function getTotalPrice() { return selectedDesigns.reduce((t, d) => t + (d.price || 0), 0); }

// ============================================
//  3D ZOOM
// ============================================
document.addEventListener('click', function(e) {
    const cardImage = e.target.closest('.design-card-image');
    if (!cardImage) return;
    if (e.target.closest('.select-btn') || e.target.closest('.design-card-body')) return;
    const bgImage = cardImage.style.backgroundImage;
    if (!bgImage || bgImage === 'none') return;
    const imageUrl = bgImage.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.innerHTML = `<span class="zoom-close">&times;</span><img src="${imageUrl}" alt="Zoom">`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(ev) {
        if (ev.target === overlay || ev.target.classList.contains('zoom-close')) {
            const img = overlay.querySelector('img');
            img.style.animation = 'flipZoomOut 0.4s ease forwards';
            setTimeout(() => overlay.remove(), 400);
        }
    });
});
const flipOutStyle = document.createElement('style');
flipOutStyle.textContent = `@keyframes flipZoomOut{0%{transform:rotateY(0deg) scale(1);opacity:1}100%{transform:rotateY(-90deg) scale(.5);opacity:0}}`;
document.head.appendChild(flipOutStyle);