import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const brandLogos = {
  adidas: process.env.PUBLIC_URL + '/assets/brands/adidas.png',
  nike: process.env.PUBLIC_URL + '/assets/brands/nike.png',
  puma: process.env.PUBLIC_URL + '/assets/brands/puma.png',
  reebok: process.env.PUBLIC_URL + '/assets/brands/reebok.png',
  converse: process.env.PUBLIC_URL + '/assets/brands/converse.png',
};

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiTable-root': {
    backgroundColor: theme.palette.background.paper,
    borderCollapse: 'separate',
    borderSpacing: 0,
    tableLayout: 'fixed',
    width: '100%',
  }
}));

const BrandLogo = styled('img')({
  width: '24px',
  height: '24px',
  marginRight: '8px',
  verticalAlign: 'middle',
});

const HeaderContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Separate styled components for header and regular cells
const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  padding: '8px 16px',
  fontSize: 14,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: '14%',
  textAlign: 'center',
  '&:first-of-type': {
    width: '20%',
  },
  '&:last-child': {
    borderRight: 'none',
  },
  backgroundColor: theme.palette.grey[100],
  fontWeight: 'bold',
  color: theme.palette.text.primary,
}));

const MarketAvgTableCell = styled(TableCell)(({ theme }) => ({
  padding: '8px 16px',
  fontSize: 14,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: '14%',
  textAlign: 'center',
  '&:first-of-type': {
    width: '20%',
  },
  '&:last-child': {
    borderRight: 'none',
  },
  position: 'relative',
  background: 'linear-gradient(45deg, transparent 10px, #fff 10px)',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: '10px',
    borderRight: `1px solid ${theme.palette.divider}`,
  }
}));

const BrandTableCell = styled(TableCell)(({ theme, brandname }) => ({
  padding: '8px 16px',
  fontSize: 14,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  width: '14%',
  textAlign: 'center',
  '&:first-of-type': {
    width: '20%',
  },
  '&:last-child': {
    borderRight: 'none',
  },
  ...(brandname === 'adidas' && {
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
  }),
  ...(brandname === 'nike' && {
    backgroundColor: 'rgba(234, 67, 53, 0.1)',
  }),
  ...(brandname === 'puma' && {
    backgroundColor: 'rgba(251, 188, 4, 0.1)',
  }),
  ...(brandname === 'reebok' && {
    backgroundColor: 'rgba(52, 168, 83, 0.1)',
  }),
  ...(brandname === 'converse' && {
    backgroundColor: 'rgba(103, 58, 183, 0.1)',
  }),
}));

const StyledTableRow = styled(TableRow)({
  '& td, & th': {
    width: '14%',
    '&:first-of-type': {
      width: '20%',
    },
  },
});

