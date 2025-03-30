// hooks/useCollaboration.js
import { useState, useEffect } from 'react';
import collaborationService from '../services/collaborationService';

export function useCollaboration() {
  const [connected, setConnected] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    // Set up connection listener
    const removeConnectionListener = collaborationService.addConnectionListener((isConnected) => {
      setConnected(isConnected);
      if (!isConnected) {
        setCollaborators([]);
      }
    });
    
    // Set up presence listener
    const removePresenceListener = collaborationService.addPresenceListener((activeCollaborators) => {
      setCollaborators(activeCollaborators);
    });
    
    // Set up message listener
    const removeMessageListener = collaborationService.addMessageListener((messageType, payload) => {
      if (messageType === 'chat') {
        setMessages(prevMessages => [...prevMessages, {
          id: Math.random().toString(16).slice(2),
          type: 'chat',
          senderId: payload.senderId,
          senderName: payload.senderName,
          message: payload.message,
          timestamp: payload.timestamp
        }]);
      }
    });
    
    return () => {
      removeConnectionListener();
      removePresenceListener();
      removeMessageListener();
    };
  }, []);
  
  const connect = async (sessionIdToJoin, username) => {
    const result = await collaborationService.connect(sessionIdToJoin, username);
    
    if (result.success) {
      setSessionId(result.sessionId);
      setUserId(result.userId);
    }
    
    return result;
  };
  
  const disconnect = () => {
    const result = collaborationService.disconnect();
    if (result) {
      setSessionId(null);
      setUserId(null);
      setMessages([]);
    }
    return result;
  };
  
  const sendMessage = (message) => {
    if (!connected) return false;
    
    const success = collaborationService.sendMessage('chat', {
      message,
      timestamp: Date.now()
    });
    
    if (success) {
      setMessages(prevMessages => [...prevMessages, {
        id: Math.random().toString(16).slice(2),
        type: 'chat',
        senderId: userId,
        senderName: 'You',
        message,
        timestamp: Date.now()
      }]);
    }
    
    return success;
  };
  
  const updateCursorPosition = (filePath, position) => {
    return collaborationService.updateCursorPosition(filePath, position);
  };
  
  const getCursorPositions = () => {
    return collaborationService.getCursorPositions();
  };
  
  return {
    connected,
    collaborators,
    messages,
    sessionId,
    userId,
    connect,
    disconnect,
    sendMessage,
    updateCursorPosition,
    getCursorPositions
  };
}
