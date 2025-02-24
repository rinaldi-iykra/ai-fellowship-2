// import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import { useBrand } from '../../context/BrandContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const DashboardTitle = styled(Typography)(({ theme }) => ({
  color: "#FFFFFF",
  backgroundColor: "#262B40",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ChartCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  height: "100%",
  backgroundColor: '#FFFFFF',
  // border: '1px solid #607175',
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: '#FFF',
  color: '#22262B',
}));

const CampaignDashboard = () => {
  const { selectedBrand } = useBrand();

  // Campaign Overview Data
  const campaignInfo = {
    name: 'Summer Collection 2024',
    budget: '$50,000',
    reach: '2.5M',
    targetEngagement: 0.75, // 75% of target
    actualEngagement: 0.65, // 65% achieved
  };

  // Performance Metrics
  const metrics = {
    cpe: '$1.25',
    ctr: '4.2%',
    conversionRate: '2.8%',
    revenueGenerated: '$150,000',
    roi: '200%',
  };

  // Platform Performance Data
  const platformData = {
    labels: ['Facebook', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn'],
    datasets: [{
      label: 'Engagement Rate',
      data: [4.2, 5.1, 6.3, 3.8, 2.9],
      backgroundColor: [
        '#0092F4',
        '#334092',
        '#6256CA',
        '#77CDFF',
        '#87C2FF',
      ],
    }],
  };

  // Engagement Trend Data
  const engagementTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
      label: 'Engagement',
      data: [1200, 1900, 2100, 2800, 2400, 2900],
      borderColor: '#0092F4',
      tension: 0.4,
      fill: false,
    }],
  };

  // Sentiment Analysis Data
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: ['#0092F4', '#77CDFF', '#334092'],
    }],
  };

  // Demographics Data
  const ageGroupData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
    datasets: [{
      label: 'Age Distribution',
      data: [25, 35, 20, 15, 5],
      backgroundColor: [
        '#0092F4',
        '#334092',
        '#6256CA',
        '#77CDFF',
        '#87C2FF',
      ],
    }],
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <DashboardTitle variant="h5">
        Campaign Performance Dashboard - {selectedBrand}
      </DashboardTitle>

      {/* Campaign Overview */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>Campaign Name</Typography>
            <Typography variant="h5">{campaignInfo.name}</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>Total Budget</Typography>
            <Typography variant="h5">{campaignInfo.budget}</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>Total Reach</Typography>
            <Typography variant="h5">{campaignInfo.reach}</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>Engagement Progress</Typography>
            <Box sx={{ width: '100%', mt: 1 }}>
              <GaugeChart
                id="engagement-gauge"
                nrOfLevels={3}
                percent={campaignInfo.actualEngagement}
                colors={['#607175   ', '#6256CA', '#0092F4']}
              />
            </Box>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={2.4}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>CPE</Typography>
            <Typography variant="h5">{metrics.cpe}</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>CTR</Typography>
            <Typography variant="h5">{metrics.ctr}</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>Conversion Rate</Typography>
            <Typography variant="h5">{metrics.conversionRate}</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>Revenue</Typography>
            <Typography variant="h5">{metrics.revenueGenerated}</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <MetricCard>
            <Typography variant="h6" sx={{mb : 1}}>ROI</Typography>
            <Typography variant="h5">{metrics.roi}</Typography>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        
        {/* Engagement Trend */}
        <Grid item xs={12} md={12}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engagement Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={engagementTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Platform Performance */}
        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Platform Performance
              </Typography>
              <Box sx={{ height: 250 }}>
                <Bar
                  data={platformData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Sentiment Analysis */}
        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sentiment Analysis
              </Typography>
              <Box sx={{ height: 250 }}>
                <Doughnut
                  data={sentimentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Age Demographics */}
        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Age Demographics
              </Typography>
              <Box sx={{ height: 250 }}>
                <Pie
                  data={ageGroupData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CampaignDashboard;
