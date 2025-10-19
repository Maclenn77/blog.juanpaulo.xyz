// Comment form handling with direct Telegram integration
import messagesHandler from './handlers/messageHandler.js';

(function() {
    const form = document.getElementById('comment-form');
    const messageDiv = document.getElementById('form-message');
    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const comment = document.getElementById('comment').value.trim();
        
        // Validate inputs
        if (!name || !comment) {
            messageDiv.textContent = 'Por favor completa todos los campos.';
            messageDiv.className = 'error-message';
            return;
        }
        
        // Disable button while processing
        submitButton.disabled = true;
        submitButton.textContent = COMMENT_CONFIG.messages.sending;
        
        // Clear any previous messages
        messageDiv.textContent = '';
        messageDiv.className = '';
        
        try {
            // Format message for Telegram
            const telegramMessage = `📝 Nuevo Comentario\n\n👤 Nombre: ${name}\n💬 Comentario: ${comment}\n🌐 Página: ${window.location.href}\n📅 Fecha: ${new Date().toLocaleString('es-MX')}`;
            
            // Send to Telegram via messagesHandler
            const result = await messagesHandler(telegramMessage);
            
            // Check if message was sent successfully
            if (result && result.ok) {
                // Show success message
                messageDiv.textContent = COMMENT_CONFIG.messages.success.replace('{name}', name);
                messageDiv.className = 'success-message';
                
                // Clear form
                form.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    messageDiv.textContent = '';
                    messageDiv.className = '';
                }, 5000);
            } else {
                throw new Error('No se recibió confirmación del envío');
            }
            
        } catch (error) {
            console.error('Error sending comment:', error);
            
            // Show detailed error message
            let errorMessage = COMMENT_CONFIG.messages.error;
            
            // Add more specific error info if available
            if (error.message.includes('Telegram API Error')) {
                errorMessage += ' (Error de Telegram)';
            } else if (error.message.includes('Network')) {
                errorMessage += ' (Error de conexión)';
            }
            
            messageDiv.textContent = errorMessage;
            messageDiv.className = 'error-message';
            
            // Keep error message visible longer
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = '';
            }, 8000);
            
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = COMMENT_CONFIG.messages.submitText;
        }
    });
})();