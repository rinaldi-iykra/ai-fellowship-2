import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Card, CardContent, Grid, Paper} from "@mui/material";
import { styled } from "@mui/material/styles";
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
import { Line, Bar } from "react-chartjs-2";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
// import AIDashboardSummary from "../AIDashboardSummary";
import { useBrand } from "../../context/BrandContext";
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

const SocialMediaDashboard = () => {
  // Helper function to format numbers with K, M, B suffixes
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "N/A";
    
    const absNum = Math.abs(Number(num));
    if (absNum >= 1.0e9) {
      return (absNum / 1.0e9).toFixed(2) + "B";
    } else if (absNum >= 1.0e6) {
      return (absNum / 1.0e6).toFixed(2) + "M";
    } else if (absNum >= 1.0e3) {
      return (absNum / 1.0e3).toFixed(2) + "K";
    }
    return absNum.toString();
  };

  const [metrics, setMetrics] = useState({
    totalEngagement: null,
    reach: null,
    impressions: null,
    totalPosts: null
  });
  const [engagementTrend, setEngagementTrend] = useState({
    labels: [],
    datasets: []
  });
  const [reachTrend, setReachTrend] = useState({
    labels: [],
    datasets: []
  });
  const [contentPerformance, setContentPerformance] = useState({
    engagement: {
      labels: [],
      datasets: []
    },
    reach: {
      labels: [],
      datasets: []
    }
  });
  const [platformPerformance, setPlatformPerformance] = useState({
    labels: [],
    datasets: [
      {
        label: 'Engagement',
        data: [],
        backgroundColor: '#0092F4',
        borderColor: '#0092F4',
        borderWidth: 1
      },
      {
        label: 'Reach',
        data: [],
        backgroundColor: '#6256CA ',
        borderColor: '#6256CA ',
        borderWidth: 1
      }
    ]
  });
  const [topPostsByReach, setTopPostsByReach] = useState([]);  
  const [topPostsByEngagement, setTopPostsByEngagement] = useState([]);  
  const [topHashtags, setTopHashtags] = useState({
    byReach: [],
    byEngagement: []
  });
  const [topCollaborators, setTopCollaborators] = useState({
    byReach: [],
    byEngagement: []
  });

  // Dummy data for peak activity
  const [peakActivity] = useState({
      labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
      datasets: [{
        label: "Engagement Level",
        data: [20, 45, 65, 85, 95, 75],
        backgroundColor: "#0D92F4",
        borderColor: "#0D92F4",
        tension: 0.4
      }]
  });

  const { selectedBrand } = useBrand();
  const { getDateRange } = useDate();

  const fetchDataFromEndpoint = useCallback(async (endpoint) => {
    try {
      const { startDate, endDate } = getDateRange();
      const response = await fetch(`${API_BASE_URL}/social-media/${endpoint}?brand=${encodeURIComponent(selectedBrand)}&startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
      throw error;
    }
  }, [selectedBrand, getDateRange]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          metricsData,
          timeSeriesResult,
          contentData,
          platformData,
          postsReachData,
          postsEngagementData,
          hashtagsData,
          collaboratorsData
        ] = await Promise.all([
          fetchDataFromEndpoint("metrics"),
          fetchDataFromEndpoint("timeseries"),
          fetchDataFromEndpoint("content-performance"),
          fetchDataFromEndpoint("platform-performance"),
          fetchDataFromEndpoint("top-posts/reach"),
          fetchDataFromEndpoint("top-posts/engagement"),
          fetchDataFromEndpoint("top-hashtags"),
          fetchDataFromEndpoint("top-collaborators")
        ]);

        setMetrics(metricsData);
        
        // Extract engagement and reach datasets from timeSeriesResult
        const engagementDataset = timeSeriesResult.datasets.find(d => d.label === "Engagement");
        const reachDataset = timeSeriesResult.datasets.find(d => d.label === "Reach");
        
        // Separate engagement and reach trends
        setEngagementTrend({
          labels: timeSeriesResult.labels,
          datasets: [{
            label: "Engagement",
            data: engagementDataset?.data || [],
            borderColor: "#0092F4",
            backgroundColor: "rgba(0, 146, 244, 0.1)",
            tension: 0.4,
            fill: true
          }]
        });
        
        setReachTrend({
          labels: timeSeriesResult.labels,
          datasets: [{
            label: "Reach",
            data: reachDataset?.data || [],
            borderColor: "#262B40",
            backgroundColor: "rgba(51, 64, 146, 0.1)",
            tension: 0.4,
            fill: true
          }]
        });

        setContentPerformance({
          engagement: {
            labels: contentData.engagement.labels,
            datasets: [{
              label: "Engagement Rate",
              data: contentData.engagement.datasets[0].data,
              rate: contentData.engagement.datasets[0].rate,
              backgroundColor: "#0D92F4",
              borderColor: "#0D92F4",
              barThickness: 30
            }]
          },
          reach: {
            labels: contentData.reach.labels,
            datasets: [{
              label: "Reach Rate",
              data: contentData.reach.datasets[0].data,
              rate: contentData.reach.datasets[0].rate,
              backgroundColor: "#262B40",
              borderColor: "#262B40",
              barThickness: 30
            }]
          }
        });
        // Process platform performance data with our color scheme
        setPlatformPerformance({
          labels: platformData.labels,
          datasets: [
            {
              ...platformData.datasets[0],
              backgroundColor: '#6256CA',
              borderColor: '#6256CA',
              borderWidth: 1
            },
            {
              ...platformData.datasets[1],
              backgroundColor: '#262B40',
              borderColor: '#262B40',
              borderWidth: 1
            }
          ]
        });
        setTopPostsByReach(postsReachData);
        setTopPostsByEngagement(postsEngagementData);
        setTopHashtags(hashtagsData);
        setTopCollaborators(collaboratorsData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    if (selectedBrand) {
      fetchAllData();
    }
  }, [selectedBrand, getDateRange, fetchDataFromEndpoint]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          callback: function(value, index) {
            // Convert YYYY-MM-DD to DD/MM format
            const date = new Date(this.getLabelForValue(index));
            return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatNumber(value);
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function(context) {
            // Show full date in tooltip (YYYY-MM-DD)
            return context[0].label;
          },
          label: function(context) {
            return `${context.dataset.label}: ${formatNumber(context.raw)}`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <DashboardTitle variant="h5">
        Social Media Performance Tracking - {selectedBrand}
      </DashboardTitle>

      {/* Overview Metrics */}
      <Grid container spacing={2} sx={{ mb: 2 }}>

        <Grid item xs={12} md={4}>
          <MetricCard>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <VisibilityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Reach</Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {metrics.reach ? formatNumber(parseFloat(metrics.reach)) : "N/A"}
            </Typography>
            <Typography variant="body2">Total Viewers</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <ThumbUpIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Engagement</Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {metrics.totalEngagement ? formatNumber(parseFloat(metrics.totalEngagement)) : "N/A"}
            </Typography>
            <Typography variant="body2">Likes & Comments</Typography>
          </MetricCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
              <CommentIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Total Posts</Typography>
            </Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {metrics.totalPosts ? formatNumber(parseInt(metrics.totalPosts)) : "N/A"}
            </Typography>
            <Typography variant="body2">All Content Types</Typography>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Engagement Trends */}
      <Grid container spacing={2}>

        <Grid item xs={12} md={6}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engagement Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={engagementTrend}
                  options={chartOptions}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reach Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={reachTrend}
                  options={chartOptions}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Platform Statistics
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar
                  data={platformPerformance}

                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y",
                    scales: {
                      x: {
                        stacked: true,
                        ticks: {
                          callback: value => value + "%"
                        }
                      },
                      y: {
                        stacked: true,
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.dataset.label}: ${context.raw}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

          {/* Content Performance */}
          <Grid item xs={12} md={4}>
            <ChartCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance by Content Type
                </Typography>
                <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ height: '48%', mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Engagement Rate
                    </Typography>
                    <Bar
                      data={contentPerformance.engagement}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const dataset = context.dataset;
                                return [
                                  `Posts: ${formatNumber(dataset.data[context.dataIndex])}`,
                                  `Rate: ${dataset.rate[context.dataIndex].toFixed(2)}%`
                                ];
                              }
                            }
                          },
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                            grid: {
                              display: true
                            },
                            title: {
                              display: true,
                              text: 'Number of Posts'
                            }
                          },
                          y: {
                            grid: {
                              display: false
                            }
                          }
                        },
                        layout: {
                          padding: {
                            right: 10
                          }
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ height: '48%' }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Reach Rate
                    </Typography>
                    <Bar
                      data={contentPerformance.reach}
                      options={{
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const dataset = context.dataset;
                                return [
                                  `Posts: ${formatNumber(dataset.data[context.dataIndex])}`,
                                  `Rate: ${dataset.rate[context.dataIndex].toFixed(2)}%`
                                ];
                              }
                            }
                          },
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          x: {
                            beginAtZero: true,
                            grid: {
                              display: true
                            },
                            title: {
                              display: true,
                              text: 'Number of Posts'
                            }
                          },
                          y: {
                            grid: {
                              display: false
                            }
                          }
                        },
                        layout: {
                          padding: {
                            right: 10
                          }
                        }
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </ChartCard>
          </Grid>

          {/* Peak Activity Times */}
          <Grid item xs={12} md={5}>
            <ChartCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Engagement by Posting Time
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={peakActivity}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: ${formatNumber(context.raw)}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: {
                            display: true
                          },
                          ticks: {
                            callback: function(value, index) {
                              const times = ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'];
                              return times[index] || '';
                            }
                          }
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            display: true
                          },
                          ticks: {
                            callback: function(value) {
                              return formatNumber(value);
                            }
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </ChartCard>
          </Grid>

        {/* Top Posts by Reach */}
        <Grid item xs={12} md={6}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#22262B">
                Top 5 Posts by Reach
              </Typography>
              <Box>
                {Array.isArray(topPostsByReach) && topPostsByReach.map((post, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: index < topPostsByReach.length - 1 ? "1px solid #eee" : "none"
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                    {post.platform} • {post.type}
                  </Typography>
                      <Typography variant="body2">
                        {post.caption}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {post.timestamp ? new Date(post.timestamp).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        }) : "N/A"}
                      </Typography>
                      <Typography variant="caption" color="primary.light" display="block">
                        {post.collabs} • {post.hashtags}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
                      {post.reach ? formatNumber(post.reach) : "N/A"} Reach
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Top Posts by Engagement */}
        <Grid item xs={12} md={6}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom color="#22262B">
                Top 5 Posts by Engagement
              </Typography>
              <Box>
                {Array.isArray(topPostsByEngagement) && topPostsByEngagement.map((post, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: index < topPostsByEngagement.length - 1 ? "1px solid #eee" : "none"
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {post.platform} • {post.type}
                      </Typography>
                      <Typography variant="body2">
                        {post.caption}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {post.timestamp ? new Date(post.timestamp).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        }) : "N/A"}
                      </Typography>
                      <Typography variant="caption" color="primary.light" display="block">
                        {post.collabs} • {post.hashtags}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="primary" sx={{ ml: 2 }}>
                      {post.engagement ? formatNumber(post.engagement) : "N/A"} Engagement
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Top Hashtags and Collaborators Section */}
        <Grid item xs={12}>
        <Grid container spacing={2}>
          {/* Top Hashtags by Reach */}
            <Grid item xs={12} md={3}>
            <ChartCard>
              <CardContent>
                <Typography variant="h6" gutterBottom color="#22262B">
                  Top Hashtags by Reach
                </Typography>
                <Box>
                  {topHashtags.byReach.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom: index < topHashtags.byReach.length - 1 ? "1px solid #eee" : "none"
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="primary">
                          {item.tag}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.count} posts
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {formatNumber(item.reach)}
                      </Typography>
                    </Box>
                  ))}
                  {(!Array.isArray(topHashtags.byReach) || topHashtags.byReach.length === 0) && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No hashtag data available
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </ChartCard>
          </Grid>

          {/* Top Hashtags by Engagement */}
            <Grid item xs={12} md={3}>
            <ChartCard>
              <CardContent>
                <Typography variant="h6" gutterBottom color="#22262B">
                  Top Hashtags by Engagement
                </Typography>
                <Box>
                  {topHashtags.byEngagement.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom: index < topHashtags.byEngagement.length - 1 ? "1px solid #eee" : "none"
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="primary">
                          {item.tag}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.count} posts
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {formatNumber(item.engagement)}
                      </Typography>
                    </Box>
                  ))}
                  {(!Array.isArray(topHashtags.byEngagement) || topHashtags.byEngagement.length === 0) && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No hashtag data available
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </ChartCard>
          </Grid>

          {/* Top Collaborators by Reach */}
            <Grid item xs={12} md={3}>
            <ChartCard>
              <CardContent>
                <Typography variant="h6" gutterBottom color="#22262B">
                  Top Collaborators by Reach
                </Typography>
                <Box>
                  {topCollaborators.byReach.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom: index < topCollaborators.byReach.length - 1 ? "1px solid #eee" : "none"
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="primary">
                          {item.tag}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.posts} posts
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {formatNumber(item.reach)}
                      </Typography>
                    </Box>
                  ))}
                  {(!Array.isArray(topCollaborators.byReach) || topCollaborators.byReach.length === 0) && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No collaborator data available
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </ChartCard>
          </Grid>

          {/* Top Collaborators by Engagement */}
            <Grid item xs={12} md={3}>
            <ChartCard>
              <CardContent>
                <Typography variant="h6" gutterBottom color="#22262B">
                  Top Collaborators by Engagement
                </Typography>
                <Box>
                  {topCollaborators.byEngagement.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 1,
                        borderBottom: index < topCollaborators.byEngagement.length - 1 ? "1px solid #eee" : "none"
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="primary">
                          {item.tag}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.posts} posts
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {formatNumber(item.engagement)}
                      </Typography>
                    </Box>
                  ))}
                  {(!Array.isArray(topCollaborators.byEngagement) || topCollaborators.byEngagement.length === 0) && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No collaborator data available
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </ChartCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </Box>
  );
};

export default SocialMediaDashboard;

      // {/* AI Summary Section */}
      // {!loading && !error && (
      //   <AIDashboardSummary
      //     dashboardType="social"
      //     data={{
      //       metrics,
      //       timeSeriesData,
      //       contentPerformance,
      //       platformPerformance,
      //       selectedBrand: selectedBrand
      //     }}
      //     brand={selectedBrand}
      //   />
      // )}