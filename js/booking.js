// ============================================
//  BOOKING.JS - Form, Validation, WhatsApp
//  Niraj With Mehndi
// ============================================

// ============================================
//  INIT BOOKING
// ============================================
function initBooking() {
    const openBtn = document.getElementById('openBookingForm');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('bookingModal');
    const form = document.getElementById('bookingForm');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirm = document.getElementById('closeConfirmation');

    // Open booking modal
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            if (selectedDesigns.length === 0) {
                alert('🙏 Please select at least one mehndi design first!');
                return;
            }
            openBookingModal();
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Form submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleBookingSubmit();
        });
    }

    // Close confirmation
    if (closeConfirm) {
        closeConfirm.addEventListener('click', () => {
            confirmationModal.classList.add('hidden');
            selectedDesigns = [];
            renderGallery();
        });
    }

    // Set min date to today
    const dateInput = document.getElementById('eventDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// ============================================
//  OPEN BOOKING MODAL
// ============================================
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    const summaryDiv = document.getElementById('modalSelectedDesigns');
    const totalPrice = getTotalPrice();

    // Render selected designs summary
    let summaryHTML = '<h4>📋 Your Selected Designs:</h4>';
    selectedDesigns.forEach(d => {
        summaryHTML += `
            <div class="summary-item">
                <span>🌿 ${d.name}</span>
                <span>₹${d.price.toLocaleString('en-IN')}</span>
            </div>
        `;
    });
    summaryHTML += `
        <div class="summary-total">
            <span>Total:</span>
            <span>₹${totalPrice.toLocaleString('en-IN')}</span>
        </div>
    `;
    summaryDiv.innerHTML = summaryHTML;
// Load saved user details
loadSavedDetails();
    
    // Show modal
    modal.classList.remove('hidden');
}

// ============================================
//  HANDLE BOOKING SUBMIT
// ============================================
async function handleBookingSubmit() {
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const eventDate = document.getElementById('eventDate').value;

    // Validation
    if (!name || !phone || !address || !eventDate) {
        alert('⚠️ Please fill all fields!');
        return;
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
        alert('⚠️ Please enter a valid 10-digit phone number!');
        return;
    }

    // Create booking object
    const booking = {
        id: Date.now(),
        date: new Date().toISOString(),
        customerName: name,
        phone: phone,
        address: address,
        eventDate: eventDate,
        selectedDesigns: selectedDesigns.map(d => ({
            id: d.id,
            name: d.name,
            price: d.price,
            image: d.image
        })),
        totalPrice: getTotalPrice()
    };

   // Save booking to localStorage
saveBooking(booking);

// Save user details for next time
saveUserDetails(name, phone, address);

    // Generate WhatsApp message
    const message = generateWhatsAppMessage(booking);
    
    function generateWhatsAppMessage(booking) {
    let message = `🌿 *Niraj With Mehndi - New Booking Request*\n\n`;
    
    // Urgent check
    const isUrgent = document.getElementById('urgentToggle')?.classList.contains('active');
    if (isUrgent) {
        message += `⚡ *URGENT BOOKING - TODAY!*\n`;
        message += `💰 Extra Charge: +₹500\n\n`;
    }
    
    message += `👤 *Name:* ${booking.customerName}\n`;
    message += `📱 *Phone:* ${booking.phone}\n`;
    message += `📍 *Address:* ${booking.address}\n`;
    message += `📅 *Event Date:* ${booking.eventDate}\n\n`;
    message += `📋 *Selected Designs:*\n`;
    
    booking.selectedDesigns.forEach((d, i) => {
        message += `\n  ${i + 1}. *${d.name}*\n`;
        message += `     💰 Price: ₹${d.price.toLocaleString('en-IN')}\n`;
        message += `     🖼️ Image: ${d.image}\n`;
    });
    
    // Add urgent charge to total
    let totalPrice = booking.totalPrice;
    if (isUrgent) {
        totalPrice += 500;
        message += `\n⚡ Urgent Charge: +₹500\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *Total Price:* ₹${totalPrice.toLocaleString('en-IN')}\n`;
    message += `\n🙏 Please confirm availability and final price.\n`;
    message += `📞 Contact: ${booking.phone}`;
    
    return message;
}
    // Close booking modal
    document.getElementById('bookingModal').classList.add('hidden');
    
    // Show confirmation
    showConfirmation(booking);
    
    // Open WhatsApp
    setTimeout(() => {
        openWhatsApp(message);
    }, 500);
}

// ============================================
//  SAVE BOOKING
// ============================================
function saveBooking(booking) {
    let bookings = JSON.parse(localStorage.getItem('mehndiBookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('mehndiBookings', JSON.stringify(bookings));
    
    console.log('✅ Booking Saved:', booking);
}

// ============================================
//  GENERATE WHATSAPP MESSAGE — WITH IMAGE LINKS
// ============================================
function generateWhatsAppMessage(booking) {
    let message = `🌿 *Niraj With Mehndi - New Booking Request*\n\n`;
    message += `👤 *Name:* ${booking.customerName}\n`;
    message += `📱 *Phone:* ${booking.phone}\n`;
    message += `📍 *Address:* ${booking.address}\n`;
    message += `📅 *Event Date:* ${booking.eventDate}\n\n`;
    message += `📋 *Selected Designs:*\n`;
    
    booking.selectedDesigns.forEach((d, i) => {
        message += `\n  ${i + 1}. *${d.name}*\n`;
        message += `     💰 Price: ₹${d.price.toLocaleString('en-IN')}\n`;
        message += `     🖼️ Image: ${d.image}\n`;
    });
    
    message += `\n━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *Total Price:* ₹${booking.totalPrice.toLocaleString('en-IN')}\n`;
    message += `\n🙏 Please confirm availability and final price.\n`;
    message += `📞 Contact: ${booking.phone}`;
    
    return message;
}

// ============================================
//  SHOW CONFIRMATION
// ============================================
function showConfirmation(booking) {
    const modal = document.getElementById('confirmationModal');
    const designsDiv = document.getElementById('confirmDesigns');
    
    let designsHTML = '<strong>Selected Designs:</strong><br>';
    booking.selectedDesigns.forEach((d, i) => {
        designsHTML += `🌿 ${d.name} - ₹${d.price.toLocaleString('en-IN')}<br>`;
    });
    designsHTML += `<strong>Total: ₹${booking.totalPrice.toLocaleString('en-IN')}</strong>`;
    designsDiv.innerHTML = designsHTML;
    
    modal.classList.remove('hidden');
} 
// ============================================
//  SAVE USER DETAILS FOR NEXT BOOKING
// ============================================
function saveUserDetails(name, phone, address) {
    const userDetails = {
        name: name,
        phone: phone,
        address: address
    };
    localStorage.setItem('mehndiUserDetails', JSON.stringify(userDetails));
}

// ============================================
//  LOAD SAVED USER DETAILS
// ============================================
function loadSavedDetails() {
    const saved = localStorage.getItem('mehndiUserDetails');
    
    if (saved) {
        const details = JSON.parse(saved);
        document.getElementById('customerName').value = details.name || '';
        document.getElementById('customerPhone').value = details.phone || '';
        document.getElementById('customerAddress').value = details.address || '';
        document.getElementById('eventDate').value = '';
    } else {
        document.getElementById('bookingForm').reset();
    }
}
