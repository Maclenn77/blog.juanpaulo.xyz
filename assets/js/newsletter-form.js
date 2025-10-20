// Newsletter Form Handler
(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        // Use environment-specific API URL
        apiUrl: window.NEWSLETTER_API_URL || 'http://localhost:3000/subscribe',
        messages: {
            success: '✓ Successfully subscribed!',
            invalidEmail: '✗ Invalid email address',
            networkError: '✗ Failed to subscribe. Please try again.',
            loading: 'Subscribing...'
        }
    };

    // Initialize when DOM is ready
    function init() {
        const form = document.getElementById('newsletter-form');
        if (!form) {
            console.warn('Newsletter form not found');
            return;
        }

        form.addEventListener('submit', handleSubmit);
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageDiv = document.getElementById('form-message');
        const button = form.querySelector('button[type="submit"]');
        
        const email = emailInput.value.trim();
        const first_name = nameInput ? nameInput.value.trim() : '';
        
        // Reset message
        clearMessage(messageDiv);
        
        // Validate email client-side
        if (!isValidEmail(email)) {
            showMessage(messageDiv, CONFIG.messages.invalidEmail, 'error');
            return;
        }
        
        // Disable form during submission
        setFormLoading(button, emailInput, true);
        
        try {
            const response = await submitEmail(email);
            
            if (response.ok) {
                const data = await response.json();
                showMessage(messageDiv, data.message || CONFIG.messages.success, 'success');
                form.reset();
            } else {
                const data = await response.json().catch(() => ({}));
                showMessage(messageDiv, data.error || CONFIG.messages.networkError, 'error');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            showMessage(messageDiv, CONFIG.messages.networkError, 'error');
        } finally {
            setFormLoading(button, emailInput, false);
        }
    }

    // Submit email to API
    async function submitEmail(email) {
        return fetch(CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, first_name: first_name })
        });
    }

    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show message to user
    function showMessage(messageDiv, text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    }

    // Clear message
    function clearMessage(messageDiv) {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }

    // Set form loading state
    function setFormLoading(button, input, isLoading) {
        if (isLoading) {
            button.disabled = true;
            input.disabled = true;
            button.setAttribute('data-original-text', button.textContent);
            button.textContent = CONFIG.messages.loading;
        } else {
            button.disabled = false;
            input.disabled = false;
            button.textContent = button.getAttribute('data-original-text') || 'Subscribe';
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();