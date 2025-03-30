// services/collaborationService.js
class CollaborationService {
  constructor() {
    this.connected = false;
    this.collaborators = [];
    this.messageListeners = [];
    this.presenceListeners = [];
    this.connectionListeners = [];
    this.cursorPositions = new Map();
    this.sessionId = null;
    
    // Mock collaborators
    this.mockCollaborators = [
      { id: 'user1', name: 'Alice', color: '#FF5733' },
      { id: 'user2', name: 'Bob', color: '#33FF57' },
      { id: 'user3', name: 'Charlie', color: '#3357FF' }
    ];
  }
  
  // Connect to collaboration session
  async connect(sessionId, username) {
    if (this.connected) {
      return { success: false, error: 'Already connected' };
    }
    
    // Simulate network connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.sessionId = sessionId || 'mock-session-' + Math.random().toString(16).slice(2, 8);
    this.connected = true;
    
    // Generate random user ID
    const userId = 'local-' + Math.random().toString(16).slice(2, 10);
    
    // Set random mock collaborators (1-2 people)
    const numCollaborators = Math.floor(Math.random() * 2) + 1;
    this.collaborators = this.mockCollaborators
      .slice(0, numCollaborators)
      .map(c => ({ ...c }));
    
    // Add local user
    this.localUser = {
      id: userId,
      name: username || 'You',
      color: '#4287f5'
    };
    
    // Notify connection listeners
    this.notifyConnectionListeners(true);
    
    // Notify presence listeners
    this.notifyPresenceListeners();
    
    return {
      success: true,
      sessionId: this.sessionId,
      userId,
      collaborators: this.collaborators
    };
  }
  
  // Disconnect from session
  disconnect() {
    if (!this.connected) {
      return false;
    }
    
    this.connected = false;
    this.collaborators = [];
    this.cursorPositions.clear();
    
    // Notify connection listeners
    this.notifyConnectionListeners(false);
    
    return true;
  }
  
  // Send message to all collaborators
  sendMessage(messageType, payload) {
    if (!this.connected) {
      return false;
    }
    
    // In a real implementation, this would send to a server
    console.log(`Sending ${messageType} message:`, payload);
    
    // Mock receiving messages from collaborators
    if (messageType === 'chat') {
      // Simulate collaborator responding
      setTimeout(() => {
        const randomCollaborator = this.collaborators[
          Math.floor(Math.random() * this.collaborators.length)
        ];
        
        const mockResponses = [
          'I like your approach here!',
          'Should we refactor this part?',
          'Looking good!',
          'What do you think about using a different pattern here?',
          'Great progress so far!'
        ];
        
        const randomResponse = mockResponses[
          Math.floor(Math.random() * mockResponses.length)
        ];
        
        this.notifyMessageListeners('chat', {
          senderId: randomCollaborator.id,
          senderName: randomCollaborator.name,
          message: randomResponse,
          timestamp: Date.now()
        });
      }, 2000);
    }
    
    return true;
  }
  
  // Update cursor position
  updateCursorPosition(filePath, position) {
    if (!this.connected || !this.localUser) {
      return false;
    }
    
    // Store local cursor position
    this.cursorPositions.set(this.localUser.id, {
      user: this.localUser,
      filePath,
      position
    });
    
    // In a real implementation, this would send to server
    console.log(`Cursor position updated:`, { filePath, position });
    
    // Simulate collaborators moving cursors
    this.collaborators.forEach(collaborator => {
      if (Math.random() < 0.3) { // 30% chance of movement
        const mockPosition = {
          line: Math.floor(Math.random() * 50),
          column: Math.floor(Math.random() * 80)
        };
        
        this.cursorPositions.set(collaborator.id, {
          user: collaborator,
          filePath,
          position: mockPosition
        });
      }
    });
    
    return true;
  }
  
  // Get cursor positions for all users
  getCursorPositions() {
    return Array.from(this.cursorPositions.values());
  }
  
  // Get all active collaborators
  getCollaborators() {
    return this.collaborators;
  }
  
  // Add message listener
  addMessageListener(listener) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }
  
  // Add presence listener
  addPresenceListener(listener) {
    this.presenceListeners.push(listener);
    return () => {
      this.presenceListeners = this.presenceListeners.filter(l => l !== listener);
    };
  }
  
  // Add connection state listener
  addConnectionListener(listener) {
    this.connectionListeners.push(listener);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }
  
  // Notify message listeners
  notifyMessageListeners(messageType, payload) {
    this.messageListeners.forEach(listener => listener(messageType, payload));
  }
  
  // Notify presence listeners
  notifyPresenceListeners() {
    this.presenceListeners.forEach(listener => 
      listener(this.collaborators)
    );
  }
  
  // Notify connection listeners
  notifyConnectionListeners(connected) {
    this.connectionListeners.forEach(listener => listener(connected));
  }
}

// Singleton instance
const collaborationService = new CollaborationService();

export default collaborationService;