const DashboardTitle = styled(Typography)(({ theme }) => ({
  color: "#FFFFFF",
  backgroundColor: "#262B40",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[50],
  padding: '8px 16px',
  marginBottom: theme.spacing(0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: 'bold',
}));

const CompetitorAnalysisDashboard = () => {
  const salesPerformanceData = [
    {
      metric: 'Order Value ($)',
      marketAvg: 85,
      adidas: 95,
      nike: 90,
      puma: 80,
      reebok: 75,
      converse: 70
    },
    {
      metric: 'Return Rate (%)',
      marketAvg: 5.5,
      adidas: 4.8,
      nike: 4.5,
      puma: 5.9,
      reebok: 6.1,
      converse: 5.8
    },
    {
      metric: 'Repeat Purchase Score',
      marketAvg: 7.5,
      adidas: 8.2,
      nike: 8.5,
      puma: 7.8,
      reebok: 7.4,
      converse: 7.1
    }
  ];

  const productPopularityData = [
    {
      metric: 'Number of Reviews (K)',
      marketAvg: 100,
      adidas: 150,
      nike: 180,
      puma: 85,
      reebok: 90,
      converse: 70
    },
    {
      metric: 'Trending Score',
      marketAvg: 7.0,
      adidas: 8.5,
      nike: 9.0,
      puma: 7.5,
      reebok: 7.2,
      converse: 6.8
    },
    {
      metric: 'Product Lifecycle Status',
      marketAvg: 'Mature',
      adidas: 'Growth',
      nike: 'Growth',
      puma: 'Mature',
      reebok: 'Mature',
      converse: 'Decline'
    }
  ];

  const sentimentData = [
    {
      metric: 'Sentiment Score',
      marketAvg: 7.5,
      adidas: 8.2,
      nike: 8.5,
      puma: 7.8,
      reebok: 7.4,
      converse: 7.1
    },
    {
      metric: 'Emotion Score',
      marketAvg: 7.0,
      adidas: 7.8,
      nike: 8.0,
      puma: 7.2,
      reebok: 7.0,
      converse: 6.8
    },
    {
      metric: 'Helpful Votes (K)',
      marketAvg: 50,
      adidas: 75,
      nike: 85,
      puma: 45,
      reebok: 40,
      converse: 35
    }
  ];

  const socialMediaData = [
    {
      metric: 'Engagement Count (M)',
      marketAvg: 2.5,
      adidas: 3.8,
      nike: 4.2,
      puma: 2.1,
      reebok: 1.8,
      converse: 1.5
    },
    {
      metric: 'Hashtag Trend Score',
      marketAvg: 7.0,
      adidas: 8.5,
      nike: 9.0,
      puma: 7.2,
      reebok: 6.8,
      converse: 6.5
    }
  ];

  const demographicsData = [
    {
      metric: 'Primary Age Group',
      marketAvg: '25-34',
      adidas: '18-24',
      nike: '18-24',
      puma: '25-34',
      reebok: '35-44',
      converse: '18-24'
    },
    {
      metric: 'Gender Ratio (M:F)',
      marketAvg: '55:45',
      adidas: '60:40',
      nike: '58:42',
      puma: '55:45',
      reebok: '50:50',
      converse: '45:55'
    },
    {
      metric: 'Top Location',
      marketAvg: 'US',
      adidas: 'Europe',
      nike: 'US',
      puma: 'Europe',
      reebok: 'US',
      converse: 'US'
    }
  ];

  const sustainabilityData = [
    {
      metric: 'Sustainability Score',
      marketAvg: 7.0,
      adidas: 8.5,
      nike: 8.2,
      puma: 7.8,
      reebok: 7.2,
      converse: 6.8
    },
    {
      metric: 'Eco-Friendly Keywords (%)',
      marketAvg: 15,
      adidas: 25,
      nike: 22,
      puma: 18,
      reebok: 15,
      converse: 12
    }
  ];

  const marketingData = [
    {
      metric: 'Marketing Budget (M$)',
      marketAvg: 50,
      adidas: 80,
      nike: 100,
      puma: 45,
      reebok: 40,
      converse: 35
    },
    {
      metric: 'Campaign Reach (M)',
      marketAvg: 25,
      adidas: 40,
      nike: 45,
      puma: 22,
      reebok: 20,
      converse: 18
    },
    {
      metric: 'Target Engagement (%)',
      marketAvg: 65,
      adidas: 75,
      nike: 80,
      puma: 68,
      reebok: 62,
      converse: 60
    }
  ];

  const renderBrandHeader = (brand) => (
    <HeaderContent>
      <BrandLogo src={brandLogos[brand.toLowerCase()]} alt={`${brand} logo`} />
      {brand}
    </HeaderContent>
  );

  const renderTable = (title, data, showHeader = false) => (
    <Box sx={{ mb: 1 }}>
      <SectionTitle variant="h6">
        {title}
      </SectionTitle>
      <StyledTableContainer component={Paper}>
        <Table>
          {showHeader && (
            <TableHead>
              <StyledTableRow>
                <HeaderTableCell>Metric</HeaderTableCell>
                <HeaderTableCell>Market Average</HeaderTableCell>
                <HeaderTableCell>{renderBrandHeader('Adidas')}</HeaderTableCell>
                <HeaderTableCell>{renderBrandHeader('Nike')}</HeaderTableCell>
                <HeaderTableCell>{renderBrandHeader('Puma')}</HeaderTableCell>
                <HeaderTableCell>{renderBrandHeader('Reebok')}</HeaderTableCell>
                <HeaderTableCell>{renderBrandHeader('Converse')}</HeaderTableCell>
              </StyledTableRow>
            </TableHead>
          )}
          <TableBody>
            {data.map((row) => (
              <StyledTableRow key={row.metric}>
                <TableCell>{row.metric}</TableCell>
                <MarketAvgTableCell>{row.marketAvg}</MarketAvgTableCell>
                <BrandTableCell brandname="adidas">{row.adidas}</BrandTableCell>
                <BrandTableCell brandname="nike">{row.nike}</BrandTableCell>
                <BrandTableCell brandname="puma">{row.puma}</BrandTableCell>
                <BrandTableCell brandname="reebok">{row.reebok}</BrandTableCell>
                <BrandTableCell brandname="converse">{row.converse}</BrandTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <DashboardTitle variant="h5">
        Competitor Analysis Dashboard
      </DashboardTitle>

      {renderTable('Sales Performance', salesPerformanceData, true)}
      {renderTable('Product Popularity and Lifecycle', productPopularityData)}
      {renderTable('Customer Sentiment and Reviews', sentimentData)}
      {renderTable('Social Media Presence', socialMediaData)}
      {renderTable('Demographics', demographicsData)}
      {renderTable('Sustainability', sustainabilityData)}
      {renderTable('Marketing Campaign Effectiveness', marketingData)}
    </Box>
  );
};

export default CompetitorAnalysisDashboard;
