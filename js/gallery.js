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
//  VIDEO ICON — MAGIC TYPE + MODAL
// ============================================
function initVideoFeature() {
    const videoIcons = document.querySelectorAll('.video-icon');
    
    videoIcons.forEach(icon => {
        const textEl = icon.querySelector('.video-icon-text');
        const cursorEl = icon.querySelector('.video-icon-cursor');
        const fullText = 'Play Video';
        let charIndex = 0;
        let isTyping = true;
        
        // Magic type animation
        function typeAnimation() {
            if (isTyping) {
                if (charIndex < fullText.length) {
                    textEl.textContent = fullText.substring(0, charIndex + 1);
                    charIndex++;
                    setTimeout(typeAnimation, 120);
                } else {
                    isTyping = false;
                    setTimeout(typeAnimation, 1000);
                }
            } else {
                if (charIndex > 0) {
                    charIndex--;
                    textEl.textContent = fullText.substring(0, charIndex);
                    setTimeout(typeAnimation, 80);
                } else {
                    isTyping = true;
                    cursorEl.style.display = 'inline-block';
                    setTimeout(typeAnimation, 5000);
                }
            }
            
            if (charIndex === 0 && !isTyping) {
                cursorEl.style.display = 'none';
            } else {
                cursorEl.style.display = 'inline-block';
            }
        }
        
        setTimeout(typeAnimation, 2000);
        
        // Click to open video
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const videoData = JSON.parse(icon.dataset.video);
            const designName = icon.dataset.name;
            openVideoModal(videoData, designName);
        });
    });
}

// ============================================
//  OPEN VIDEO MODAL
// ============================================
function openVideoModal(videoData, designName) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    const channelImg = document.getElementById('videoChannelImg');
    const channelName = document.getElementById('videoChannelName');
    const openBtn = document.getElementById('videoOpenBtn');
    const openIcon = document.getElementById('videoOpenIcon');
    const openText = document.getElementById('videoOpenText');
    
    // Channel info
    channelImg.src = videoData.channelImage || 'https://placehold.co/35x35/C9A96E/white?text=N';
    channelName.textContent = videoData.channelName || '@nirajwithmehndi';
    
    // Video embed
    let embedHTML = '';
    if (videoData.platform === 'youtube') {
        const videoId = getYouTubeID(videoData.url);
        embedHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        
        openBtn.className = 'video-open-btn youtube';
        openIcon.textContent = '▶️';
        openText.textContent = 'Open in YouTube';
    } else if (videoData.platform === 'instagram') {
        embedHTML = `<iframe src="${videoData.url}embed/?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        
        openBtn.className = 'video-open-btn instagram';
        openIcon.textContent = '📷';
        openText.textContent = 'Open in Instagram';
    }
    
    player.innerHTML = embedHTML;
    openBtn.href = videoData.url;
    
    // Show modal
    modal.classList.remove('hidden', 'closing');
    document.body.style.overflow = 'hidden';
}

// Get YouTube video ID
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
}

// Close modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('videoClose');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('closing');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('closing');
                document.getElementById('videoPlayer').innerHTML = '';
                document.body.style.overflow = '';
            }, 300);
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
    }
});

// Init video after gallery render


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
            
const videoHTML = design.video ? `
    <div class="video-icon" data-video='${JSON.stringify(design.video)}' data-name="${design.name}">
        <span class="video-icon-play">▶️</span>
        <span class="video-icon-text"></span>
        <span class="video-icon-cursor"></span>
    </div>
` : '';
            return `
            <div class="design-card ${isSelected ? 'selected' : ''}" data-id="${design.id}">
                <div class="design-card-image" style="background-image:url('${imgSrc}'); background-size:cover; background-position:center;">
                    ${!imgSrc ? '🎨' : ''}
                </div>
                 ${videoHTML}
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

const originalRenderGallery = renderGallery;
renderGallery = function() {
    originalRenderGallery();
    setTimeout(initVideoFeature, 300);
};