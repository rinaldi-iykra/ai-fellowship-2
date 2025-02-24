# Shoe Brand Sentiment Analysis Backend

This is the FastAPI backend for the Shoe Brand Sentiment Analysis dashboard.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure the PostgreSQL database is sset up and running (see ../db/README.md)

3. Run the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API documentation: `http://localhost:8000/docs`
- Alternative API documentation: `http://localhost:8000/redoc`

## Available Endpoints

### Products
- GET `/products` - List all products with optional filtering
- GET `/products/{product_id}` - Get detailed product information

### Sentiment Analysis
- GET `/sentiment/brand/{brand}` - Get brand sentiment analysis
- GET `/sentiment/product/{product_id}` - Get product sentiment analysis

### Campaigns
- GET `/campaigns` - List all marketing campaigns
- GET `/campaigns/{campaign_id}` - Get detailed campaign information

### Analytics
- GET `/analytics/brand-comparison` - Compare sentiment across brands
- GET `/analytics/trending-products` - Get trending products

## Features

- RESTful API endpoints for accessing sentiment analysis data
- SQLAlchemy ORM for database interactions
- Pydantic models for request/response validation
- CORS middleware for frontend integration
- Automatic API documentation with Swagger UI
- Type hints and modern Python practices

## Project Structure

- `main.py` - FastAPI application and route definitions
- `database.py` - Database connection and session management
- `models.py` - SQLAlchemy ORM models
- `schemas.py` - Pydantic models for API
- `requirements.txt` - Project dependencies
#   i y k r a _ s e n t i m e n t _ b a c k e n d  
 