// ============================================
//  RECENT BOOKING POPUPS — BELL + BLUR + 2-3 MIN
// ============================================

const recentBookings = [
    { name: 'Priya Sharma', place: 'Mathura', design: 'Bridal Mehndi', price: '₹5,000', time: '1 min ago' },
    { name: 'Neha Gupta', place: 'Mant', design: 'Arabic Design', price: '₹1,500', time: '2 min ago' },
    { name: 'Anjali Patel', place: 'Vrindavan', design: 'Sangeet Mehndi', price: '₹2,000', time: '3 min ago' },
    { name: 'Kavita Rawat', place: 'Raya', design: 'Simple Mehndi', price: '₹500', time: '4 min ago' },
    { name: 'Ritu Mishra', place: 'Mathura', design: 'Bridal Mehndi', price: '₹5,000', time: '5 min ago' },
    { name: 'Sunita Devi', place: 'Goverdhan', design: 'Leg Mehndi', price: '₹1,800', time: '6 min ago' },
    { name: 'Pooja Kumari', place: 'Mant', design: 'Arabic Design', price: '₹1,500', time: '7 min ago' },
    { name: 'Meena Singh', place: 'Vrindavan', design: 'Dulhan Special', price: '₹3,000', time: '8 min ago' },
    { name: 'Radha Goswami', place: 'Mathura', design: 'Party Mehndi', price: '₹1,200', time: '9 min ago' },
    { name: 'Sita Raman', place: 'Vrindavan', design: 'Bridal Mehndi', price: '₹5,000', time: '10 min ago' },
    { name: 'Gita Pandey', place: 'Mathura', design: 'Arabic Mehndi', price: '₹1,800', time: '11 min ago' },
    { name: 'Rekha Jain', place: 'Vrindavan', design: 'Simple Design', price: '₹600', time: '12 min ago' },
    { name: 'Usha Thakur', place: 'Mant', design: 'Sangeet Special', price: '₹2,500', time: '13 min ago' },
    { name: 'Lata Agarwal', place: 'Mathura', design: 'Bridal Mehndi', price: '₹5,000', time: '14 min ago' },
    { name: 'Maya Saxena', place: 'Vrindavan', design: 'Leg Mehndi', price: '₹1,500', time: '15 min ago' }
];

let popupActive = false;

function isModalOpen() {
    return document.querySelector('.modal-overlay:not(.hidden)') ||
           document.querySelector('.zoom-overlay');
}

function playNotificationSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Bell 1
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.connect(gain1); gain1.connect(audioCtx.destination);
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc1.frequency.setValueAtTime(1400, audioCtx.currentTime + 0.08);
        osc1.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.15);
        gain1.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc1.start(audioCtx.currentTime);
        osc1.stop(audioCtx.currentTime + 0.2);
        
        // Bell 2
        setTimeout(() => {
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2); gain2.connect(audioCtx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1000, audioCtx.currentTime);
            osc2.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.08);
            osc2.frequency.setValueAtTime(1000, audioCtx.currentTime + 0.15);
            gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc2.start(audioCtx.currentTime);
            osc2.stop(audioCtx.currentTime + 0.2);
        }, 200);
    } catch(e) {}
}

function showRecentBookingPopup() {
    if (popupActive || isModalOpen()) return;
    popupActive = true;

    playNotificationSound();

    const booking = recentBookings[Math.floor(Math.random() * recentBookings.length)];

    const popup = document.createElement('div');
    popup.className = 'booking-notification';
    popup.innerHTML = `
        <div class="notif-card">
            <div class="notif-verified">
                <span class="notif-bell">🔔</span>
                <span class="verified-icon">✅</span>
                <span class="verified-text">Verified Booking</span>
            </div>
            <button class="notif-close">&times;</button>
            <div class="notif-body">
                <div class="notif-user">
                    <span class="notif-avatar">👤</span>
                    <div>
                        <p class="notif-name">${booking.name}</p>
                        <p class="notif-place">📍 ${booking.place}</p>
                    </div>
                </div>
                <div class="notif-design">
                    <span class="notif-design-icon">🖼️</span>
                    <span class="notif-design-text">${booking.design}</span>
                    <span class="notif-price">${booking.price}</span>
                </div>
                <div class="notif-footer">
                    <span class="notif-time">⏰ ${booking.time}</span>
                    <span class="notif-check">✅ Verified</span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 100);

    popup.querySelector('.notif-close').addEventListener('click', () => {
        hidePopup(popup);
        popupActive = false;
    });

    setTimeout(() => {
        if (popup.parentNode && popup.classList.contains('show')) {
            hidePopup(popup);
            popupActive = false;
        }
    }, 4500);
}

function hidePopup(popup) {
    popup.classList.remove('show');
    setTimeout(() => { if (popup.parentNode) popup.remove(); }, 500);
}

function initRecentBookings() {
    setTimeout(() => { showRecentBookingPopup(); }, 8000);
    // Second popup after 35 seconds
setTimeout(() => { showRecentBookingPopup(); }, 35000);

// Then every 2-3.5 minutes
setInterval(() => { showRecentBookingPopup(); }, 120000 + Math.random() * 90000);
}

document.addEventListener('click', function(e) {
    if (e.target.closest('#openBookingForm') || e.target.closest('.design-card-image')) {
        popupActive = false;
        const existingPopup = document.querySelector('.booking-notification.show');
        if (existingPopup) hidePopup(existingPopup);
    }
});

document.addEventListener('DOMContentLoaded', () => { initRecentBookings(); });