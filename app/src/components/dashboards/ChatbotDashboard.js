import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  styled
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReactMarkdown from "react-markdown";
import { sendChatMessage, loadChatHistory, saveChatHistory, clearChatHistory, sendResetSession } from "../../services/chatService";


const MAX_MESSAGES = 10;
const INITIAL_MESSAGE = {
  text: '# Hai Analyst! 👋\nSaya siap membantu Anda menganalisis data dari database.',
  isUser: false,
  timestamp: new Date()
};

const ChatContainer = styled(Box)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#1e1e1e',
  position: 'relative',
  overflow: 'hidden',
});

const MessagesContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minHeight: 0,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#2d2d2d',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
});

const InputContainer = styled(Box)({
  padding: '16px',
  backgroundColor: '#2d2d2d',
  borderTop: '1px solid #404040',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#373737',
    color: '#fff',
    fontSize: '0.9rem',
    '&.Mui-focused fieldset': {
      borderColor: '#5c6bc0',
    },
  },
});

const formatTimestamp = date => 
  `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

// Memoized markdown components
const MemoizedMarkdown = React.memo(({ text, components }) => (
  <ReactMarkdown components={components}>{text}</ReactMarkdown>
));

// Memoized Message component
const Message = React.memo(({ message }) => {
  const { text, isUser, isTyping, isError, timestamp } = message;
  
  const markdownComponents = useMemo(() => ({
    p: ({ children }) => <Typography sx={{ m: 0, fontSize: '0.9rem' }}>{children}</Typography>,
    pre: ({ children }) => (
      <Box component="pre" sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 1,
        p: 1,
        overflowX: 'auto',
        '& code': {
          color: '#fff',
          fontSize: '0.85rem',
        },
      }}>{children}</Box>
    ),
    code: ({ inline, children }) => inline ? (
      <Box component="code" sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 0.5,
        px: 0.5,
        fontSize: '0.85rem',
      }}>{children}</Box>
    ) : <code>{children}</code>,
    h1: ({ children }) => <Typography variant="h1" sx={{ fontSize: '1.3rem', fontWeight: 'bold', my: 2 }}>{children}</Typography>,
    h2: ({ children }) => <Typography variant="h2" sx={{ fontSize: '1.1rem', fontWeight: 'bold', my: 1.5 }}>{children}</Typography>,
    h3: ({ children }) => <Typography variant="h3" sx={{ fontSize: '1rem', fontWeight: 'bold', my: 1 }}>{children}</Typography>,
    li: ({ children }) => <Typography component="li" sx={{ fontSize: '0.9rem' }}>{children}</Typography>,
  }), []);
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      width: '100%',
    }}>
      <Box sx={{
        maxWidth: '70%',
        backgroundColor: isUser ? '#2196f3' : '#424242',
        color: '#fff',
        borderRadius: 2,
        p: 2,
        position: 'relative',
        fontSize: '0.9rem',
        wordBreak: 'break-word',
        ...(isError && { backgroundColor: '#d32f2f' }),
      }}>
        {isTyping && !text && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={15} sx={{ color: '#fff' }} />
            <Typography sx={{ fontSize: '0.9rem' }}>AI sedang mencari data</Typography>
          </Box>
        )}
        {text && (
          <>
            <MemoizedMarkdown text={text} components={markdownComponents} />
            {isTyping && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mt: 1,
                pt: 1,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <CircularProgress size={12} sx={{ color: '#fff', mr: 1 }} />
                <Typography sx={{ fontSize: '0.8rem', opacity: 0.7 }}>
                  AI masih mengetik
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
      {timestamp && (
        <Typography sx={{ 
          fontSize: '0.8rem', 
          color: '#666',
          mt: 0.5,
          px: 1
        }}>
          {formatTimestamp(timestamp)}
        </Typography>
      )}
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.message.text === nextProps.message.text &&
    prevProps.message.isTyping === nextProps.message.isTyping &&
    prevProps.message.isError === nextProps.message.isError
  );
});

const prebuiltPrompts = [
  "Analisis tren penjualan dalam 6 bulan terakhir",
  "Tampilkan top 10 produk dengan penjualan tertinggi",
  "Bandingkan performa penjualan antar region",
  "Analisis pola pembelian customer berdasarkan demografi",
  "Hitung rata-rata nilai transaksi per customer",
];

const ChatbotDashboard = () => {
  const [messages, setMessages] = useState(() => {
    const savedHistory = loadChatHistory();
    return savedHistory || [INITIAL_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const memoizedMessages = useMemo(() => {
    const recentMessages = messages.slice(-MAX_MESSAGES);
    // console.log(`Chat history size: ${messages.length} messages, displaying last ${recentMessages.length}`);
    return recentMessages;
  }, [messages]);

  // Handle resize observer
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [memoizedMessages, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sessionExpired) return;

    const userMessage = { text: input, isUser: true, timestamp: new Date() };
    const aiMessage = { text: "", isUser: false, isTyping: true, timestamp: new Date() };

    setMessages(prev => {
      const newMessages = [...prev, userMessage, aiMessage];
      return newMessages.length > MAX_MESSAGES ? newMessages.slice(-MAX_MESSAGES) : newMessages;
    });
    
    setInput("");
    setAnchorEl(null);
    
    let streamedText = "";
    try {
      await sendChatMessage(input, (chunk) => {
        streamedText += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const aiMessageIndex = newMessages.length - 1;
          newMessages[aiMessageIndex] = {
            ...newMessages[aiMessageIndex],
            text: streamedText,
            isTyping: true
          };
          return newMessages.length > MAX_MESSAGES ? newMessages.slice(-MAX_MESSAGES) : newMessages;
        });
      });

      setMessages(prev => {
        const newMessages = [...prev];
        const aiMessageIndex = newMessages.length - 1;
        newMessages[aiMessageIndex] = {
          ...newMessages[aiMessageIndex],
          text: streamedText,
          isTyping: false
        };
        return newMessages.length > MAX_MESSAGES ? newMessages.slice(-MAX_MESSAGES) : newMessages;
      });
    } catch (error) {
      console.error('Error in chat:', error);
      if (error.message === "Your Session is expired" || error.message === "Your Session is Invalid") {
        setSessionExpired(true);
        setMessages(prev => [...prev, {
          text: "⚠️ Session has expired. Please reset the chat to start a new conversation.",
          isUser: false,
          timestamp: new Date(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          text: "❌ Error: " + error.message,
          isUser: false,
          timestamp: new Date(),
        }]);
      }
    }
  };

  const handleReset = () => setOpenConfirmDialog(true);
  const handleConfirmReset = () => {
    sendResetSession();
    setMessages([INITIAL_MESSAGE]);
    clearChatHistory();
    setOpenConfirmDialog(false);
    setSessionExpired(false);
  };
  const handleCancelReset = () => setOpenConfirmDialog(false);
  const handlePromptClick = (event) => setAnchorEl(event.currentTarget);
  const handlePromptClose = () => setAnchorEl(null);
  const handlePromptSelect = (prompt) => {
    setInput(prompt);
    handlePromptClose();
  };

  return (
    <ChatContainer ref={containerRef}>
      <Box sx={{ 
        position: 'relative', 
        borderBottom: '1px solid #404040',
        backgroundColor: '#2d2d2d',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" sx={{ color: '#fff', fontSize: '0.9rem' }}>
            Chat Assistant
          </Typography>
          <Button
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            size="small"
            sx={{
              color: '#fff',
              fontSize: '0.8rem',
              textTransform: 'none',
              ml: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              ...(sessionExpired && { color: '#f44336' }),
            }}
          >
            Reset Chat
          </Button>
        </Box>
      </Box>

      <MessagesContainer>
        {memoizedMessages.map((message, index) => (
          <Message 
            key={`${message.timestamp.getTime()}-${index}`} 
            message={message} 
          />
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <Box sx={{ mb: 2 }}>
          <Tooltip title="Pilih prompt yang sudah disiapkan">
            <Button
              onClick={handlePromptClick}
              startIcon={<KeyboardArrowUpIcon />}
              sx={{
                color: '#fff',
                fontSize: '0.8rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Prompt Templates
            </Button>
          </Tooltip>
        </Box>
        <StyledTextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ketik pesan..."
          disabled={sessionExpired}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSend} sx={{ color: '#fff' }} disabled={sessionExpired}>
                <SendIcon />
              </IconButton>
            ),
          }}
        />
      </InputContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handlePromptClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            color: '#fff',
            maxHeight: 300,
          }
        }}
      >
        {prebuiltPrompts.map((prompt, index) => (
          <MenuItem
            key={index}
            onClick={() => handlePromptSelect(prompt)}
            sx={{
              fontSize: '0.9rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {prompt}
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelReset}
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            color: '#fff',
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1rem' }}>
          Reset Chat
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem' }}>
            Apakah Anda yakin ingin menghapus semua riwayat chat?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReset} sx={{ color: '#fff', fontSize: '0.9rem' }}>
            Batal
          </Button>
          <Button onClick={handleConfirmReset} sx={{ color: '#f44336', fontSize: '0.9rem' }}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </ChatContainer>
  );
};

export default React.memo(ChatbotDashboard);
