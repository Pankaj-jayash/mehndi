// ============================================
//  FAQ.JS - Accordion Functionality
// ============================================

function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isOpen = faqItem.classList.contains('open');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('open');
            });
            
            // Open clicked (if wasn't already open)
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });
}

