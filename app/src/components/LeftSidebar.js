import React from 'react';
import { Box, Tab, Tabs, styled } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CampaignIcon from '@mui/icons-material/Campaign';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FeedbackIcon from '@mui/icons-material/Feedback';
import PublicIcon from '@mui/icons-material/Public';
import CompareIcon from '@mui/icons-material/Compare';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const LeftSidebarContainer = styled(Box)(({ theme }) => ({
  width: '250px',
  height: 'calc(100vh - 64px)', // Subtract navbar height
  borderRight: `1px solid #607175`,
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledTabs = styled(Tabs)({
  '& .MuiTab-root': {
    minHeight: '48px',
    padding: '12px 16px',
    textTransform: 'none',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: '250px',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
  },
  '& .MuiTabs-indicator': {
    left: 0,
    width: '3px',
    borderRadius: '0 2px 2px 0',
    backgroundColor: '#0092F4',
  },
});

const StyledTab = styled(Tab)({
  width: '100%',
  color: '#3A3D43',
  '&.Mui-selected': {
    color: '#024CAA',
    backgroundColor: 'rgba(119, 205, 255, 0.1)',
  },
  '& .MuiTab-wrapper': {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  '& .MuiSvgIcon-root': {
    marginRight: '12px',
    fontSize: '20px',
  },
});

function LeftSidebar({ onTabChange, currentTab }) {
  const handleChange = (event, newValue) => {
    onTabChange(newValue);
  };

  return (
    <LeftSidebarContainer>
      <StyledTabs
        orientation="vertical"
        value={currentTab}
        onChange={handleChange}
        aria-label="dashboard tabs"
        variant="scrollable"
      >
        <StyledTab 
          icon={<PublicIcon />} 
          label="Social Media Performance" 
          iconPosition="start"
        />
        <StyledTab 
          icon={<SentimentSatisfiedAltIcon />} 
          label="Social Media Sentiment" 
          iconPosition="start"
        />
        <StyledTab 
          icon={<FeedbackIcon />} 
          label="Product Review Sentiment" 
          iconPosition="start"
        />
        <StyledTab 
          icon={<MonetizationOnIcon />} 
          label="Sales Performance" 
          iconPosition="start"
        />
        <StyledTab 
          icon={<CampaignIcon />} 
          label="Campaign Performance" 
          iconPosition="start"
        />
        <StyledTab 
          icon={<CompareIcon />} 
          label="Competitors" 
          iconPosition="start"
        />
      </StyledTabs>
    </LeftSidebarContainer>
  );
}

export default LeftSidebar;
