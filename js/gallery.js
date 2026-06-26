// ============================================
//  VIDEO FEATURE - Play Icon + Popup
// ============================================

// Add video icons to design cards
function addVideoIcons() {
    document.querySelectorAll('.design-card').forEach(card => {
        const designId = parseInt(card.dataset.id);
        const design = allDesigns.find(d => d.id === designId);
        
        // Already has icon?
        if (card.querySelector('.video-icon-wrapper')) return;
        
        // Only if video exists
        if (design && design.video && design.video.url) {
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'video-icon-wrapper';
            iconWrapper.innerHTML = `
                <span class="video-icon">▶️</span>
                <span class="video-text"></span>
            `;
            iconWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                openVideoPopup(design);
            });
            card.appendChild(iconWrapper);
            
            // Magic type animation
            startMagicType(iconWrapper.querySelector('.video-text'));
        }
    });
}

// Magic type effect
function startMagicType(textElement) {
    const word = 'Play Video';
    let index = 0;
    let typing = true;
    
    function type() {
        if (typing) {
            if (index <= word.length) {
                textElement.textContent = word.substring(0, index);
                index++;
                setTimeout(type, 120);
            } else {
                typing = false;
                setTimeout(type, 7000);
            }
        } else {
            if (index >= 0) {
                textElement.textContent = word.substring(0, index);
                index--;
                setTimeout(type, 60);
            } else {
                typing = true;
                index = 0;
                setTimeout(type, 7000);
            }
        }
    }
    
    setTimeout(type, 7000);
}
// Open video popup
function openVideoPopup(design) {
    const overlay = document.getElementById('videoOverlay');
    const container = document.getElementById('videoContainer');
    const channelName = document.getElementById('videoChannelName');
    const channelImg = document.getElementById('videoChannelImg');
    const platformBtn = document.getElementById('videoPlatformBtn');
    const platformIcon = document.getElementById('videoPlatformIcon');
    const platformText = document.getElementById('videoPlatformText');
    
    if (!overlay || !container || !design.video) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Set video content based on platform
    if (design.video.platform === 'youtube') {
        const videoId = getYouTubeId(design.video.url);
        if (videoId) {
            container.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        }
        platformBtn.className = 'video-platform-btn youtube';
        platformIcon.textContent = '▶️';
        platformText.textContent = 'Open in YouTube';
    } else if (design.video.platform === 'instagram') {
        // Instagram reel — embed via iframe
        const reelUrl = design.video.url;
        container.innerHTML = `<iframe src="${reelUrl}embed/" 
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen 
            style="width:100%;height:100%;"></iframe>`;
        platformBtn.className = 'video-platform-btn instagram';
        platformIcon.textContent = '📷';
        platformText.textContent = 'Open in Instagram';
    }
    
    channelName.textContent = design.video.channelName || '@nirajwithmehndi';
    channelImg.src = design.video.channelImage || 'photos/logo/logo.png';
    platformBtn.href = design.video.url;
    
    overlay.classList.remove('hidden', 'closing');
    document.body.style.overflow = 'hidden';
}
    // Set video URL
    let embedUrl = design.video.url;
    if (design.video.platform === 'youtube') {
        const videoId = getYouTubeId(design.video.url);
        if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        platformBtn.className = 'video-platform-btn youtube';
        platformIcon.textContent = '▶️';
        platformText.textContent = 'Open in YouTube';
    } else if (design.video.platform === 'instagram') {
        platformBtn.className = 'video-platform-btn instagram';
        platformIcon.textContent = '📷';
        platformText.textContent = 'Open in Instagram';
    }
    
    frame.src = embedUrl;
    channelName.textContent = design.video.channelName || '@nirajwithmehndi';
    channelImg.src = design.video.channelImage || 'photos/logo/logo.png';
    platformBtn.href = design.video.url;
    
    overlay.classList.remove('hidden', 'closing');
    document.body.style.overflow = 'hidden';
}

// Close video popup
function closeVideoPopup() {
    const overlay = document.getElementById('videoOverlay');
    const frame = document.getElementById('videoFrame');
    
    if (!overlay) return;
    
    overlay.classList.add('closing');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('closing');
        frame.src = '';
        document.body.style.overflow = '';
    }, 300);
}

// Get YouTube video ID from URL
function getYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Close button
    const closeBtn = document.getElementById('videoClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoPopup);
    }
    
    // Overlay click
    const overlay = document.getElementById('videoOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeVideoPopup();
        });
    }
    
    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeVideoPopup();
    });
});

// Call after gallery render
const originalRender = renderGallery;
renderGallery = function() {
    originalRender();
    setTimeout(addVideoIcons, 100);
};