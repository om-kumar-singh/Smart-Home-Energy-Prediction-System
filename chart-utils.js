// Chart utility functions for Energy Consumption Analyzer

// Create consumption chart
function createConsumptionChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Energy Consumption (kWh)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                tension: 0.2,
                fill: true,
                pointRadius: 2,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000
            },
            plugins: {
                title: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Consumption: ${context.parsed.y.toFixed(2)} kWh`;
                        }
                    },
                    // Theme handling will be done by theme-switcher.js
                    borderWidth: 1
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                        speed: 100
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'HH:mm',
                            day: 'MMM d',
                            week: 'MMM d',
                            month: 'MMM yyyy'
                        },
                        tooltipFormat: 'MMM d, yyyy HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Time',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        // This will adapt to the theme
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy Consumption (kWh)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        // This will adapt to the theme
                    },
                    ticks: {
                        // This will adapt to the theme
                    }
                }
            }
        }
    });
}

// Create prediction chart
function createPredictionChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Historical Data',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 2,
                    pointHoverRadius: 6
                },
                {
                    label: 'Prediction',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 3,
                    borderDash: [6, 6],
                    tension: 0.4,
                    fill: false,
                    pointRadius: 2,
                    pointHoverRadius: 6
                },
                {
                    label: 'Lower Bound',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 0.3)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 1,
                    tension: 0.4,
                    fill: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0
                },
                {
                    label: 'Upper Bound',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 0.3)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 1,
                    tension: 0.4,
                    fill: 2,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1200
            },
            plugins: {
                title: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const datasetLabel = context.dataset.label;
                            const value = context.parsed.y.toFixed(2);
                            return `${datasetLabel}: ${value} kWh`;
                        }
                    },
                    // Theme handling will be done by theme-switcher.js
                    borderWidth: 1
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        font: {
                            weight: 'bold'
                        },
                        filter: function(item) {
                            return !item.text.includes('Bound');
                        }
                    }
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'x'
                    },
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                        speed: 100
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            hour: 'HH:mm',
                            day: 'MMM d',
                            week: 'MMM d',
                            month: 'MMM yyyy'
                        },
                        tooltipFormat: 'MMM d, yyyy HH:mm'
                    },
                    title: {
                        display: true,
                        text: 'Future Time Period',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true
                        // This will adapt to the theme
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                        // This will adapt to the theme
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Predicted Energy Usage (kWh)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true
                        // This will adapt to the theme
                    },
                    ticks: {
                        // This will adapt to the theme
                    }
                }
            }
        }
    });
}

// Update chart loading state
function updateChartLoadingState(chart, isLoading) {
    if (!chart) return;
    
    if (isLoading) {
        // Create loading animation
        chart.options.plugins.title = {
            display: true,
            text: 'Loading data...',
            font: {
                size: 16
            }
        };
        
        // Clear existing data
        chart.data.labels = [];
        chart.data.datasets.forEach(dataset => {
            dataset.data = [];
        });
    } else {
        // Remove loading animation
        chart.options.plugins.title = {
            display: false
        };
    }
    
    chart.update();
}

// Update chart time unit based on period
function updateChartTimeUnit(chart, period) {
    if (!chart) return;
    
    const timeUnit = period === 'daily' ? 'hour' : 
                    period === 'weekly' ? 'day' : 'week';
                    
    chart.options.scales.x.time.unit = timeUnit;
    chart.update();
}
