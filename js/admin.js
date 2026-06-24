// ============================================
//  ADMIN.JS - Admin Panel Functions
//  Niraj With Mehndi
// ============================================

// ============================================
//  CHECK LOGIN
// ============================================
function checkLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('adminLoginTime');
    
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return false;
    }
    
    if (loginTime && (Date.now() - loginTime > 2 * 60 * 60 * 1000)) {
        sessionStorage.clear();
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// ============================================
//  LOGOUT
// ============================================
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ============================================
//  INIT DASHBOARD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (!checkLogin()) return;
    
    setupTabs();
    loadDashboardStats();
    loadDesignsTable();
    loadReviewsTable();
    loadBookingsTable();
    loadSettings();
    
    // Setup image upload listeners
    setTimeout(() => {
        setupImageUploadListeners();
    }, 300);
});

// ============================================
//  TABS
// ============================================
function setupTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
            
            if (tab.dataset.tab === 'bookings') loadBookingsTable();
            if (tab.dataset.tab === 'settings') loadSettings();
        });
    });
}

// ============================================
//  DATA HELPERS
// ============================================
function getDesigns() {
    return JSON.parse(localStorage.getItem('mehndiDesigns') || '[]');
}

function saveDesigns(designs) {
    localStorage.setItem('mehndiDesigns', JSON.stringify(designs));
}

function getReviews() {
    return JSON.parse(localStorage.getItem('mehndiReviews') || '[]');
}

function saveReviews(reviews) {
    localStorage.setItem('mehndiReviews', JSON.stringify(reviews));
}

function getBookings() {
    return JSON.parse(localStorage.getItem('mehndiBookings') || '[]');
}

function getConfig() {
    const defaultConfig = {
        brandName: 'Niraj With Mehndi',
        tagline: 'Where Tradition Meets Art',
        city: 'Mant',
        phone: '919027535231',
        whatsapp: '919719312956',
        instagram: 'nirajwithmehndi',
        businessHours: '10:00 AM - 08:00 PM',
        adminPassword: 'pankaj2006'
    };
    return JSON.parse(localStorage.getItem('mehndiConfig') || JSON.stringify(defaultConfig));
}

function saveConfig(config) {
    localStorage.setItem('mehndiConfig', JSON.stringify(config));
}

