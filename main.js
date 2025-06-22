// Main JavaScript for Energy Consumption Analyzer

// Global variables
let consumptionChart = null;
let predictionChart = null;
let currentPeriod = 'daily';
let currentData = [];
let predictionData = null;

// DOM elements
const currentUsageEl = document.getElementById('current-usage');
const usageProgressEl = document.getElementById('usage-progress');
const alertsContainer = document.getElementById('alerts-container');
const periodButtons = document.querySelectorAll('.period-btn');
const predictBtn = document.getElementById('predict-btn');
const modelSelector = document.getElementById('model-selector');
const forecastSteps = document.getElementById('forecast-steps');
const forecastValue = document.getElementById('forecast-value');
const statAverage = document.getElementById('stat-average');
const statPeak = document.getElementById('stat-peak');
const statLowest = document.getElementById('stat-lowest');
const predictionResultsCard = document.getElementById('prediction-results-card');
const modelBadge = document.getElementById('model-badge');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
    loadData();
    setupEventListeners();
});

// Initialize charts
function initCharts() {
    // Set up consumption chart
    const consumptionCtx = document.getElementById('consumption-chart').getContext('2d');
    consumptionChart = createConsumptionChart(consumptionCtx);
    
    // Set up prediction chart
    const predictionCtx = document.getElementById('prediction-chart').getContext('2d');
    predictionChart = createPredictionChart(predictionCtx);
}

