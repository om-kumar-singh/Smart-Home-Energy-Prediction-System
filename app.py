import os
import logging
from flask import Flask, render_template, request, jsonify
from utils.data_processor import DataProcessor
from utils.prediction_models import PredictionModels

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key")

# Initialize data processor and prediction models
data_processor = DataProcessor()
prediction_models = PredictionModels()

@app.route('/')
def index():
    """Render the main page of the application."""
    return render_template('index.html')

@app.route('/api/load_data', methods=['GET'])
def load_data():
    """API endpoint to load and process energy consumption data."""
    try:
        # Default to daily view
        period = request.args.get('period', 'daily')
        
        # Load and process data
        data = data_processor.load_data(period)
        return jsonify({"success": True, "data": data})
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """API endpoint to generate energy consumption predictions."""
    try:
        # Get request parameters
        data = request.get_json()
        time_period = data.get('period', 'daily')
        model_type = data.get('model', 'arima')
        forecast_steps = data.get('steps', 10)
        
        # Get historical data
        historical_data = data_processor.load_data(time_period)
        
        # Generate predictions
        if model_type == 'arima':
            predictions = prediction_models.arima_predict(historical_data, forecast_steps)
        else:
            predictions = prediction_models.lstm_predict(historical_data, forecast_steps)
            
        return jsonify({
            "success": True, 
            "predictions": predictions,
            "model": model_type
        })
    except Exception as e:
        logger.error(f"Error generating predictions: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
