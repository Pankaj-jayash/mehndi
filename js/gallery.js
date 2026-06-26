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
            return `
<div class="design-card ${isSelected ? 'selected' : ''}" data-id="${design.id}">
    ${design.video ? `
    <div class="video-icon" data-video='${JSON.stringify(design.video)}' title="Watch Video">
        <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
    </div>` : ''}
    <div class="design-card-image" style="background-image:url('${imgSrc}'); background-size:cover; background-position:center;">
        ${!imgSrc ? '🎨' : ''}
    </div>
    ...
`;
            
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
//  CATEGORY + PRICE LISTENERS
// ============================================
function setupCategoryListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            updateActiveCategoryButton();
            renderGallery();
        });
    });

    // Price Slider
    const priceSlider = document.getElementById('priceSlider');
    const priceDisplay = document.getElementById('priceDisplay');

    if (priceSlider && priceDisplay) {
        priceSlider.max = 10000;
        priceSlider.value = 10000;
        currentPrice = 'all';
        priceDisplay.textContent = 'All Prices';

        priceSlider.addEventListener('input', function() {
            const val = parseInt(this.value);

            if (val >= 10000) {
                currentPrice = 'all';
                priceDisplay.textContent = 'All Prices';
            } else if (val >= 5000) {
                currentPrice = 'above5000';
                priceDisplay.textContent = 'Above ₹5,000';
            } else if (val >= 3000) {
                currentPrice = '3000to5000';
                priceDisplay.textContent = '₹3,000 - ₹5,000';
            } else if (val >= 1000) {
                currentPrice = '1000to3000';
                priceDisplay.textContent = '₹1,000 - ₹3,000';
            } else {
                currentPrice = 'under1000';
                priceDisplay.textContent = 'Under ₹1,000';
            }

            renderGallery();
        });
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

function updateActiveCategoryButton() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === currentCategory) {
            btn.classList.add('active');
        }
    });
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
//  VIDEO MODAL - Single Button Logic
// ============================================
(function() {
    // Video icon click
    document.addEventListener('click', function(e) {
        const videoIcon = e.target.closest('.video-icon');
        if (!videoIcon) return;
        e.stopPropagation();
        e.preventDefault();
        
        let videoData;
        try {
            videoData = JSON.parse(videoIcon.dataset.video);
        } catch(err) {
            return;
        }
        
        const modal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');
        const videoTitle = document.getElementById('videoTitle');
        const instaLink = document.getElementById('instaLink');
        const ytLink = document.getElementById('ytLink');
        
        if (!modal || !videoFrame) return;
        
        // Reset
        videoFrame.src = '';
        instaLink.style.display = 'none';
        ytLink.style.display = 'none';
        
        // YouTube
        if (videoData.youtube) {
            videoFrame.src = videoData.youtube + '?autoplay=1&rel=0';
            ytLink.href = videoData.youtube.replace('embed/', 'watch?v=').replace('?autoplay=1&rel=0', '');
            ytLink.style.display = 'inline-flex';
            videoTitle.textContent = '▶️ Mehndi Design Video';
        }
        // Instagram
        else if (videoData.instagram) {
            videoFrame.src = videoData.instagram + 'embed/';
            instaLink.href = videoData.instagram;
            instaLink.style.display = 'inline-flex';
            videoTitle.textContent = '📷 Mehndi Design Reel';
        }
        
        modal.classList.remove('hidden');
    });

    // Close modal
    document.addEventListener('click', function(e) {
        if (e.target.closest('.video-close') || e.target.id === 'videoModal') {
            const modal = document.getElementById('videoModal');
            const videoFrame = document.getElementById('videoFrame');
            if (modal && videoFrame) {
                modal.classList.add('hidden');
                videoFrame.src = '';
            }
        }
    });

    // Instagram button - direct app open
    document.addEventListener('click', function(e) {
        if (e.target.closest('#instaLink')) {
            e.preventDefault();
            const url = document.getElementById('instaLink').href;
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isMobile) {
                window.location.href = url.replace('https://www.instagram.com', 'instagram://');
                setTimeout(() => { window.open(url, '_self'); }, 800);
            } else {
                window.open(url, '_self');
            }
        }
    });

    // YouTube button - direct app open
    document.addEventListener('click', function(e) {
        if (e.target.closest('#ytLink')) {
            e.preventDefault();
            const url = document.getElementById('ytLink').href;
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isMobile) {
                window.location.href = url.replace('https://www.youtube.com', 'youtube://');
                setTimeout(() => { window.open(url, '_self'); }, 800);
            } else {
                window.open(url, '_self');
            }
        }
    });
})();