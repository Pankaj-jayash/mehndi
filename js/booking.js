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

    if (closeBtn) modal.addEventListener('click', (e) => { if (e.target === modal || e.target === closeBtn) modal.classList.add('hidden'); });
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
    if (form) form.addEventListener('submit', (e) => { e.preventDefault(); handleBookingSubmit(); });
    if (closeConfirm) closeConfirm.addEventListener('click', () => { confirmationModal.classList.add('hidden'); selectedDesigns = []; renderGallery(); });
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
    // Location
const locationBox = document.getElementById('locationBox');
if (locationBox) {
    locationBox.addEventListener('click', function() {
        if (navigator.geolocation) {
            document.getElementById('locationText').textContent = 'Getting location...';
            navigator.geolocation.getCurrentPosition(function(pos) {
                const lat = pos.coords.latitude.toFixed(4);
                const lng = pos.coords.longitude.toFixed(4);
                document.getElementById('locationText').textContent = `${lat}, ${lng}`;
                document.getElementById('locationStatus').textContent = '✅';
                locationBox.classList.add('shared');
            }, function() {
                document.getElementById('locationText').textContent = 'Tap to share';
                document.getElementById('locationStatus').textContent = '❌';
            });
        } else {
            document.getElementById('locationText').textContent = 'Not supported';
        }
    });
}

}

function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    const summaryDiv = document.getElementById('modalSelectedDesigns');
    const totalPrice = getTotalPrice();

    // Design previews
    summaryDiv.innerHTML = selectedDesigns.map(d => `
        <div class="booking-design-item">
            <div class="booking-design-thumb" style="background-image:url('${d.image}');"></div>
            <div>
                <div>${d.name.substring(0,15)}</div>
                <div class="booking-design-price">₹${d.price.toLocaleString('en-IN')}</div>
            </div>
        </div>
    `).join('');

    document.getElementById('bookingTotal').textContent = `💰 Total: ₹${totalPrice.toLocaleString('en-IN')}`;

    // Load saved details
    loadSavedDetails();
    
    // Reset optional
    selectedTime = '';
    document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
    document.getElementById('locationBox').classList.remove('shared');
    document.getElementById('locationText').textContent = 'Tap to share location';
    
    modal.classList.remove('hidden');
}

async function handleBookingSubmit() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const eventDate = document.getElementById('eventDate').value;
    const locationText = document.getElementById('locationText').textContent;
    const locationBox = document.getElementById('locationBox');
const location = locationBox && locationBox.classList.contains('shared') ? 
    document.getElementById('locationText').textContent : '';
    
    if (!name || !phone || !eventDate) { alert('⚠️ Please fill required fields!'); return; }
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) { alert('⚠️ Valid 10-digit phone number!'); return; }

    const booking = {
        id: Date.now(),
        date: new Date().toISOString(),
        customerName: name, phone, eventDate,
        time: selectedTime, location, 
        selectedDesigns: selectedDesigns.map(d => ({ id: d.id, name: d.name, price: d.price, image: d.image })),
        totalPrice: getTotalPrice()
    };

    saveBooking(booking);
    const message = generateWhatsAppMessage(booking);

    document.getElementById('bookingModal').classList.add('hidden');
    showConfirmation(booking);

    setTimeout(() => { openWhatsApp(message); }, 500);
}

function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('mehndiBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('mehndiBookings', JSON.stringify(bookings));
}
function generateWhatsAppMessage(booking) {
    let msg = `🌿 *NIRAJ WITH MEHNDI - NEW BOOKING* 🌿\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *Customer Details*\n`;
    msg += `👤 *Name:* ${booking.customerName}\n`;
    msg += `📱 *Phone:* ${booking.phone}\n`;
    msg += `📅 *Date:* ${booking.eventDate}\n`;
    
    if (booking.time) {
        const timeLabel = booking.time === 'morning' ? '🌅 Morning (8AM-12PM)' : 
                         booking.time === 'afternoon' ? '☀️ Afternoon (12PM-4PM)' : 
                         '🌙 Evening (4PM-8PM)';
        msg += `⏰ *Time:* ${timeLabel}\n`;
    }
    
    if (booking.location) {
        msg += `📍 *Location*\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━━━`;
        msg += `📍 ${booking.location}\n`;
    }
    msg += `📋 *Selected Designs*\n`;
    booking.selectedDesigns.forEach((d, i) => {
        msg += `💍 *${i+1}. ${d.name}*\n`;
        msg += `   💰 *Price:* Rs.${d.price.toLocaleString('en-IN')}\n`;
        msg += `   🖼️ *Image:* ${d.image}\n`;
    });
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *TOTAL:* Rs.${booking.totalPrice.toLocaleString('en-IN')}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `✅ *Please confirm the booking.*\n`;
    msg += `🙏 *Thank you for choosing Niraj With Mehndi!* 🪷\n`;
    msg += `📞 *Contact:* 9719312956\n`;
    msg += `📷 *Instagram:* @nirajwithmehndi\n`;
    
    return msg;
}


function showConfirmation(booking) {
    const modal = document.getElementById('confirmationModal');
    document.getElementById('confirmDesigns').innerHTML = booking.selectedDesigns.map(d => 
        `🌿 ${d.name} - ₹${d.price.toLocaleString('en-IN')}`
    ).join('<br>') + `<br><strong>Total: ₹${booking.totalPrice.toLocaleString('en-IN')}</strong>`;
    modal.classList.remove('hidden');
}

function saveUserDetails(name, phone, address) {
    localStorage.setItem('mehndiUserDetails', JSON.stringify({ name, phone, address }));
}

function loadSavedDetails() {
    const saved = localStorage.getItem('mehndiUserDetails');
    if (saved) {
        const d = JSON.parse(saved);
        document.getElementById('customerName').value = d.name || '';
        document.getElementById('customerPhone').value = d.phone || '';
        document.getElementById('eventDate').value = '';
    } else {
        document.getElementById('bookingForm').reset();
    }
}