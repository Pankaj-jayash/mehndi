// ============================================
//  BOOKING.JS - Premium Booking Form
//  Niraj With Mehndi
// ============================================

let selectedTime = '';

function initBooking() {
    const openBtn = document.getElementById('openBookingForm');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('bookingForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirm = document.getElementById('closeConfirmation');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (selectedDesigns.length === 0) {
                alert('🙏 Please select at least one mehndi design first!');
                return;
            }
            openBookingModal();
        });
    }

    if (modal) {
        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    }
    if (form) form.addEventListener('submit', (e) => { e.preventDefault(); handleBookingSubmit(); });
    if (confirmationModal && closeConfirm) {
        closeConfirm.addEventListener('click', () => { confirmationModal.classList.add('hidden'); selectedDesigns = []; renderGallery(); });
        confirmationModal.addEventListener('click', (e) => { if (e.target === confirmationModal) confirmationModal.classList.add('hidden'); });
    }
    if (document.getElementById('eventDate')) document.getElementById('eventDate').setAttribute('min', new Date().toISOString().split('T')[0]);

    // Time chips
    document.querySelectorAll('.time-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedTime = this.dataset.time;
        });
    });

    // Location
    const locationBox = document.getElementById('locationBox');
    if (locationBox) {
        locationBox.addEventListener('click', function() {
            if (navigator.geolocation) {
                document.getElementById('locationText').textContent = 'Getting location...';
                navigator.geolocation.getCurrentPosition(function(pos) {
                    document.getElementById('locationText').textContent = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
                    document.getElementById('locationStatus').textContent = '✅';
                    locationBox.classList.add('shared');
                }, function() {
                    document.getElementById('locationText').textContent = 'Tap to share';
                    document.getElementById('locationStatus').textContent = '❌';
                });
            }
        });
    }

    // Selfie
    const selfieBox = document.getElementById('selfieBox');
    const selfieInput = document.getElementById('selfieInput');
    if (selfieBox && selfieInput) {
        selfieBox.addEventListener('click', () => selfieInput.click());
        selfieInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('selfiePreview').src = e.target.result;
                    document.getElementById('selfiePreview').classList.remove('hidden');
                    document.querySelector('.selfie-text').textContent = 'Photo added';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    const summaryDiv = document.getElementById('modalSelectedDesigns');
    const totalPrice = getTotalPrice();

    if (summaryDiv) {
        summaryDiv.innerHTML = selectedDesigns.map(d => `
            <div class="booking-design-item">
                <div class="booking-design-thumb" style="background-image:url('${d.image}');"></div>
                <div>
                    <div>${d.name.substring(0,15)}</div>
                    <div class="booking-design-price">₹${d.price.toLocaleString('en-IN')}</div>
                </div>
            </div>
        `).join('');
    }

    const totalEl = document.getElementById('bookingTotal');
    if (totalEl) totalEl.textContent = `💰 Total: ₹${totalPrice.toLocaleString('en-IN')}`;
    
    loadSavedDetails();
    selectedTime = '';
    document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
    
    const locationBox = document.getElementById('locationBox');
    if (locationBox) {
        locationBox.classList.remove('shared');
        document.getElementById('locationText').textContent = 'Tap to share location';
    }
    
    const selfiePreview = document.getElementById('selfiePreview');
    if (selfiePreview) selfiePreview.classList.add('hidden');
    const selfieText = document.querySelector('.selfie-text');
    if (selfieText) selfieText.textContent = 'Add photo (optional)';
    const selfieInput = document.getElementById('selfieInput');
    if (selfieInput) selfieInput.value = '';

    modal.classList.remove('hidden');
}

async function handleBookingSubmit() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const eventDate = document.getElementById('eventDate').value;
    const locationBox = document.getElementById('locationBox');
    const location = locationBox && locationBox.classList.contains('shared') ? 
        document.getElementById('locationText').textContent : '';

    if (!name || !phone || !eventDate) { alert('⚠️ Please fill required fields!'); return; }
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) { alert('⚠️ Valid 10-digit phone number!'); return; }

    const booking = {
        id: Date.now(), date: new Date().toISOString(),
        customerName: name, phone, eventDate,
        time: selectedTime, location,
        selectedDesigns: selectedDesigns.map(d => ({ id: d.id, name: d.name, price: d.price, image: d.image })),
        totalPrice: getTotalPrice()
    };

    saveBooking(booking);
    saveUserDetails(name, phone, '');
    document.getElementById('bookingModal').classList.add('hidden');
    showConfirmation(booking);
    openWhatsApp(generateWhatsAppMessage(booking));
}

function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('mehndiBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('mehndiBookings', JSON.stringify(bookings));
}

function generateWhatsAppMessage(booking) {
    let msg = `🌿 *Niraj With Mehndi - New Booking Request*\n\n`;
    msg += `👤 *Name:* ${booking.customerName}\n`;
    msg += `📱 *Phone:* ${booking.phone}\n`;
    msg += `📍 *Location:* ${booking.location || 'Not shared'}\n`;
    msg += `📅 *Event Date:* ${booking.eventDate}\n`;
    if (booking.time) {
        const labels = { morning: '🌅 Morning (8AM-12PM)', afternoon: '☀️ Afternoon (12PM-4PM)', evening: '🌙 Evening (4PM-8PM)' };
        msg += `⏰ *Time:* ${labels[booking.time] || booking.time}\n`;
    }
    msg += `\n📋 *Selected Designs:*\n`;
    booking.selectedDesigns.forEach((d, i) => {
        msg += `  ${i+1}. ${d.name} - ₹${d.price.toLocaleString('en-IN')}\n`;
        msg += `  🖼️ ${d.image}\n\n`;
    });
    msg += `💰 *Total Price:* ₹${booking.totalPrice.toLocaleString('en-IN')}\n`;
    msg += `\n━━━━━━━━━━━━━━━━━━\n`;
    msg += `🙏 Please confirm availability and final price.\n`;
    msg += `📞 Contact: ${booking.phone}`;
    return msg;
}

function showConfirmation(booking) {
    const modal = document.getElementById('confirmationModal');
    const designsDiv = document.getElementById('confirmDesigns');
    if (designsDiv) {
        designsDiv.innerHTML = booking.selectedDesigns.map(d => 
            `🌿 ${d.name} - ₹${d.price.toLocaleString('en-IN')}`
        ).join('<br>') + `<br><strong>Total: ₹${booking.totalPrice.toLocaleString('en-IN')}</strong>`;
    }
    if (modal) modal.classList.remove('hidden');
}

function saveUserDetails(name, phone, address) {
    localStorage.setItem('mehndiUserDetails', JSON.stringify({ name, phone, address }));
}

function loadSavedDetails() {
    const saved = localStorage.getItem('mehndiUserDetails');
    if (saved) {
        const d = JSON.parse(saved);
        const nameEl = document.getElementById('customerName');
        const phoneEl = document.getElementById('customerPhone');
        const dateEl = document.getElementById('eventDate');
        if (nameEl) nameEl.value = d.name || '';
        if (phoneEl) phoneEl.value = d.phone || '';
        if (dateEl) dateEl.value = '';
    } else {
        const form = document.getElementById('bookingForm');
        if (form) form.reset();
    }
}