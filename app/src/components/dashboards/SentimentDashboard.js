import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Link 
} from "@mui/material";
import { 
  styled 
} from "@mui/material/styles";
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
} from "chart.js";
import { 
  Line, 
  Bar, 
  Pie 
} from "react-chartjs-2";
import ReactWordcloud from "react-wordcloud";
import CommentIcon from "@mui/icons-material/Comment";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import AIDashboardSummary from "../AIDashboardSummary";
import { useBrand } from '../../context/BrandContext';
import { useDate } from "../../context/DateContext";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

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

const SentimentDashboard = () => {
  const { selectedBrand } = useBrand();
  const { getDateRange } = useDate();

  // Data states
  const [overviewData, setOverviewData] = useState({
    totalComments: 0, 
    totalPosts: 0, 
    totalEngagement: 0, 
    sentimentDistribution: {
      positive: 0, 
      negative: 0,
    },
  });

  const [platformSentimentData, setPlatformSentimentData] = useState({
    labels: ["Positif", "Negatif"], 
    datasets: [],
  });

  const [timeSeriesData, setTimeSeriesData] = useState({
    labels: [], 
    datasets: [],
  });

  const [keywordsData, setKeywordsData] = useState({
    positive: [], 
    negative: []
  });

  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [topComments, setTopComments] = useState([]);

  // Initialize contentSentimentData as an empty array
  const [contentSentiment, setContentSentiment] = useState({});
  

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A';
    
    const absNum = Math.abs(Number(num));
    if (absNum >= 1.0e9) {
      return (absNum / 1.0e9).toFixed(2) + 'B';
    } else if (absNum >= 1.0e6) {
      return (absNum / 1.0e6).toFixed(2) + 'M';
    } else if (absNum >= 1.0e3) {
      return (absNum / 1.0e3).toFixed(2) + 'K';
    }
    return absNum.toString();
  };

  const fetchDataFromEndpoint = useCallback(async (endpoint) => {
    try {
      const { startDate, endDate } = getDateRange();
      const response = await fetch(`${API_BASE_URL}/social-media-sentiment/${endpoint}?brand=${encodeURIComponent(selectedBrand)}&startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }, [selectedBrand, getDateRange]);

  const transformContentSentimentData = (data) => {
    const labels = Object.keys(data);
    const positiveData = [];
    const negativeData = [];

    labels.forEach(contentType => {
      positiveData.push(data[contentType].positive);
      negativeData.push(data[contentType].negative);
    });

    return {
      labels: labels,
      datasets: [
        {
          label: 'Positive',
          data: positiveData,
          backgroundColor: '#0092F4',
        },
        {
          label: 'Negative',
          data: negativeData,
          backgroundColor: '#262B40',
        },
      ],
    };
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [overview, platformData, timeSeriesResult, keywordsResult, hashtagsData, commentsData, contentSentimentData] = await Promise.all([
          fetchDataFromEndpoint('overview'),
          fetchDataFromEndpoint('platform-sentiment'),
          fetchDataFromEndpoint('time-series'),
          fetchDataFromEndpoint('keywords'),
          fetchDataFromEndpoint('trending-hashtags'),
          fetchDataFromEndpoint('top-comments'),
          fetchDataFromEndpoint('content-sentiment')
        ]);

        setOverviewData(overview);
        setPlatformSentimentData({
          labels: ["Positif", "Negatif"], 
          datasets: Object.entries(platformData).map(([platform, data]) => ({
            label: platform, 
            data: [data.positive, data.negative], 
            backgroundColor: platform === "Instagram" ? "#6256CA" : "#262B40",
          })),
        });

        setTimeSeriesData({
          labels: timeSeriesResult.labels, 
          datasets: [
            {
              label: "Positive", 
              data: timeSeriesResult.positive, 
              borderColor: "#0092F4", 
              backgroundColor: "rgba(0, 146, 244, 0.1)", 
              tension: 0.4, 
              fill: true,
            },
            {
              label: "Negative", 
              data: timeSeriesResult.negative, 
              borderColor: "#262B40", 
              backgroundColor: "rgba(98, 86, 202, 0.1)", 
              tension: 0.4, 
              fill: true,
            },
          ],
        });

        console.log(hashtagsData)
        setKeywordsData(keywordsResult);
        setTrendingHashtags(hashtagsData);
        setTopComments(commentsData);
        
        setContentSentiment(transformContentSentimentData(contentSentimentData));

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchAllData();
  }, [selectedBrand, getDateRange, fetchDataFromEndpoint]);

  const wordcloudOptions = {
    rotations: 0, 
    rotationAngles: [0], 
    fontSizes: [25, 45], 
    padding: 2,
  };

  return (
    <Box sx={{ p: 3 }}>
      <DashboardTitle variant="h5">
        Sentiment Analysis Dashboard - {selectedBrand}
      </DashboardTitle>

      {/* Overview Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <MetricCard>
            <Box
              sx={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                mb: 1,
              }}
            >
              <PostAddIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Posts</Typography>
            </Box>
            <Typography variant="h5">
              {formatNumber(overviewData.totalPosts)}
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard>
            <Box
              sx={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                mb: 1,
              }}
            >
              <CommentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Comments</Typography>
            </Box>
            <Typography variant="h5">
              {formatNumber(overviewData.totalComments)}
            </Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard>
            <Box
              sx={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                mb: 1,
              }}
            >
              <ThumbUpIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Engagement</Typography>
            </Box>
            <Typography variant="h5">
              {formatNumber(overviewData.totalEngagement)}
            </Typography>
          </MetricCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>

        {/* Time Series Sentiment */}
        <Grid item xs={12} md={12}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sentiment Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={timeSeriesData}
                  options={{
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: {
                      y: {
                        beginAtZero: true, 
                        max: 100, 
                        ticks: {
                          callback: (value) => value + "%",
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.dataset.label}: ${context.raw}%`;
                          },
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

                {/* Sentiment Distribution */}
                <Grid item xs={12} md={4}>
                <ChartCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sentiment Distribution
                    </Typography>
                    <Box sx={{ height: 250 }}>
                      <Pie
                        data={{
                          labels: ["Positif", "Negatif"], 
                          datasets: [
                            {
                              data: [
                                overviewData.sentimentDistribution.positive/100, 
                                overviewData.sentimentDistribution.negative/100,
                              ], 
                              backgroundColor: ["#0092F4", "#262B40"],
                            },
                          ],
                        }}
                        options={{
                          responsive: true, 
                          maintainAspectRatio: false,
                        }}
                      />
                    </Box>
                  </CardContent>
                </ChartCard>
              </Grid>

        {/* Platform Sentiment */}
        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sentiment by Platform
              </Typography>
              <Box sx={{ height: 250 }}>
                <Bar
                  data={platformSentimentData}
                  options={{
                    responsive: true, 
                    maintainAspectRatio: false, 
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Content Sentiment Analysis */}
        <Grid item xs={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sentiment by Content Type
              </Typography>
              <Box sx={{ height: 250 }}>
                {contentSentiment && contentSentiment.datasets ? (
                  <Bar
                    data={contentSentiment}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          stacked: true,
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          stacked: true,
                          beginAtZero: true,
                          max: 100,
                          ticks: {
                            callback: (value) => value + "%",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
                            },
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color="text.secondary">No data available</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Top Comments */}
        <Grid item xs={12}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#22262B">
                Top 5 Comments with Highest Sentiment
              </Typography>
              {topComments.map((comment, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    py: 2,
                    borderBottom:
                      index < topComments.length - 1
                        ? "1px solid #eee"
                        : "none",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: comment.sentiment_score > 0.5
                          ? "primary.main"
                          : "error.main",
                        mb: 0.5,
                      }}
                    >
                      {comment.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sentiment Score: {(comment.sentiment_score * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {formatNumber(comment.total_likes)} likes
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {formatNumber(comment.total_replies)} replies
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Wordclouds and Trending Hashtags */}
        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Top 10 Positive Keywords
              </Typography>
              <Box sx={{ height: 250 }}>
                <ReactWordcloud
                  words={keywordsData.positive}
                  options={wordcloudOptions}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Top 10 Negative Keywords
              </Typography>
              <Box sx={{ height: 250 }}>
                <ReactWordcloud
                  words={keywordsData.negative}
                  options={wordcloudOptions}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trending Hashtags
              </Typography>
              <List sx={{ height: 250 }}>
                {trendingHashtags.map((hashtag, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      py: 1, 
                      px: 0, 
                      borderBottom: index < trendingHashtags.length - 1 ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Link
                          href="#"
                          color="primary"
                          sx={{ textDecoration: 'none' }}
                        >
                          {hashtag.tag}
                        </Link>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.primary">
                        {hashtag.count}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.main"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {hashtag.growth}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </ChartCard>
        </Grid>

      </Grid>
      
    </Box>
  );
};

export default SentimentDashboard;

// {/* AI Dashboard Summary */}
// {!loading && !error && (
//   <AIDashboardSummary
//     data={{
//       metrics: {
//         totalPosts: overviewData.totalPosts, 
//         positiveCount: overviewData.sentimentDistribution.positive, 
//         negativeCount: overviewData.sentimentDistribution.negative, 
//         neutralCount: 0,
//       },
//       sentimentDistribution: overviewData.sentimentDistribution, 
//       sentimentTrend: timeSeriesData, 
//       topPosts: topComments, 
//       wordCloudData: keywordsData, 
//       selectedBrand: selectedBrand,
//     }}
//     brand={selectedBrand}
//   />
// )}