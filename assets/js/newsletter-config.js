// Newsletter API Configuration
// This file should be loaded before newsletter.js

// Set the API URL based on environment
// For local development: use mock server
// For production: use actual API Gateway URL

(function() {
    'use strict';
    
    // Detect environment
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1';
    
    if (isLocal) {
        // Local development - use mock server
        window.NEWSLETTER_API_URL = 'http://localhost:3000/subscribe';
        console.log('Newsletter: Using local mock server');
    } else {
        // Production - use AWS API Gateway
        // TODO: Replace with your actual API Gateway URL after deployment
        window.NEWSLETTER_API_URL = 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/subscribe';
        console.log('Newsletter: Using production API');
    }
})();