// Set up event listeners
function setupEventListeners() {
    // Period buttons
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            periodButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current period and reload data
            currentPeriod = this.dataset.period;
            loadData();
            
            // If prediction results are visible, regenerate the prediction
            if (predictionResultsCard.style.display !== 'none') {
                generatePrediction();
            }
        });
    });
    
    // Prediction button
    predictBtn.addEventListener('click', generatePrediction);
    
    // Forecast steps slider
    forecastSteps.addEventListener('input', function() {
        forecastValue.textContent = this.value;
    });
    
    // Model selector change
    modelSelector.addEventListener('change', function() {
        updateModelBadge();
    });
    
    // Reset zoom buttons
    const resetConsumptionZoom = document.getElementById('reset-consumption-zoom');
    if (resetConsumptionZoom) {
        resetConsumptionZoom.addEventListener('click', function() {
            if (consumptionChart && consumptionChart.resetZoom) {
                consumptionChart.resetZoom();
            }
        });
    }
    
    const resetPredictionZoom = document.getElementById('reset-prediction-zoom');
    if (resetPredictionZoom) {
        resetPredictionZoom.addEventListener('click', function() {
            if (predictionChart && predictionChart.resetZoom) {
                predictionChart.resetZoom();
            }
        });
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Load data from the server
function loadData() {
    // Show loading state
    updateChartLoadingState(consumptionChart, true);
    
    fetch(`/api/load_data?period=${currentPeriod}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store the data and update the chart
                currentData = data.data;
                updateConsumptionChart(currentData);
                updateStatistics(currentData);
                updateLatestUsage(); // Update the Latest Usage display
                
                // Update loading state
                updateChartLoadingState(consumptionChart, false);
            } else {
                showAlert('danger', 'Error loading data: ' + data.error);
                updateChartLoadingState(consumptionChart, false);
            }
        })
        .catch(error => {
            console.error('Error loading data:', error);
            showAlert('danger', 'Failed to load data. Please try again.');
            updateChartLoadingState(consumptionChart, false);
        });
}

// Update the consumption chart with new data
function updateConsumptionChart(data) {
    // Prepare data for chart
    const timestamps = data.map(item => new Date(item.timestamp));
    const consumptionValues = data.map(item => item.consumption);
    
    // Update chart data
    consumptionChart.data.labels = timestamps;
    consumptionChart.data.datasets[0].data = consumptionValues;
    
    // Update chart
    consumptionChart.update();
}

// Generate prediction based on selected model
function generatePrediction() {
    // Get selected model and forecast steps
    const model = modelSelector.value;
    const steps = forecastSteps.value;
    
    // Show loading state
    updateChartLoadingState(predictionChart, true);
    predictionResultsCard.style.display = 'block';
    
    // Update model badge
    updateModelBadge();
    
    // Make API request
    fetch('/api/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            period: currentPeriod,
            model: model,
            steps: parseInt(steps)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store prediction data
            predictionData = data.predictions;
            
            // Update prediction chart
            updatePredictionChart(predictionData, currentData);
            
            // Update loading state
            updateChartLoadingState(predictionChart, false);
        } else {
            showAlert('danger', 'Error generating prediction: ' + data.error);
            updateChartLoadingState(predictionChart, false);
        }
    })
    .catch(error => {
        console.error('Error generating prediction:', error);
        showAlert('danger', 'Failed to generate prediction. Please try again.');
        updateChartLoadingState(predictionChart, false);
    });
}

// Update the prediction chart with new data
function updatePredictionChart(predictionData, historicalData) {
    // Prepare historical data
    const historicalTimestamps = historicalData.map(item => new Date(item.timestamp));
    const historicalValues = historicalData.map(item => item.consumption);
    
    // Prepare prediction data
    const predictionTimestamps = predictionData.timestamps.map(ts => new Date(ts));
    const predictionValues = predictionData.values;
    
    // Connect the prediction to the last historical point
    // Make a copy of the arrays
    const lastHistoricalTimestamp = historicalTimestamps[historicalTimestamps.length - 1];
    const lastHistoricalValue = historicalValues[historicalValues.length - 1];
    
    // Add the last historical point as the first prediction point to create a continuous line
    const connectedPredictionTimestamps = [lastHistoricalTimestamp, ...predictionTimestamps];
    const connectedPredictionValues = [lastHistoricalValue, ...predictionValues];
    
    // Update chart data - historical data
    predictionChart.data.labels = [...historicalTimestamps, ...predictionTimestamps];
    predictionChart.data.datasets[0].data = historicalValues.map((value, index) => {
        return {
            x: historicalTimestamps[index],
            y: value
        };
    });
    
    // Update chart data - prediction data (now connected to history)
    predictionChart.data.datasets[1].data = connectedPredictionValues.map((value, index) => {
        return {
            x: connectedPredictionTimestamps[index],
            y: value
        };
    });
    
    // Add confidence intervals if available
    if (predictionData.confidence_intervals && predictionData.confidence_intervals.length > 0) {
        const lowerBounds = predictionData.confidence_intervals.map(ci => ci.lower);
        const upperBounds = predictionData.confidence_intervals.map(ci => ci.upper);
        
        // Connect confidence intervals as well
        const connectedLowerBounds = [lastHistoricalValue, ...lowerBounds];
        const connectedUpperBounds = [lastHistoricalValue, ...upperBounds];
        
        // Update confidence interval dataset
        predictionChart.data.datasets[2].data = connectedLowerBounds.map((lower, index) => {
            return {
                x: connectedPredictionTimestamps[index],
                y: lower
            };
        });
        
        predictionChart.data.datasets[3].data = connectedUpperBounds.map((upper, index) => {
            return {
                x: connectedPredictionTimestamps[index],
                y: upper
            };
        });
        
        // Show confidence interval datasets
        predictionChart.data.datasets[2].hidden = false;
        predictionChart.data.datasets[3].hidden = false;
    } else {
        // Hide confidence interval datasets
        predictionChart.data.datasets[2].hidden = true;
        predictionChart.data.datasets[3].hidden = true;
    }
    
    // Update chart
    predictionChart.update();
}

// Update model badge
function updateModelBadge() {
    const model = modelSelector.value;
    modelBadge.textContent = model === 'arima' ? 'ARIMA' : 'LSTM';
    modelBadge.className = 'badge rounded-pill ' + (model === 'arima' ? 'arima' : 'lstm');
}

// Calculate and update statistics
function updateStatistics(data) {
    if (!data || data.length === 0) return;
    
    // Extract consumption values
    const values = data.map(item => item.consumption);
    
    // Calculate statistics
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const peak = Math.max(...values);
    const lowest = Math.min(...values);
    
    // Update UI
    statAverage.textContent = average.toFixed(2) + ' kWh';
    statPeak.textContent = peak.toFixed(2) + ' kWh';
    statLowest.textContent = lowest.toFixed(2) + ' kWh';
}

// Update the Latest Usage display based on data
function updateLatestUsage() {
    if (!currentData || currentData.length === 0) return;
    
    // Get the latest consumption value
    const latestValue = currentData[currentData.length - 1].consumption;
    
    // Update text
    currentUsageEl.textContent = latestValue.toFixed(2);
    
    // Set color based on consumption level
    if (latestValue > 90) {
        usageProgressEl.className = 'progress-bar bg-danger';
        currentUsageEl.style.color = 'var(--bs-danger)';
    } else if (latestValue > 70) {
        usageProgressEl.className = 'progress-bar bg-warning';
        currentUsageEl.style.color = 'var(--bs-warning)';
    } else {
        usageProgressEl.className = 'progress-bar bg-success';
        currentUsageEl.style.color = 'var(--bs-success)';
    }
}

// Show alert message
function showAlert(level, message) {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${level} alert-dismissible fade show alert-container`;
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to container
    alertsContainer.prepend(alertElement);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertElement.classList.add('fade-out');
        setTimeout(() => {
            if (alertElement.parentNode === alertsContainer) {
                alertsContainer.removeChild(alertElement);
            }
        }, 500);
    }, 5000);
}
