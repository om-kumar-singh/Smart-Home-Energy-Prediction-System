import os
import csv
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from models import EnergyConsumption, Alert

class DataProcessor:
    """
    Handles loading, processing, and transforming energy consumption data.
    """
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                                      'static/data/sample_energy_data.csv')
        self.alert_threshold = 90  # kWh, configurable threshold for high energy consumption
        self.df = None
        
    def load_data(self, period='daily'):
        """
        Load and process energy consumption data based on specified time period.
        
        Args:
            period (str): Time period - 'daily', 'weekly', or 'monthly'
            
        Returns:
            list: List of processed energy consumption data
        """
        try:
            # Read the CSV file
            self.df = pd.read_csv(self.data_file)
            
            # Convert timestamp column to datetime
            self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
            
            # Resample data based on the period
            if period == 'daily':
                resampled = self.df.set_index('timestamp').resample('h').mean().reset_index()
            elif period == 'weekly':
                resampled = self.df.set_index('timestamp').resample('D').mean().reset_index()
            elif period == 'monthly':
                resampled = self.df.set_index('timestamp').resample('W').mean().reset_index()
            else:
                raise ValueError(f"Invalid period: {period}. Choose from 'daily', 'weekly', or 'monthly'")
            
            # Fill NaN values with forward fill method (using non-deprecated approach)
            resampled = resampled.ffill()
            
            # Convert to list of dictionaries for JSON serialization
            result = []
            for _, row in resampled.iterrows():
                consumption = EnergyConsumption(
                    timestamp=row['timestamp'],
                    consumption=float(row['consumption'])
                )
                result.append(consumption.to_dict())
                
            return result
            
        except FileNotFoundError:
            # If file doesn't exist, generate sample data
            self._generate_sample_data()
            return self.load_data(period)
        except Exception as e:
            raise Exception(f"Error processing data: {str(e)}")
    
    def _generate_sample_data(self):
        """
        Generate sample energy consumption data if no data file exists.
        """
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(self.data_file), exist_ok=True)
        
        # Generate sample data for the first 30 days of 2025
        data = []
        start_date = datetime(2025, 1, 1, 0, 0, 0)  # January 1, 2025 at midnight
        end_date = start_date + timedelta(days=30)
        
        # Generate hourly data
        current_date = start_date
        while current_date <= end_date:
            # Base consumption varies by time of day (higher during day, lower at night)
            hour = current_date.hour
            base = 30 + 20 * np.sin(np.pi * hour / 12)
            
            # Add weekly pattern (higher on weekdays, lower on weekends)
            weekday_factor = 1.0 if current_date.weekday() < 5 else 0.8
            
            # Add some random noise
            noise = random.uniform(-5, 5)
            
            # Calculate consumption
            consumption = base * weekday_factor + noise
            
            data.append({
                'timestamp': current_date.strftime('%Y-%m-%d %H:%M:%S'),
                'consumption': max(0, consumption)  # Ensure no negative values
            })
            
            current_date += timedelta(hours=1)
        
        # Write to CSV
        with open(self.data_file, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['timestamp', 'consumption'])
            writer.writeheader()
            writer.writerows(data)
    
    def generate_real_time_consumption(self):
        """
        Generate a simulated real-time energy consumption value.
        
        Returns:
            float: Current energy consumption value
        """
        # Get the last known consumption
        if self.df is None:
            self.load_data()
        
        # Get the most recent consumption as base
        last_consumption = self.df['consumption'].iloc[-1]
        
        # Add some random fluctuation (±10%)
        fluctuation = random.uniform(-0.1, 0.1) * last_consumption
        
        # Time-based pattern (higher during day, lower at night)
        current_hour = datetime.now().hour
        time_factor = 1.0 + 0.2 * np.sin(np.pi * current_hour / 12)
        
        # Calculate current consumption
        current = last_consumption * time_factor + fluctuation
        
        # Ensure non-negative
        return max(0, current)
    
    def check_alert_threshold(self, consumption):
        """
        Check if current consumption exceeds the alert threshold.
        
        Args:
            consumption (float): Current energy consumption
            
        Returns:
            dict: Alert information or None
        """
        if consumption > self.alert_threshold:
            percentage_over = ((consumption - self.alert_threshold) / self.alert_threshold) * 100
            
            # Determine alert level based on how much it exceeds threshold
            if percentage_over > 30:
                level = "danger"
                message = f"Critical: Energy consumption is {percentage_over:.1f}% above threshold!"
            elif percentage_over > 10:
                level = "warning"
                message = f"Warning: Energy consumption is {percentage_over:.1f}% above threshold."
            else:
                level = "info"
                message = f"Notice: Energy consumption has exceeded threshold by {percentage_over:.1f}%."
                
            alert = Alert(level, message)
            return alert.to_dict()
        
        return None
