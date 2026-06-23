// ============================================
//  REVIEWS.JS - Load & Display Reviews
// ============================================

async function loadReviews() {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;

    let reviews = [];

    // Try localStorage first
    const localReviews = localStorage.getItem('mehndiReviews');
    if (localReviews) {
        reviews = JSON.parse(localReviews);
    } else {
        // Fallback to JSON file
        try {
            let response = await fetch('data/reviews.json');
            if (!response.ok) response = await fetch('../data/reviews.json');
            reviews = await response.json();
        } catch (e) {
            console.error('Reviews load failed:', e);
        }
    }

    if (reviews.length === 0) {
        grid.innerHTML = `
            <div class="text-center" style="grid-column:1/-1; padding:40px; color:var(--gray);">
                <p style="font-size:40px;">⭐</p>
                <p>No reviews yet. Be the first to share your experience!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">👤</div>
                <div>
                    <div class="review-name">${r.name}</div>
                    <div class="review-stars">${'⭐'.repeat(r.stars)}</div>
                </div>
            </div>
            <p class="review-text">"${r.review}"</p>
            <div class="review-photo" style="background:#f0e6d3;">🎨</div>
        </div>
    `).join('');
}

