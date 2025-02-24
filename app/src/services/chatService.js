const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Load chat history from localStorage
export const loadChatHistory = () => {
    try {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            const history = JSON.parse(savedHistory);
            // Convert string timestamps back to Date objects
            return history.map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
    return null;
};

// Save chat history to localStorage
export const saveChatHistory = (messages) => {
    try {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
};

// Clear chat history from localStorage
export const clearChatHistory = () => {
    try {
        localStorage.removeItem('chatHistory');
    } catch (error) {
        console.error('Error clearing chat history:', error);
    }
};

// Get session ID from localStorage
export const getSessionId = () => {
    const sessionId = localStorage.getItem('session-id');
    console.log(' Current session ID:', sessionId || 'None');
    return sessionId;
};

// Save session ID to localStorage
export const saveSessionId = (sessionId) => {
    console.log(' Saving session ID:', sessionId);
    localStorage.setItem('session-id', sessionId);
};

// Clear session ID from localStorage
export const clearSessionId = () => {
    console.log(' Clearing session ID');
    localStorage.removeItem('session-id');
};

export const sendChatMessage = async (message, onChunk) => {
    try {
        const sessionId = getSessionId();
        console.log('📤 Sending message with session ID:', sessionId || 'None');
        
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session-id': sessionId || ''
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                //Session expired, clear the session
                clearSessionId();
                const errorData = await response.json();
                throw new Error(errorData.message || 'Session expired');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Save the new session ID if provided
        const newSessionId = response.headers.get('session-id');
        if (newSessionId) {
            console.log('📥 Received new session ID:', newSessionId);
            saveSessionId(newSessionId);
        } else {
            console.warn('⚠️ No session ID received in response headers');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        return;
                    }
                    try {
                        const jsonData = JSON.parse(data);
                        if (jsonData.error) {
                            throw new Error(jsonData.error);
                        }
                        if (jsonData.text) {
                            onChunk(jsonData.text);
                        }
                    } catch (e) {
                        console.error('Error processing chunk:', e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in sendChatMessage:', error);
        throw error;
    }
};

export const sendResetSession = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/chat/reset`, {
            method: 'POST',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        
        clearSessionId();
        return response.json();
        
    } catch (error) {
        console.error('Error in resetChat:', error);
        throw error;
    }
};
