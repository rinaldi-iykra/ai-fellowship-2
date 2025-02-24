import React from 'react';
import { Button, IconButton, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatbotDashboard from './dashboards/ChatbotDashboard';

const ToggleButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  right: 0,
  bottom: '3%',
  transform: 'translateY(-50%)',
  backgroundColor: '#2d2d2d',
  color: 'white',
  padding: '40px 10px',
  minWidth: 'auto',
  borderRadius: '4px 0 0 4px',
  writingMode: 'vertical-lr',
  textOrientation: 'mixed',
  textTransform: 'none',
  fontSize: '14px',
  letterSpacing: '1px',
  '&:hover': {
    backgroundColor: '#686868',
  },
  zIndex: 1300,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: '8px',
  top: '4px',
  color: 'white',
  zIndex: 1301,
}));

const ChatboxContainerWrapper = styled('div')(({ $isOpen }) => ({
  width: '600px',
  height: '100%',
  backgroundColor: '#1e1e1e',
  borderLeft: '1px solid #404040',
  display: $isOpen ? 'block' : 'none',
  flexShrink: 0,
  position: 'relative',
}));

const ChatboxToggle = ({ onToggle, isOpen }) => {
  const toggleChat = () => {
    onToggle(!isOpen);
  };

  return (
    <>
      {!isOpen && (
        <ToggleButton onClick={toggleChat}>
          AI Chatbot
        </ToggleButton>
      )}
      <ChatboxContainerWrapper $isOpen={isOpen}>
        {isOpen && (
          <CloseButton onClick={toggleChat} aria-label="close chat">
            <CloseIcon />
          </CloseButton>
        )}
        <ChatbotDashboard />
      </ChatboxContainerWrapper>
    </>
  );
};

export default ChatboxToggle;
