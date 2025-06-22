from datetime import datetime

class EnergyConsumption:
    """
    Model for energy consumption data.
    """
    def __init__(self, timestamp, consumption, unit='kWh'):
        self.timestamp = timestamp
        self.consumption = consumption
        self.unit = unit
        
    def to_dict(self):
        """Convert the model to a dictionary."""
        return {
            'timestamp': self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp,
            'consumption': self.consumption,
            'unit': self.unit
        }

class PredictionResult:
    """
    Model for energy consumption prediction results.
    """
    def __init__(self, timestamps, values, model_type, confidence_intervals=None):
        self.timestamps = timestamps
        self.values = values
        self.model_type = model_type
        self.confidence_intervals = confidence_intervals or []
        
    def to_dict(self):
        """Convert the model to a dictionary."""
        result = {
            'timestamps': [ts.isoformat() if isinstance(ts, datetime) else ts for ts in self.timestamps],
            'values': self.values,
            'model_type': self.model_type
        }
        
        if self.confidence_intervals:
            result['confidence_intervals'] = self.confidence_intervals
            
        return result

class Alert:
    """
    Model for energy consumption alerts.
    """
    def __init__(self, level, message, timestamp=None):
        self.level = level  # 'warning', 'danger', 'info'
        self.message = message
        self.timestamp = timestamp or datetime.now()
        
    def to_dict(self):
        """Convert the model to a dictionary."""
        return {
            'level': self.level,
            'message': self.message,
            'timestamp': self.timestamp.isoformat() if isinstance(self.timestamp, datetime) else self.timestamp
        }
