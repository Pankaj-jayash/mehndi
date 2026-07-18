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
        if (!response.ok) {
            response = await fetch('../data/designs.json');
        }
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
    if (urlCategory) {
        currentCategory = urlCategory;
        updateActiveCategoryButton();
    }

    renderGallery();
    setupCategoryListeners();
    setupPriceSlider();
    setupClearSelection();
}

// ============================================
//  RENDER GALLERY
// ============================================
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid) return;

    let filteredDesigns = allDesigns;

    // Category filter
    if (currentCategory !== 'all') {
        filteredDesigns = filteredDesigns.filter(d => d.category === currentCategory);
    }

    // Price filter
    if (currentPrice === 'under1000') {
        filteredDesigns = filteredDesigns.filter(d => d.price < 1000);
    } else if (currentPrice === '1000to3000') {
        filteredDesigns = filteredDesigns.filter(d => d.price >= 1000 && d.price <= 3000);
    } else if (currentPrice === '3000to5000') {
        filteredDesigns = filteredDesigns.filter(d => d.price >= 3000 && d.price <= 5000);
    } else if (currentPrice === 'above5000') {
        filteredDesigns = filteredDesigns.filter(d => d.price > 5000);
    }
    // Gender filter
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
    <div class="design-card-image" style="background-image:url('${imgSrc}');">
        <span class="design-card-price-overlay">₹${design.price.toLocaleString('en-IN')}</span>
    </div>
    <div class="design-card-body">
        <div class="design-card-name">${design.name}</div>
        <button class="select-btn" data-id="${design.id}">
            ${isSelected ? 'Selected Mehndi' : 'Select Mehndi'}
        </button>
    </div>
</div>
`;
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
//  TOGGLE DESIGN SELECTION
// ============================================
function toggleDesign(designId) {
    const design = allDesigns.find(d => d.id === designId);
    if (!design) return;

    const index = selectedDesigns.findIndex(s => s.id === designId);

    if (index > -1) {
        selectedDesigns.splice(index, 1);
    } else {
        selectedDesigns.push(design);
    }

    renderGallery();
}

// ============================================
//  UPDATE BOOKING BAR
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
//  CLEAR SELECTION
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
//  GET SELECTED DESIGNS
// ============================================
function getSelectedDesigns() {
    return selectedDesigns;
}

function getTotalPrice() {
    return selectedDesigns.reduce((total, d) => total + (d.price || 0), 0);
}

// ============================================
//  IMAGE ZOOM WITH 3D FLIP
// ============================================
document.addEventListener('click', function(e) {
    const cardImage = e.target.closest('.design-card-image');
    if (!cardImage) return;

    if (e.target.closest('.select-btn')) return;
    if (e.target.closest('.design-card-body')) return;

    const bgImage = cardImage.style.backgroundImage;
    if (!bgImage || bgImage === 'none') return;

    const imageUrl = bgImage.replace(/url\(['"]?/, '').replace(/['"]?\)/, '');

    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.innerHTML = `
        <span class="zoom-close">&times;</span>
        <img src="${imageUrl}" alt="Mehndi Design Zoom">
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay || event.target.classList.contains('zoom-close')) {
            const img = overlay.querySelector('img');
            img.style.animation = 'flipZoomOut 0.4s ease forwards';
            setTimeout(() => { overlay.remove(); }, 400);
        }
    });
});