// ============================================
//  DASHBOARD STATS
// ============================================
function loadDashboardStats() {
    const designs = getDesigns();
    const reviews = getReviews();
    const bookings = getBookings();
    
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    
    document.getElementById('statDesigns').textContent = designs.length;
    document.getElementById('statReviews').textContent = reviews.length;
    document.getElementById('statBookings').textContent = bookings.length;
    document.getElementById('statRevenue').textContent = '₹' + totalRevenue.toLocaleString('en-IN');
    
    const recentBookings = bookings.slice(-5).reverse();
    const tableDiv = document.getElementById('recentBookingsTable');
    
    if (recentBookings.length === 0) {
        tableDiv.innerHTML = '<p style="padding:20px;color:var(--gray);">No bookings yet.</p>';
        return;
    }
    
    tableDiv.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Designs</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${recentBookings.map(b => `
                    <tr>
                        <td>${new Date(b.date).toLocaleDateString('en-IN')}</td>
                        <td>${b.customerName}</td>
                        <td>${b.phone}</td>
                        <td>${b.selectedDesigns.length}</td>
                        <td>₹${b.totalPrice.toLocaleString('en-IN')}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// ============================================
//  DESIGNS CRUD
// ============================================
function loadDesignsTable() {
    const designs = getDesigns();
    const tableDiv = document.getElementById('designsTable');
    
    if (designs.length === 0) {
        tableDiv.innerHTML = '<p style="padding:40px;text-align:center;color:var(--gray);">No designs yet. Click "Add New Design" to start.</p>';
        return;
    }
    
    tableDiv.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${designs.map((d, i) => `
                    <tr>
                        <td>${d.id || i+1}</td>
                        <td><img src="${d.image}" alt="${d.name}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;"></td>
                        <td>${d.name}</td>
                        <td>${d.category}</td>
                        <td>₹${d.price.toLocaleString('en-IN')}</td>
                        <td class="action-btns">
                            <button class="btn-edit" onclick="editDesign(${d.id})">✏️ Edit</button>
                            <button class="btn-delete" onclick="deleteDesign(${d.id})">🗑️ Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showAddDesignForm() {
    document.getElementById('designForm').classList.remove('hidden');
    document.getElementById('designFormTitle').textContent = 'Add New Design';
    document.getElementById('designId').value = '';
    document.getElementById('designName').value = '';
    document.getElementById('designCategory').value = 'bridal';
    document.getElementById('designPrice').value = '';
    document.getElementById('designDescription').value = '';
    document.getElementById('designImageURL').value = '';
    document.getElementById('designImageURL').disabled = true;
    document.getElementById('imageTypeFile').checked = true;
    clearFileUpload();
    
    document.getElementById('designForm').scrollIntoView({ behavior: 'smooth' });
}

function hideDesignForm() {
    document.getElementById('designForm').classList.add('hidden');
    clearFileUpload();
}

function editDesign(id) {
    const designs = getDesigns();
    const design = designs.find(d => d.id === id);
    if (!design) return;
    
    document.getElementById('designForm').classList.remove('hidden');
    document.getElementById('designFormTitle').textContent = 'Edit Design';
    document.getElementById('designId').value = design.id;
    document.getElementById('designName').value = design.name;
    document.getElementById('designCategory').value = design.category;
    document.getElementById('designPrice').value = design.price;
    document.getElementById('designDescription').value = design.description || '';
    
    // Check if image is base64 or URL
    if (design.image && design.image.startsWith('data:image')) {
        document.getElementById('imageTypeFile').checked = true;
        document.getElementById('designImageURL').disabled = true;
        document.getElementById('designImageURL').value = '';
        const preview = document.getElementById('uploadPreview');
        const placeholder = document.getElementById('uploadPlaceholder');
        const previewImage = document.getElementById('previewImage');
        previewImage.src = design.image;
        preview.classList.remove('hidden');
        placeholder.classList.add('hidden');
    } else {
        document.getElementById('imageTypeURL').checked = true;
        document.getElementById('designImageURL').disabled = false;
        document.getElementById('designImageURL').value = design.image || '';
        clearFileUpload();
    }
    
    document.getElementById('designForm').scrollIntoView({ behavior: 'smooth' });
}

function saveDesign() {
    const id = document.getElementById('designId').value;
    const name = document.getElementById('designName').value.trim();
    const category = document.getElementById('designCategory').value;
    const price = parseInt(document.getElementById('designPrice').value);
    const description = document.getElementById('designDescription').value.trim();
    const imageData = getImageData();
    
    if (!name || !price) {
        alert('⚠️ Please fill Name and Price!');
        return;
    }
    
    if (!imageData) {
        alert('⚠️ Please upload an image or paste an image URL!');
        return;
    }
    
    const designs = getDesigns();
    
    if (id) {
        const index = designs.findIndex(d => d.id === parseInt(id));
        if (index > -1) {
            designs[index] = { ...designs[index], name, category, price, image: imageData, description };
        }
    } else {
        const newId = designs.length > 0 ? Math.max(...designs.map(d => d.id)) + 1 : 1;
        designs.push({ id: newId, name, category, price, image: imageData, description });
    }
    
    saveDesigns(designs);
    hideDesignForm();
    loadDesignsTable();
    loadDashboardStats();
    clearFileUpload();
    alert('✅ Design saved successfully!');
}

function deleteDesign(id) {
    if (!confirm('Are you sure you want to delete this design?')) return;
    
    const designs = getDesigns().filter(d => d.id !== id);
    saveDesigns(designs);
    loadDesignsTable();
    loadDashboardStats();
    alert('✅ Design deleted!');
}

// ============================================
//  IMAGE UPLOAD HANDLING
// ============================================
function setupImageUploadListeners() {
    const fileInput = document.getElementById('designImageFile');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    const fileRadio = document.getElementById('imageTypeFile');
    const urlRadio = document.getElementById('imageTypeURL');
    const urlInput = document.getElementById('designImageURL');
    const fileArea = document.getElementById('fileUploadArea');

    if (fileRadio && urlRadio) {
        fileRadio.addEventListener('change', () => {
            urlInput.disabled = true;
            urlInput.value = '';
            if (fileArea) fileArea.style.opacity = '1';
        });

        urlRadio.addEventListener('change', () => {
            urlInput.disabled = false;
            urlInput.focus();
            if (fileArea) fileArea.style.opacity = '0.5';
            clearFileUpload();
        });
    }
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
        alert('⚠️ Please select an image file (JPG, PNG, WebP)!');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ Image size should be less than 5MB!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('uploadPreview');
        const placeholder = document.getElementById('uploadPlaceholder');
        const previewImage = document.getElementById('previewImage');
        
        previewImage.src = e.target.result;
        preview.classList.remove('hidden');
        placeholder.classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

function clearFileUpload() {
    const fileInput = document.getElementById('designImageFile');
    const preview = document.getElementById('uploadPreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    
    if (fileInput) fileInput.value = '';
    if (preview) preview.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');
}

function getImageData() {
    const fileRadio = document.getElementById('imageTypeFile');
    
    if (fileRadio && fileRadio.checked) {
        const previewImage = document.getElementById('previewImage');
        if (previewImage && previewImage.src && previewImage.src.startsWith('data:image')) {
            return previewImage.src;
        }
        return null;
    } else {
        const urlInput = document.getElementById('designImageURL');
        return urlInput ? urlInput.value.trim() : null;
    }
}

// ============================================
//  REVIEWS CRUD
// ============================================
function loadReviewsTable() {
    const reviews = getReviews();
    const tableDiv = document.getElementById('reviewsTable');
    
    if (reviews.length === 0) {
        tableDiv.innerHTML = '<p style="padding:40px;text-align:center;color:var(--gray);">No reviews yet.</p>';
        return;
    }
    
    tableDiv.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Stars</th>
                    <th>Review</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${reviews.map((r, i) => `
                    <tr>
                        <td>${r.id || i+1}</td>
                        <td>${r.name}</td>
                        <td class="star-display">${'⭐'.repeat(r.stars)}</td>
                        <td>${r.review.substring(0, 50)}...</td>
                        <td>
                            <button class="btn-delete" onclick="deleteReview(${r.id})">🗑️ Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showAddReviewForm() {
    document.getElementById('reviewForm').classList.remove('hidden');
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewStars').value = '5';
    document.getElementById('reviewCustomerPhoto').value = '';
    document.getElementById('reviewMehndiPhoto').value = '';
    document.getElementById('reviewText').value = '';
}

function hideReviewForm() {
    document.getElementById('reviewForm').classList.add('hidden');
}

function saveReview() {
    const name = document.getElementById('reviewName').value.trim();
    const stars = parseInt(document.getElementById('reviewStars').value);
    const customerPhoto = document.getElementById('reviewCustomerPhoto').value.trim();
    const mehndiPhoto = document.getElementById('reviewMehndiPhoto').value.trim();
    const review = document.getElementById('reviewText').value.trim();
    
    if (!name || !review) {
        alert('⚠️ Please fill Name and Review text!');
        return;
    }
    
    const reviews = getReviews();
    const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
    
    reviews.push({
        id: newId,
        name,
        stars,
        customerPhoto: customerPhoto || 'photos/customers/default.jpg',
        mehndiPhoto: mehndiPhoto || 'photos/reviews/default.jpg',
        review
    });
    
    saveReviews(reviews);
    hideReviewForm();
    loadReviewsTable();
    loadDashboardStats();
    alert('✅ Review added successfully!');
}

function deleteReview(id) {
    if (!confirm('Delete this review?')) return;
    
    const reviews = getReviews().filter(r => r.id !== id);
    saveReviews(reviews);
    loadReviewsTable();
    loadDashboardStats();
    alert('✅ Review deleted!');
}

// ============================================
//  BOOKINGS
// ============================================
function loadBookingsTable() {
    const bookings = getBookings();
    const tableDiv = document.getElementById('bookingsTable');
    
    if (bookings.length === 0) {
        tableDiv.innerHTML = '<p style="padding:40px;text-align:center;color:var(--gray);">No bookings yet.</p>';
        return;
    }
    
    tableDiv.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Event Date</th>
                    <th>Designs</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.reverse().map(b => `
                    <tr>
                        <td>${new Date(b.date).toLocaleDateString('en-IN')}</td>
                        <td>${b.customerName}</td>
                        <td>${b.phone}</td>
                        <td>${b.address}</td>
                        <td>${b.eventDate}</td>
                        <td>${b.selectedDesigns.map(d => d.name).join(', ')}</td>
                        <td><strong>₹${b.totalPrice.toLocaleString('en-IN')}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function exportBookings() {
    const bookings = getBookings();
    if (bookings.length === 0) {
        alert('No bookings to export!');
        return;
    }
    
    let csv = 'Date,Customer,Phone,Address,Event Date,Designs,Total\n';
    bookings.forEach(b => {
        csv += `${b.date},${b.customerName},${b.phone},${b.address},${b.eventDate},"${b.selectedDesigns.map(d => d.name).join('; ')}",${b.totalPrice}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
}

// ============================================
//  SETTINGS
// ============================================
function loadSettings() {
    const config = getConfig();
    document.getElementById('settingBrandName').value = config.brandName || '';
    document.getElementById('settingTagline').value = config.tagline || '';
    document.getElementById('settingCity').value = config.city || '';
    document.getElementById('settingPhone').value = config.phone || '';
    document.getElementById('settingWhatsapp').value = config.whatsapp || '';
    document.getElementById('settingInstagram').value = config.instagram || '';
    document.getElementById('settingHours').value = config.businessHours || '';
    document.getElementById('settingPassword').value = config.adminPassword || '';
}

function saveSettings() {
    const config = {
        brandName: document.getElementById('settingBrandName').value.trim(),
        tagline: document.getElementById('settingTagline').value.trim(),
        city: document.getElementById('settingCity').value.trim(),
        phone: document.getElementById('settingPhone').value.trim(),
        whatsapp: document.getElementById('settingWhatsapp').value.trim(),
        instagram: document.getElementById('settingInstagram').value.trim(),
        businessHours: document.getElementById('settingHours').value.trim(),
        adminPassword: document.getElementById('settingPassword').value.trim()
    };
    
    saveConfig(config);
    alert('✅ Settings saved!');
}