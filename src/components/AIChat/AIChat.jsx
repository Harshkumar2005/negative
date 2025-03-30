import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AIChat = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box sx={{ 
      flexGrow: 1, 
      overflow: 'auto', 
      p: 1, 
      display: 'flex', 
      flexDirection: 'column',
      gap: 1
    }}>
      {messages.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          textAlign: 'center',
          color: 'text.secondary',
          p: 2
        }}>
          <Typography variant="body1" gutterBottom>
            AI Assistant
          </Typography>
          <Typography variant="body2">
            Ask me about your code, debugging problems, or for coding suggestions.
          </Typography>
        </Box>
      ) : (
        messages.map((message) => (
          <Paper
            key={message.id}
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2,
              maxWidth: '90%',
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender === 'user' ? 'primary.main' : 'background.paper',
              borderColor: message.sender === 'user' ? 'primary.main' : 'divider',
              borderWidth: 1,
              borderStyle: 'solid'
            }}
          >
            <Typography variant="body2">
              {message.text}
            </Typography>
          </Paper>
        ))
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default AIChat;
