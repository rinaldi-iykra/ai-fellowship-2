import React, { useState, useEffect, useCallback } from "react";
import { useBrand } from '../../context/BrandContext';
import { useDate } from "../../context/DateContext";
import { Box, Typography, Card, CardContent, Grid, Paper, InputLabel, FormControl, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  ScatterController,
  LineElement,
  LineController
} from "chart.js";
import { Bar, Pie, Scatter, Line } from "react-chartjs-2";
import "chart.js/auto";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Rating from '@mui/material/Rating';

// import AIDashboardSummary from "../AIDashboardSummary";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';


ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  ScatterController,
  LineElement,
  LineController
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

const CustomerFeedbackDashboard = () => {
  const { selectedBrand } = useBrand();
  const { getDateRange } = useDate();
  // Filter states
  const [filterCategory, setFilterCategory] = useState("Jenis Bahan");
  const [selectedProduct, setSelectedProduct] = useState("");

  // Data states
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    positiveCount: 0,
    negativeCount: 0,
  });
  const [products, setProducts] = useState([]);
  const [sentimentData, setSentimentData] = useState({
    labels: ["Positive", "Negative"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#0092F4", "#262B40"],
      },
    ],
  });
  const [aspectSentimentData, setAspectSentimentData] = useState({
    labels: [],
    datasets: [],
  });
  const [productSentimentData, setProductSentimentData] = useState({});
  const [categoryDataFilter, setCategoryDataFilter] = useState({});
  const [emotionIntensity, setEmotionIntensity] = useState({
    veryLow: 0,
    low: 0,
    moderate: 0,
    high: 0,
    veryHigh: 0
  });
  const [topTopics, setTopTopics] = useState([]);
  const [ratingCorrelation, setRatingCorrelation] = useState([]);
  const [helpfulReviews, setHelpfulReviews] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // Default chart data structure
  const defaultChartData = {
    labels: [],
    datasets: [
      {
        label: "Positive",
        data: [],
        backgroundColor: "#0092F4",
      },
      {
        label: "Negative",
        data: [],
        backgroundColor: "#262B40",
      },
    ],
  };

  // Helper function to get chart data safely
  const getChartData = (category, aspect) => {
    if (!categoryDataFilter[category] || !categoryDataFilter[category][aspect]) {
      return defaultChartData;
    }
    return categoryDataFilter[category][aspect];
  };

  // Filter options
  const filterCategories = [
    "Jenis Bahan",
    "Material Sol",
    "Asal Produk",
    "Target Gender",
  ];

  const fetchDataFromEndpoint = useCallback(async (endpoint) => {
    try {
      const { startDate, endDate } = getDateRange();
      const response = await fetch(`${API_BASE_URL}/product-reviews/${endpoint}?brand=${encodeURIComponent(selectedBrand)}&startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint} data:`, error);
      throw error;
    }
  }, [selectedBrand, getDateRange]);

  const fetchEmotionIntensity = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBrand) params.append('brand', selectedBrand);
      const { startDate, endDate } = getDateRange();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/product-reviews/emotion-intensity?${params}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEmotionIntensity(data);
    } catch (error) {
      console.error('Error fetching emotion intensity:', error);
    }
  }, [selectedBrand, getDateRange]);

  const fetchTopTopics = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBrand) params.append('brand', selectedBrand);
      const { startDate, endDate } = getDateRange();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/product-reviews/top-topics?${params}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTopTopics(data);
    } catch (error) {
      console.error('Error fetching top topics:', error);
    }
  }, [selectedBrand, getDateRange]);

  const fetchRatingCorrelation = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBrand) params.append('brand', selectedBrand);
      const { startDate, endDate } = getDateRange();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/product-reviews/rating-sentiment-correlation?${params}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRatingCorrelation(data);
    } catch (error) {
      console.error('Error fetching rating correlation:', error);
    }
  }, [selectedBrand, getDateRange]);

  const fetchHelpfulReviews = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBrand) params.append('brand', selectedBrand);
      const { startDate, endDate } = getDateRange();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/product-reviews/helpful-reviews?${params}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setHelpfulReviews(data);
    } catch (error) {
      console.error('Error fetching helpful reviews:', error);
    }
  }, [selectedBrand, getDateRange]);

  const fetchTrendData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBrand) params.append('brand', selectedBrand);
      const { startDate, endDate } = getDateRange();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`${API_BASE_URL}/product-reviews/trend?${params}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTrendData(data);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    }
  }, [selectedBrand, getDateRange]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          metricsData,
          sentimentDistData,
          aspectData,
          productsData,
        ] = await Promise.all([
          fetchDataFromEndpoint('metrics'),
          fetchDataFromEndpoint('sentiment-distribution'),
          fetchDataFromEndpoint('aspect-sentiment'),
          fetchDataFromEndpoint('products'),
        ]);

        setStats(metricsData);
        setSentimentData(sentimentDistData); // Backend already returns the correct format
        setAspectSentimentData(aspectData); // Backend already returns the correct format
        setProducts(productsData);
        
        if (productsData.length > 0) {
          setSelectedProduct(productsData[0].product_id); // Set only the product_id
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchAllData();
  }, [selectedBrand, getDateRange, fetchDataFromEndpoint]); // Re-fetch when selected brand or date range changes

  // Fetch product-specific sentiment when product selection changes
  useEffect(() => {
    const fetchProductSentiment = async () => {
      if (selectedProduct) {
        try {
          const { startDate, endDate } = getDateRange();
          const response = await fetch(
            `${API_BASE_URL}/product-reviews/products-review-sentiment/${selectedProduct}?brand=${encodeURIComponent(selectedBrand)}&startDate=${startDate}&endDate=${endDate}`
          );
          const data = await response.json();
          setProductSentimentData({
            [selectedProduct]: {
              comfort: {
                positive: data.comfort.positive,
                negative: data.comfort.negative,
              },
              quality: {
                positive: data.quality.positive,
                negative: data.quality.negative,
              },
              durability: {
                positive: data.durability.positive,
                negative: data.durability.negative,
              },
              design: {
                positive: data.design.positive,
                negative: data.design.negative,
              },
            },
          });
        } catch (err) {
        }
      }
    };
    fetchProductSentiment();
  }, [selectedProduct, selectedBrand, getDateRange]);

  // Fetch category-based sentiment data when filter category changes
  useEffect(() => {
    const fetchCategorySentiment = async () => {
      try {
        let endpoint = "";
        switch (filterCategory) {
          case "Jenis Bahan":
            endpoint = "review-sentiment-by-upper-material";
            break;
          case "Material Sol":
            endpoint = "review-sentiment-by-sole-material";
            break;
          case "Asal Produk":
            endpoint = "review-sentiment-by-origin";
            break;
          case "Target Gender":
            endpoint = "review-sentiment-by-gender";
            break;
          default:
            break;
        }

        const { startDate, endDate } = getDateRange();
        const response = await fetch(
          `${API_BASE_URL}/product-reviews/${endpoint}?brand=${encodeURIComponent(selectedBrand)}&startDate=${startDate}&endDate=${endDate}`
        );
        const data = await response.json();

        // Transform the data to match chart format
        const transformData = (aspectData) => {
          if (!aspectData) return null;
          
          const categories = Object.keys(aspectData);
          const positiveData = categories.map(cat => aspectData[cat].positive);
          const negativeData = categories.map(cat => aspectData[cat].negative);
          
          return {
            labels: categories,
            datasets: [
              {
                label: "Positive",
                data: positiveData,
                backgroundColor: "#0092F4",
              },
              {
                label: "Negative",
                data: negativeData,
                backgroundColor: "#262B40",
              },
            ],
          };
        };

        // Create chart data for each aspect
        const chartData = {};
        for (const [aspect, sentiments] of Object.entries(data)) {
          const transformedData = transformData(sentiments);
          if (transformedData) {
            switch (aspect) {
              case 'Kenyamanan':
                chartData.comfort = transformedData;
                break;
              case 'Kualitas':
                chartData.quality = transformedData;
                break;
              case 'Durabilitas':
                chartData.durability = transformedData;
                break;
              case 'Desain':
                chartData.design = transformedData;
                break;
              default:
                break;
            }
          }
        }

        setCategoryDataFilter(prevState => ({
          ...prevState,
          [filterCategory]: chartData
        }));
      } catch (err) {
      }
    };
    fetchCategorySentiment();
  }, [filterCategory, selectedBrand, getDateRange]);

  useEffect(() => {
    fetchEmotionIntensity();
    fetchTopTopics();
    fetchRatingCorrelation();
    fetchHelpfulReviews();
    fetchTrendData();
  }, [selectedBrand, getDateRange, fetchEmotionIntensity, fetchTopTopics, fetchRatingCorrelation, fetchHelpfulReviews, fetchTrendData]);


  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <DashboardTitle variant="h5">
        Product Reviews SentimentDashboard - {selectedBrand}
      </DashboardTitle>

      {/* Overview Stats */}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}>
          <MetricCard elevation={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <RateReviewIcon sx={{ mr: 1 }} />
              <Typography variant="body1">Average Rating</Typography>
            </Box>

            <Typography variant="h5">
              {stats.averageRating} <span style={{ fontSize: '1rem' }}>/5</span>
            </Typography>
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard elevation={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <CommentIcon sx={{ mr: 1 }} />

              <Typography variant="body1">Total Reviews</Typography>
            </Box>

            <Typography variant="h5">{stats.totalReviews}</Typography>
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard elevation={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <ThumbUpIcon sx={{ mr: 1 }} />

              <Typography variant="body1">Positive Reviews</Typography>
            </Box>

            <Typography variant="h5">{stats.positiveCount}</Typography>
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard elevation={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <ThumbDownIcon sx={{ mr: 1 }} />

              <Typography variant="body1">Negative Reviews</Typography>
            </Box>

            <Typography variant="h5">{stats.negativeCount}</Typography>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Sentiment and Rating Trend */}
      <Grid item xs={12}>
        <ChartCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sentiment and Rating Trend
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={{
                  labels: trendData.map(item => item.date),
                  datasets: [
                    {
                      label: 'Average Rating',
                      data: trendData.map(item => item.averageRating),
                      borderColor: '#0092F4',
                      backgroundColor: 'rgba(0, 146, 244, 0.1)',
                      yAxisID: 'rating',
                      tension: 0.4
                    },
                    {
                      label: 'Sentiment Score',
                      data: trendData.map(item => item.averageSentiment),
                      borderColor: '#262B40',
                      backgroundColor: 'rgba(98, 86, 202, 0.1)',
                      yAxisID: 'sentiment',
                      tension: 0.4
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    mode: 'index',
                    intersect: false,
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Date'
                      }
                    },
                    rating: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Average Rating'
                      },
                      min: 0,
                      max: 5,
                      grid: {
                        drawOnChartArea: false
                      }
                    },
                    sentiment: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Sentiment Score'
                      },
                      min: 0,
                      max: 1,
                      grid: {
                        drawOnChartArea: false
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.dataset.label;
                          const value = context.raw.toFixed(2);
                          const count = trendData[context.dataIndex].reviewCount;
                          return `${label}: ${value} (${count} reviews)`;
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

      <Grid container spacing={2}>
        {/* Sentiment Distribution */}

        <Grid item xs={12} md={3}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribusi Sentimen
              </Typography>

              <Box
                sx={{
                  height: 250,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pie
                  data={sentimentData}
                  options={{
                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Volume Feedback per Kategori */}

        <Grid item xs={12} md={5}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Review Emotion Intensity
              </Typography>
              <Box sx={{ height: 250 }}>
                <Bar
                  data={{
                    labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
                    datasets: [
                      {
                        label: 'Percentage of Reviews',
                        data: [
                          emotionIntensity.veryLow,
                          emotionIntensity.low,
                          emotionIntensity.moderate,
                          emotionIntensity.high,
                          emotionIntensity.veryHigh
                        ],
                        backgroundColor: [
                          '#87C2FF', // very low - light blue
                          '#77CDFF', // low - light blue
                          '#0092F4', // moderate - bright blue
                          '#334092', // high - medium blue
                          '#024CAA'  // very high - dark blue
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: Math.max(
                          emotionIntensity.veryLow,
                          emotionIntensity.low,
                          emotionIntensity.moderate,
                          emotionIntensity.high,
                          emotionIntensity.veryHigh,
                          0
                        ) + 10,
                        title: {
                          display: true,
                          text: 'Percentage of Reviews'
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.raw}% of reviews`;
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

        {/* Aspect Sentiment */}

        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Sentimen per Aspek
              </Typography>

              <Box sx={{ height: 250 }}>
                <Bar
                  data={aspectSentimentData}
                  options={{
                    responsive: true,

                    maintainAspectRatio: false,

                    scales: {
                      x: {
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

        {/* Product Sentiment Analysis */}

        <Grid item xs={12} md={3}>
          <ChartCard>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Sentimen Produk per Aspek
                </Typography>

                <FormControl id="product-select" fullWidth size="small" >
                  <InputLabel id="product-select-label">Pilih Produk</InputLabel>

                  <Select
                    id="product-select-dropdown"
                    value={selectedProduct}
                    label="Pilih Produk"
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    {products &&
                      products.map((product) => (
                        <MenuItem
                          key={product.product_id}
                          value={product.product_id}
                        >
                          {product.product_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              <Grid container spacing={2}>
                {["comfort", "quality", "durability", "design"].map(
                  (aspect) => (
                    <Grid item xs={12} key={aspect}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          align="center"
                        >
                          <b>
                            {aspect === "comfort"
                              ? "Kenyamanan"
                              : aspect === "quality"
                              ? "Kualitas"
                              : aspect === "durability"
                              ? "Durabilitas"
                              : "Desain"}
                          </b>
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2" color="success.main">
                              Positive
                            </Typography>

                            <Typography variant="body1" color="success.main">
                              {productSentimentData[selectedProduct] &&
                                productSentimentData[selectedProduct][aspect]
                                  .positive}
                              %
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2" color="error.main">
                              Negative
                            </Typography>

                            <Typography variant="body1" color="error.main">
                              {productSentimentData[selectedProduct] &&
                                productSentimentData[selectedProduct][aspect]
                                  .negative}
                              %
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              width: "100%",
                              height: 4,
                              bgcolor: "#eee",
                              mt: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: `${
                                  productSentimentData[selectedProduct] &&
                                  productSentimentData[selectedProduct][aspect]
                                    .positive
                                }%`,

                                height: "100%",

                                bgcolor: "#0092F4",
                              }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  )
                )}
              </Grid>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Aspect Sentiment Analysis with Filters */}

        <Grid item xs={9}>
          <ChartCard>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Analisis Sentimen berdasarkan Kategori
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl id="category-select" fullWidth size="small" >
                      <InputLabel id="category-select-label">Kategori</InputLabel>

                      <Select
                        id="category-select-dropdown"
                        value={filterCategory}
                        label="Kategori"
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        {filterCategories.map((category) => (
                          <MenuItem
                            key={category}
                            value={category}
                          >
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom align="center">
                    <b>Sentimen Kenyamanan</b>
                  </Typography>

                  <Box sx={{ height: 300 }}>
                    <Bar
                      data={getChartData(filterCategory, 'comfort')}
                      options={{
                        responsive: true,

                        maintainAspectRatio: false,

                        indexAxis: "y",

                        scales: {
                          x: {
                            stacked: true,

                            beginAtZero: true,

                            max: 100,

                            ticks: {
                              callback: (value) => value + "%",
                            },
                          },

                          y: {
                            stacked: true,
                          },
                        },

                        plugins: {
                          legend: {
                            display: false,
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom align="center">
                    <b>Sentimen Kualitas</b>
                  </Typography>

                  <Box sx={{ height: 300 }}>
                    <Bar
                      data={getChartData(filterCategory, 'quality')}
                      options={{
                        responsive: true,

                        maintainAspectRatio: false,

                        indexAxis: "y",

                        scales: {
                          x: {
                            stacked: true,

                            beginAtZero: true,

                            max: 100,

                            ticks: {
                              callback: (value) => value + "%",
                            },
                          },

                          y: {
                            stacked: true,
                          },
                        },

                        plugins: {
                          legend: {
                            display: false,
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom align="center">
                    <b>Sentimen Durabilitas</b>
                  </Typography>

                  <Box sx={{ height: 300 }}>
                    <Bar
                      data={getChartData(filterCategory, 'durability')}
                      options={{
                        responsive: true,

                        maintainAspectRatio: false,

                        indexAxis: "y",

                        scales: {
                          x: {
                            stacked: true,

                            beginAtZero: true,

                            max: 100,

                            ticks: {
                              callback: (value) => value + "%",
                            },
                          },

                          y: {
                            stacked: true,
                          },
                        },

                        plugins: {
                          legend: {
                            display: false,
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom align="center">
                    <b>Sentimen Desain</b>
                  </Typography>

                  <Box sx={{ height: 300 }}>
                    <Bar
                      data={getChartData(filterCategory, 'design')}
                      options={{
                        responsive: true,

                        maintainAspectRatio: false,

                        indexAxis: "y",

                        scales: {
                          x: {
                            stacked: true,

                            beginAtZero: true,

                            max: 100,

                            ticks: {
                              callback: (value) => value + "%",
                            },
                          },

                          y: {
                            stacked: true,
                          },
                        },

                        plugins: {
                          legend: {
                            display: false,
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
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ width: 16, height: 16, bgcolor: "#0092F4", mr: 1 }}
                    />

                    <Typography variant="body2">Positive</Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{ width: 16, height: 16, bgcolor: "#262B40", mr: 1 }}
                    />

                    <Typography variant="body2">Negative</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Rating vs Sentiment Correlation */}
        <Grid item xs={12} md={5}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rating vs Sentiment Correlation
              </Typography>
              <Box sx={{ height: 300 }}>
                <Scatter
                  data={{
                    datasets: [{
                      label: 'Reviews',
                      data: ratingCorrelation.map(item => ({
                        x: item.rating,
                        y: item.averageSentiment,
                        r: Math.sqrt(item.reviewCount) * 5 // Size based on review count
                      })),
                      backgroundColor: 'rgba(33, 150, 243, 0.6)',
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Rating'
                        },
                        min: 0,
                        max: 5
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Average Sentiment Score'
                        },
                        min: 0,
                        max: 1
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const data = context.raw;
                            return [
                              `Rating: ${data.x}`,
                              `Sentiment: ${data.y.toFixed(2)}`,
                              `Reviews: ${ratingCorrelation[context.dataIndex].reviewCount}`
                            ];
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

        {/* Top review topics */}
        <Grid item xs={12} md={3}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Review Topics
              </Typography>
              <Box>
                {topTopics.map((topic, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1.5,
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          backgroundColor: index < 3 ? 'primary.main' : 'grey.300',
                          color: index < 3 ? 'white' : 'text.secondary',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          mr: 2
                        }}
                      >
                        {index + 1}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.primary' }}>
                        {topic.topic}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 4,
                          fontWeight: 500
                        }}
                      >
                        {topic.count} reviews
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>

        {/* Most Helpful Reviews */}
        <Grid item xs={12} md={4}>
          <ChartCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Helpful Reviews
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {helpfulReviews.map((review, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" color="primary">
                        {review.productName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({review.helpfulVotes} helpful votes)
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      color: review.sentimentScore >= 0.5 ? 'success.main' : 'error.main',
                      mb: 1 
                    }}>
                      Sentiment: {(review.sentimentScore * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {review.review}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </ChartCard>
        </Grid>
      </Grid>

    </Box>
  );
};

export default CustomerFeedbackDashboard;