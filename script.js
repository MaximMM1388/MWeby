document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close nav links when a link is clicked (for mobile navigation)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // --- Quiz Logic Enhancements ---
    const quizForm = document.getElementById('quizForm');
    const quizResultContainer = document.getElementById('quizResult');
    const resultText = document.getElementById('resultText');
    const sendResultEmailBtn = document.getElementById('sendResultEmail');
    const resultEmailInput = document.getElementById('resultEmail');
    const emailCaptureForm = quizResultContainer.querySelector('.email-capture-form'); // Parent for email messages

    // Function to validate email format
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Function to display a message below the email input
    const displayEmailMessage = (message, type = 'info') => {
        let messageElement = emailCaptureForm.querySelector('.email-message');
        if (!messageElement) {
            messageElement = document.createElement('p');
            messageElement.classList.add('email-message');
            emailCaptureForm.insertBefore(messageElement, sendResultEmailBtn);
        }
        messageElement.textContent = message;
        // Remove previous type classes and add new one
        messageElement.classList.remove('success', 'error', 'info');
        messageElement.classList.add(type);

        // Optional: clear message after a few seconds
        if (type !== 'info') {
            setTimeout(() => {
                messageElement.textContent = '';
                messageElement.classList.remove(type);
            }, 5000);
        }
    };

    quizForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);
        const answers = Object.fromEntries(formData.entries());
        
        let type = '';
        let description = '';

        // Determine website type based on answers
        if (answers.goal === 'sales' || answers.online_features === 'e_shop') {
            type = 'E-shop';
            description = 'Potrebujete robustný e-shop s funkciami pre správu produktov, košíka a platobných brán, aby ste mohli predávať online.';
        } else if (answers.online_features === 'booking_reservation' || answers.content_type === 'products_services') {
            type = 'Dynamická Prezentácia s Funkciami';
            description = 'Ideálna bude interaktívna webstránka s rezervačným systémom alebo katalógom služieb, ktorá umožní klientom priamo konať.';
        } else if (answers.goal === 'visibility' || answers.content_type === 'gallery_video' || answers.content_type === 'blog_articles') {
            type = 'Moderná Prezentácia s Blogom/Galériou';
            description = 'Potrebujete vizuálne atraktívnu webstránku s možnosťou blogu alebo rozsiahlej galérie, aby ste zaujali a budovali značku.';
        } else {
            type = 'Základná Prezentácia / Vizitka';
            description = 'Vhodná bude jednoduchá, no efektívna webstránka, ktorá poskytne základné informácie o vašej firme a kontakty.';
        }

        resultText.innerHTML = `Na základe vašich odpovedí, pre vás odporúčam: <strong>${type}</strong>.<br>${description}`;
        quizResultContainer.style.display = 'block'; // Show results container

        // Scroll to result section smoothly
        quizResultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    sendResultEmailBtn.addEventListener('click', () => {
        const email = resultEmailInput.value;
        if (!email) {
            displayEmailMessage('Prosím, zadajte váš e-mail.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            displayEmailMessage('Prosím, zadajte platný e-mail.', 'error');
            return;
        }

        // Disable button and show loading state
        sendResultEmailBtn.textContent = 'Odosielam...';
        sendResultEmailBtn.disabled = true;
        displayEmailMessage('Odosielam vašu ponuku...', 'info');

        // Simulate API call (replace with actual fetch/XHR in a real application)
        setTimeout(() => {
            sendResultEmailBtn.textContent = 'Ponuka Odoslaná!';
            displayEmailMessage('Ďakujeme! Vašu požiadavku spracovávame. Čoskoro Vás budem kontaktovať.', 'success');
            
            // Optionally clear the email input after successful submission
            resultEmailInput.value = '';

            // Re-enable button after a delay (e.g., if user wants to send again later)
            setTimeout(() => {
                sendResultEmailBtn.textContent = 'Pošlite mi ponuku';
                sendResultEmailBtn.disabled = false;
            }, 3000); 

        }, 1500); // Simulate 1.5 seconds delay for sending
    });
});