// ============================================
//  GALLERY.JS - Gallery Display & Multi-Select
//  Mehndi By Niraj
// ============================================

let allDesigns = [];
let selectedDesigns = [];
let currentCategory = 'all';

// ============================================
//  LOAD DESIGNS - localStorage se
// ============================================
async function loadDesigns() {
    // Sabse pehle localStorage check karo
    const localDesigns = localStorage.getItem('mehndiDesigns');
    
    if (localDesigns) {
        try {
            const parsed = JSON.parse(localDesigns);
            if (parsed && parsed.length > 0) {
                allDesigns = parsed;
                console.log('✅ Loaded from localStorage:', allDesigns.length, 'designs');
                return allDesigns;
            }
        } catch (e) {
            console.error('localStorage parse error:', e);
        }
    }
    
    // Agar localStorage khali hai to JSON file se load karo
    try {
        let response = await fetch('data/designs.json');
        if (!response.ok) {
            response = await fetch('../data/designs.json');
        }
        const jsonData = await response.json();
        
        // JSON data ko localStorage me save kar do taaki aage kaam kare
        localStorage.setItem('mehndiDesigns', JSON.stringify(jsonData));
        
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
    
    // URL se category check
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
    if (currentCategory !== 'all') {
        filteredDesigns = allDesigns.filter(d => d.category === currentCategory);
    }

    if (filteredDesigns.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        grid.innerHTML = filteredDesigns.map(design => {
            const isSelected = selectedDesigns.find(s => s.id === design.id);
            // Check if image is base64 or URL
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
            </div>
            `;
        }).join('');

        // Add click listeners
        grid.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleDesign(parseInt(btn.dataset.id));
            });
        });
        
        grid.querySelectorAll('.design-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking button
                if (e.target.closest('.select-btn')) return;
                toggleDesign(parseInt(card.dataset.id));
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
//  CATEGORY LISTENERS
// ============================================
function setupCategoryListeners() {
    const buttons = document.querySelectorAll('.category-btn');
    const label = document.getElementById('activeCategoryLabel');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            updateActiveCategoryButton();
            renderGallery();
            if (label) label.textContent = ` - ${btn.textContent.trim()}`;
        });
    });
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