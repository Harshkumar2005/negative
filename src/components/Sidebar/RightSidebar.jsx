import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { EditorContext } from '../../contexts/EditorContext';
import AIChat from '../AIChat/AIChat';

const RightSidebar = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { activeFile } = useContext(EditorContext);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Here you would typically call your AI service
    // For now, just mock a response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I'm your AI assistant. This feature is still in development, but I'll be able to help you with coding and answer questions soon!",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      borderLeft: 1, 
      borderColor: 'divider' 
    }}>
      <Box sx={{ 
        p: 1, 
        borderBottom: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        <Typography variant="subtitle1">
          AI ASSISTANT
        </Typography>
      </Box>

      <AIChat messages={messages} />

      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Ask AI for help..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={input.trim() === ''}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default RightSidebar;
