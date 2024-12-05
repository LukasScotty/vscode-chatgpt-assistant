(function() {
    const vscode = acquireVsCodeApi();
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    let messages = [];

    function addMessage(content, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user-message' : 'assistant-message'}`;
        messageElement.textContent = content;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        messages.push({
            content,
            isUser
        });
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        messageInput.value = '';
        messageInput.style.height = 'auto';

        vscode.postMessage({
            type: 'sendMessage',
            text: message
        });
    }

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'response':
                addMessage(message.text, false);
                break;
            case 'setInitialText':
                messageInput.value = message.text;
                messageInput.style.height = messageInput.scrollHeight + 'px';
                break;
        }
    });
})();
