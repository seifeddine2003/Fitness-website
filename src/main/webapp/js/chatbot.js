 const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const typingIndicator = document.getElementById('typingIndicator');

    // Configuration - Replace with your API endpoint
    const API_CONFIG = {
    endpoint: 'https://your-api-endpoint.com/chat',
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer YOUR_API_KEY' // Uncomment if needed
}
};

    function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'bot' ? '🤖' : '👤';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatMessages.insertBefore(messageDiv, typingIndicator);
    scrollToBottom();
}

    function showTyping() {
    typingIndicator.classList.add('active');
    scrollToBottom();
}

    function hideTyping() {
    typingIndicator.classList.remove('active');
}

    function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

    // Function to call your backend API
    async function callChatAPI(userMessage) {
    try {
    const response = await axios({
    method: API_CONFIG.method,
    url: API_CONFIG.endpoint,
    headers: API_CONFIG.headers,
    data: {
    message: userMessage,
    // Add any other required parameters
    timestamp: new Date().toISOString()
}
});

    // Adjust based on your API response structure
    return response.data.reply || response.data.message || response.data;
} catch (error) {
    console.error('API Error:', error);
    throw error;
}
}

    async function sendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return;

    // Disable input while processing
    messageInput.disabled = true;
    sendButton.disabled = true;

    // Add user message
    addMessage(text, 'user');
    messageInput.value = '';

    // Show typing indicator
    showTyping();

    try {
    // Call the API
    const botResponse = await callChatAPI(text);

    // Hide typing and show response
    hideTyping();
    addMessage(botResponse, 'bot');
} catch (error) {
    // Handle error
    hideTyping();
    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
} finally {
    // Re-enable input
    messageInput.disabled = false;
    sendButton.disabled = false;
    messageInput.focus();
}
}

    // Event listeners
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !messageInput.disabled) {
    sendMessage();
}
});

    // Focus input on load
    window.addEventListener('load', function() {
    messageInput.focus();
});