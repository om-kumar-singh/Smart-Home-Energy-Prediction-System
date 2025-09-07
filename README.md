# Smart Home Energy Predictor

A web-based energy consumption visualization and prediction tool that helps homeowners understand, analyze, and forecast their energy usage patterns using machine learning models.

![Energy Dashboard](https://img.shields.io/badge/Status-Active-green) ![Python](https://img.shields.io/badge/Python-3.11-blue) ![Flask](https://img.shields.io/badge/Flask-2.3.0-orange) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

## 🎯 Overview

The SmartHome Energy Predictor combines interactive data visualization with advanced time series forecasting to provide homeowners with insights into their energy consumption patterns. The application features dual prediction models (ARIMA and LSTM) and responsive design with both light and dark themes.

### Key Features

- **📊 Interactive Visualizations**: Explore energy consumption data with zoomable charts across daily, weekly, and monthly periods
- **🔮 Dual Prediction Models**: Choose between ARIMA (statistical) and LSTM (neural network) models for different forecasting scenarios
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **🌙 Theme Switching**: Toggle between light and dark modes for comfortable viewing
- **📈 Performance Metrics**: View prediction accuracy with MAE, RMSE, and R² metrics
- **🎛️ Interactive Controls**: Adjust forecast horizons and compare model performance
- **📊 Confidence Intervals**: Understand prediction uncertainty with visual confidence bands



## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Model Documentation](#model-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Python 3.11 or higher
- pip (Python package installer)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smarthome-energy-predictor.git
   cd smarthome-energy-predictor
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python main.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

### Dependencies

```
flask>=2.3.0
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
statsmodels>=0.14.0
tensorflow>=2.13.0
gunicorn>=21.0.0
```

## 🎮 Usage

### Basic Navigation

1. **View Historical Data**: The main chart displays your energy consumption patterns
2. **Switch Time Periods**: Use the Daily/Weekly/Monthly buttons to change the view
3. **Generate Predictions**: 
   - Select a prediction model (ARIMA or LSTM)
   - Adjust the forecast horizon (5-30 steps)
   - Click "Generate Prediction"
4. **Explore Charts**: Use mouse wheel or pinch gestures to zoom, and reset zoom buttons to return to full view
5. **Toggle Theme**: Switch between light and dark modes using the theme toggle button

### Model Selection Guide

- **ARIMA Model**: Best for short-term forecasts (5-10 hours) with regular patterns
- **LSTM Model**: Optimal for medium to long-term forecasts (10+ hours) with complex dependencies

### Data Format

The application expects CSV data with the following structure:
```csv
timestamp,consumption,unit
2025-01-01 00:00:00,1.23,kWh
2025-01-01 01:00:00,0.98,kWh
```

## 📁 Project Structure

```
smarthome-energy-predictor/
├── main.py                     # Application entry point
├── app.py                      # Flask application and routes
├── models.py                   # Data models
├── requirements.txt            # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css          # Application styling
│   ├── js/
│   │   ├── main.js            # Frontend logic
│   │   ├── chart-utils.js     # Chart configuration
│   │   └── theme-switcher.js  # Theme management
│   └── data/
│       └── sample_energy_data.csv  # Sample dataset
├── templates/
│   └── index.html             # Main UI template
└── utils/
    ├── data_processor.py      # Data processing utilities
    └── prediction_models.py   # ARIMA and LSTM implementations
```

## 🔌 API Endpoints

### Load Data
```http
GET /api/load_data?period=daily
```
**Parameters:**
- `period`: `daily`, `weekly`, or `monthly`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-01-01 00:00:00",
      "consumption": 1.23,
      "unit": "kWh"
    }
  ]
}
```

### Generate Predictions
```http
POST /api/predict
Content-Type: application/json

{
  "period": "daily",
  "model": "arima",
  "steps": 10
}
```

**Response:**
```json
{
  "success": true,
  "predictions": {
    "timestamps": ["2025-01-02 00:00:00", ...],
    "values": [1.45, 1.32, ...],
    "confidence_intervals": [
      {"lower": 1.20, "upper": 1.70},
      ...
    ],
    "model_type": "ARIMA"
  }
}
```

## 🧠 Model Documentation

### ARIMA Model

**Parameters:**
- Auto-selected using AIC criterion
- Range: p(0-5), d(0-1), q(0-5)
- 95% confidence intervals

**Best for:**
- Short-term forecasts (5-10 steps)
- Regular, cyclical patterns
- Lower computational requirements

### LSTM Model

**Architecture:**
- 50 LSTM units with ReLU activation
- Dropout: 0.2 (regular and recurrent)
- Input sequence: 24 time steps
- Adam optimizer, MSE loss

**Best for:**
- Medium to long-term forecasts (10+ steps)
- Complex, non-linear patterns
- Learning long-term dependencies

## 🔧 Configuration

### Environment Variables

```bash
# Optional: Set debug mode
FLASK_DEBUG=true

# Optional: Set custom port
PORT=5000
```

### Customizing Data Source

Replace the sample data in `static/data/sample_energy_data.csv` with your own energy consumption data following the same CSV format.

## 🎨 Customization

### Adding New Themes

1. Add theme-specific CSS in `static/css/style.css`
2. Update theme switching logic in `static/js/theme-switcher.js`

### Extending Prediction Models

1. Implement new model in `utils/prediction_models.py`
2. Add model selection option in the frontend
3. Update API endpoint to handle new model type

## 📊 Performance Metrics

The application provides three key metrics for evaluating prediction accuracy:

- **MAE (Mean Absolute Error)**: Average magnitude of prediction errors
- **RMSE (Root Mean Squared Error)**: Emphasizes larger prediction errors
- **R² (R-squared)**: Proportion of variance explained by the model

## 🚀 Deployment

### Using Gunicorn (Production)

```bash
gunicorn --bind 0.0.0.0:5000 --workers 4 main:app
```

### Using Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]
```

### Environment Setup

For production deployment, ensure you have:
- Sufficient memory for LSTM model training
- HTTPS enabled for secure data transmission
- Proper error logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guidelines for Python code
- Use meaningful variable and function names
- Add docstrings for new functions and classes
- Include tests for new features
- Update documentation for any API changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Flask](https://flask.palletsprojects.com/) web framework
- Visualization powered by [Chart.js](https://www.chartjs.org/)
- Time series analysis using [statsmodels](https://www.statsmodels.org/)
- Neural networks implemented with [TensorFlow](https://www.tensorflow.org/)
- UI components from [Bootstrap](https://getbootstrap.com/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/smarthome-energy-predictor/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🔄 Changelog

### v1.0.0 (2025-01-01)
- Initial release
- ARIMA and LSTM prediction models
- Interactive data visualization
- Responsive design with theme switching
- RESTful API endpoints

---

**Built with ❤️ for energy-conscious homeowners**
