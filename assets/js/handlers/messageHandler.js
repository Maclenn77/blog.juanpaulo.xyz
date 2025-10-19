async function messagesHandler(message) {
    const botToken = process.env.PUBLIC_TELEGRAM_API_TOKEN;
    const chatId = process.env.PUBLIC_CHAT_ID;
    
    // Validate environment variables
    if (!botToken || !chatId) {
        throw new Error('Telegram configuration missing. Please check your environment variables.');
    }
    
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML', // Optional: allows HTML formatting in messages
            }),
        });
        
        // Check if response is ok
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Telegram API Error: ${errorData.description || 'Unknown error'}`);
        }
        
        const result = await response.json();
        
        // Verify the message was sent successfully
        if (!result.ok) {
            throw new Error('Telegram did not confirm message delivery');
        }
        
        // Return success result
        return {
            ok: true,
            messageId: result.result.message_id,
            timestamp: new Date().toISOString(),
            data: result
        };
        
    } catch (error) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to connect to Telegram. Please check your internet connection.');
        }
        
        // Re-throw other errors with context
        throw new Error(`Failed to send message: ${error.message}`);
    }
}

export default messagesHandler;
