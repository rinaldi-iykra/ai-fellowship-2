import React, { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import SentimentDashboard from './dashboards/SentimentDashboard';
import CampaignDashboard from './dashboards/CampaignDashboard';
// import MarketTrendDashboard from './dashboards/MarketTrendDashboard';
import CustomerFeedbackDashboard from './dashboards/CustomerFeedbackDashboard';
import SocialMediaDashboard from './dashboards/SocialMediaDashboard';
import CompetitorAnalysisDashboard from './dashboards/CompetitorAnalysisDashboard';
import SalesPerformanceDashboard from './dashboards/SalesPerformanceDashboard';
import ChatboxToggle from './ChatboxToggle';

const MainContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  height: 'calc(100vh - 64px)',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: 'margin-right 0.3s ease-in-out',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
}));

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{
        height: '100%',
        overflow: 'auto',
      }}
    >
      {value === index && children}
    </Box>
  );
}

const Layout = () => {
  const [currentTab, setCurrentTab] = useState(() => {
    return parseInt(sessionStorage.getItem('activeTab') || '0');
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleTabChange = (newValue) => {
    setCurrentTab(newValue);
    sessionStorage.setItem('activeTab', newValue.toString());
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Navbar />
      <MainContent>
        <LeftSidebar currentTab={currentTab} onTabChange={handleTabChange} />
        <ContentArea sx={{ transition: 'margin-right 0.3s ease-in-out' }}>
          <TabPanel value={currentTab} index={0}>
            <SocialMediaDashboard />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <SentimentDashboard />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <CustomerFeedbackDashboard />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <SalesPerformanceDashboard />
          </TabPanel>
          <TabPanel value={currentTab} index={4}>
            <CampaignDashboard />
          </TabPanel>
          <TabPanel value={currentTab} index={5}>
            <CompetitorAnalysisDashboard />
          </TabPanel>
        </ContentArea>
        <ChatboxToggle onToggle={setIsChatOpen} isOpen={isChatOpen} />
      </MainContent>
    </Box>
  );
};

export default Layout;