const flipOutStyle = document.createElement('style');
flipOutStyle.textContent = `
    @keyframes flipZoomOut {
        0% { transform: rotateY(0deg) scale(1); opacity: 1; }
        100% { transform: rotateY(-90deg) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(flipOutStyle);
// ============================================
//  CATEGORY + PRICE SWITCHES
// ============================================
function setupCategoryListeners() {
    // === CATEGORIES SWITCH ===
    const catHighlight = document.getElementById('catHighlight');
    const catSidebarInner = document.getElementById('catSidebarInner');
    const catBtns = document.querySelectorAll('#catSwitch .switch-btn');

    const catColors = {
        'all':     { class: 'glow-all',     highlightClass: '' },
        'bridal':  { class: 'glow-bridal',   highlightClass: 'accent-bridal' },
        'arabic':  { class: 'glow-arabic',   highlightClass: 'accent-arabic' },
        'simple':  { class: 'glow-simple',   highlightClass: 'accent-simple' },
        'sangeet': { class: 'glow-sangeet',  highlightClass: 'accent-sangeet' },
        'leg':     { class: 'glow-leg',      highlightClass: 'accent-leg' }
    };

    function updateCatGlow(cat) {
        if (!catSidebarInner) return;
        const config = catColors[cat] || catColors['all'];
        Object.values(catColors).forEach(c => catSidebarInner.classList.remove(c.class));
        catSidebarInner.classList.add(config.class);
        if (catHighlight) {
            Object.values(catColors).forEach(c => { if (c.highlightClass) catHighlight.classList.remove(c.highlightClass); });
            if (config.highlightClass) catHighlight.classList.add(config.highlightClass);
        }
    }

    if (catHighlight && catBtns.length) {
        function moveCatHighlight() {
            const active = document.querySelector('#catSwitch .switch-btn.active');
            if (active) {
                catHighlight.style.top = active.offsetTop + 'px';
                catHighlight.style.height = active.offsetHeight + 'px';
            }
        }
        moveCatHighlight();
        updateCatGlow(currentCategory);

        catBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                currentCategory = this.dataset.category;
                catBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                moveCatHighlight();
                updateCatGlow(currentCategory);
                addRipple(this, e);
                renderGallery();
            });
        });
    }

    // === PRICE SWITCH ===
    const priceHighlight = document.getElementById('priceHighlight');
    const priceSidebarInner = document.getElementById('priceSidebarInner');
    const priceBtns = document.querySelectorAll('#priceSwitch .switch-btn');

    const priceColors = {
        'all':        { class: 'glow-all',        highlightClass: '' },
        'under1000':  { class: 'glow-under1000',  highlightClass: 'accent-under1000' },
        '1000to3000': { class: 'glow-1000to3000', highlightClass: 'accent-1000to3000' },
        '3000to5000': { class: 'glow-3000to5000', highlightClass: 'accent-3000to5000' },
        'above5000':  { class: 'glow-above5000',  highlightClass: 'accent-above5000' }
    };

    function updatePriceGlow(price) {
        if (!priceSidebarInner) return;
        const config = priceColors[price] || priceColors['all'];
        Object.values(priceColors).forEach(c => priceSidebarInner.classList.remove(c.class));
        priceSidebarInner.classList.add(config.class);
        if (priceHighlight) {
            Object.values(priceColors).forEach(c => { if (c.highlightClass) priceHighlight.classList.remove(c.highlightClass); });
            if (config.highlightClass) priceHighlight.classList.add(config.highlightClass);
        }
    }

    if (priceHighlight && priceBtns.length) {
        function movePriceHighlight() {
            const active = document.querySelector('#priceSwitch .switch-btn.active');
            if (active) {
                priceHighlight.style.top = active.offsetTop + 'px';
                priceHighlight.style.height = active.offsetHeight + 'px';
            }
        }
        movePriceHighlight();
        updatePriceGlow(currentPrice);

        priceBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                currentPrice = this.dataset.price;
                priceBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                movePriceHighlight();
                updatePriceGlow(currentPrice);
                updateSliderFromPrice(currentPrice);
                updateSliderUI(currentPrice);
                addRipple(this, e);
                renderGallery();
            });
        });
        function updateSliderUI(priceKey) {
    const priceSlider = document.getElementById('priceSlider');
    const priceDisplay = document.getElementById('priceDisplay');
    if (!priceSlider || !priceDisplay) return;

    let sliderValue = 10000;
    let displayText = 'All Prices';

    switch(priceKey) {
        case 'under1000': sliderValue = 500; displayText = 'Under ₹1,000'; break;
        case '1000to3000': sliderValue = 2000; displayText = '₹1,000 - ₹3,000'; break;
        case '3000to5000': sliderValue = 4000; displayText = '₹3,000 - ₹5,000'; break;
        case 'above5000': sliderValue = 7500; displayText = 'Above ₹5,000'; break;
        default: sliderValue = 10000; displayText = 'All Prices';
    }

    priceSlider.value = sliderValue;
    priceDisplay.textContent = displayText;
}
        // Gender buttons with sliding indicator
const genderScroll = document.querySelector('.gender-scroll');
const genderBtns = document.querySelectorAll('.gender-btn');

// Create slider element
if (genderScroll && !document.querySelector('.gender-slider')) {
    const slider = document.createElement('div');
    slider.className = 'gender-slider';
    genderScroll.appendChild(slider);
    updateSlider();
}

genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentGender = btn.dataset.gender;
        genderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateSlider();
        renderGallery();
    });
});

function updateSlider() {
    const activeBtn = document.querySelector('.gender-btn.active');
    const slider = document.querySelector('.gender-slider');
    if (activeBtn && slider) {
        slider.style.left = activeBtn.offsetLeft + 'px';
        slider.style.width = activeBtn.offsetWidth + 'px';
    }
}
    }
    // ============================================
//  PRICE SCROLL MAGIC — Scroll Blur Instant
// ============================================
const priceSection = document.getElementById('priceSidebarInner');
const catSection = document.getElementById('catSidebarInner');
let priceTimeout;

function showPriceUp() {
    clearTimeout(priceTimeout);
    priceSection.classList.add('price-slide-up');
    priceSection.classList.remove('price-slide-down');
    catSection.classList.add('cat-blur');
}

function hidePriceUp() {
    priceSection.classList.remove('price-slide-up');
    priceSection.classList.add('price-slide-down');
    catSection.classList.remove('cat-blur');
}

function startAutoHide() {
    clearTimeout(priceTimeout);
    priceTimeout = setTimeout(() => {
        hidePriceUp();
    }, 30);
}

if (priceSection && catSection) {
    // Mouse enter price → slide up + blur
    priceSection.addEventListener('mouseenter', showPriceUp);
    priceSection.addEventListener('mouseleave', startAutoHide);

    // SCROLL — Any scroll = blur remove
    let scrollTimer;
    window.addEventListener('scroll', function() {
        // Blur hatao
        hidePriceUp();
        clearTimeout(priceTimeout);
        
        // Scroll stop ke baad price visible hai to kuch mat karo
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const priceRect = priceSection.getBoundingClientRect();
            if (priceRect.top < window.innerHeight && priceRect.bottom > 0) {
                // Price visible hai — normal state
            }
        }, 200);
    }, { passive: true });

    // Click ANYWHERE → blur remove
    document.addEventListener('click', function(e) {
        if (e.target.closest('#priceSidebarInner .switch-btn')) {
            clearTimeout(priceTimeout);
            catSection.classList.remove('cat-blur');
            startAutoHide();
            return;
        }
        
        if (e.target.closest('#priceSidebarInner')) return;
        
        hidePriceUp();
        clearTimeout(priceTimeout);
    });

    // Categories pe click/touch → blur remove
    catSection.addEventListener('click', function() {
        hidePriceUp();
        clearTimeout(priceTimeout);
    });

    // Touch events
    priceSection.addEventListener('touchstart', showPriceUp, { passive: true });
    catSection.addEventListener('touchstart', function() {
        hidePriceUp();
        clearTimeout(priceTimeout);
    }, { passive: true });
}
}

// Ripple helper
function addRipple(btn, e) {
    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
}
// ============================================
//  PRICE SLIDER — Fixed
// ============================================
function setupPriceSlider() {
    const priceSlider = document.getElementById('priceSlider');
    const priceDisplay = document.getElementById('priceDisplay');
    const priceBtns = document.querySelectorAll('#priceSwitch .switch-btn');
    const priceHighlight = document.getElementById('priceHighlight');
    const priceSidebarInner = document.getElementById('priceSidebarInner');

    if (!priceSlider || !priceDisplay) return;

    priceSlider.max = 10000;
    priceSlider.value = 10000;
    currentPrice = 'all';
    priceDisplay.textContent = 'All Prices';

    priceSlider.addEventListener('input', function() {
        const val = parseInt(this.value);
        let priceKey = 'all';

        if (val >= 10000) {
            priceKey = 'all';
            priceDisplay.textContent = 'All Prices';
        } else if (val >= 5000) {
            priceKey = 'above5000';
            priceDisplay.textContent = 'Above ₹5,000';
        } else if (val >= 3000) {
            priceKey = '3000to5000';
            priceDisplay.textContent = '₹3,000 - ₹5,000';
        } else if (val >= 1000) {
            priceKey = '1000to3000';
            priceDisplay.textContent = '₹1,000 - ₹3,000';
        } else {
            priceKey = 'under1000';
            priceDisplay.textContent = 'Under ₹1,000';
        }

        currentPrice = priceKey;

        // Update switch buttons
        if (priceBtns.length) {
            priceBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.price === priceKey) btn.classList.add('active');
            });
        }

        // Move highlight
        if (priceHighlight) {
            setTimeout(() => {
                const active = document.querySelector('#priceSwitch .switch-btn.active');
                if (active) {
                    priceHighlight.style.top = active.offsetTop + 'px';
                    priceHighlight.style.height = active.offsetHeight + 'px';
                }
            }, 50);
        }

        // Update sidebar glow
        if (priceSidebarInner) {
            const priceColors = {
                'all': 'glow-all', 'under1000': 'glow-under1000',
                '1000to3000': 'glow-1000to3000', '3000to5000': 'glow-3000to5000',
                'above5000': 'glow-above5000'
            };
            Object.values(priceColors).forEach(c => priceSidebarInner.classList.remove(c));
            if (priceColors[priceKey]) priceSidebarInner.classList.add(priceColors[priceKey]);
        }

        // Refresh gallery
        renderGallery();
    });
}
// Slider update from price switch
function updateSliderFromPrice(priceKey) {
    const priceSlider = document.getElementById('priceSlider');
    const priceDisplay = document.getElementById('priceDisplay');
    if (!priceSlider || !priceDisplay) return;

    let sliderValue = 10000;
    let displayText = 'All Prices';

    switch(priceKey) {
        case 'under1000':
            sliderValue = 500;
            displayText = 'Under ₹1,000';
            break;
        case '1000to3000':
            sliderValue = 2000;
            displayText = '₹1,000 - ₹3,000';
            break;
        case '3000to5000':
            sliderValue = 4000;
            displayText = '₹3,000 - ₹5,000';
            break;
        case 'above5000':
            sliderValue = 7500;
            displayText = 'Above ₹5,000';
            break;
        default:
            sliderValue = 10000;
            displayText = 'All Prices';
    }

    priceSlider.value = sliderValue;
    priceDisplay.textContent = displayText;
}

// Switch update helper
function updatePriceSwitch(priceKey) {
    const priceBtns = document.querySelectorAll('#priceSwitch .switch-btn');
    const priceHighlight = document.getElementById('priceHighlight');
    
    priceBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.price === priceKey) {
            btn.classList.add('active');
        }
    });

    // Move highlight
    if (priceHighlight) {
        setTimeout(() => {
            const active = document.querySelector('#priceSwitch .switch-btn.active');
            if (active) {
                priceHighlight.style.top = active.offsetTop + 'px';
                priceHighlight.style.height = active.offsetHeight + 'px';
            }
        }, 50);
    }

    // Update glow
    updatePriceGlow(priceKey);
}