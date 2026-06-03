import tensorflow as tf
import os
import numpy as np

# Resolve path to the model file
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model', 'pneumonia_model.keras')

class PneumoniaModelService:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        if os.path.exists(MODEL_PATH):
            self.model = tf.keras.models.load_model(MODEL_PATH)
            print("Successfully loaded pneumonia_model.keras")
        else:
            print(f"Warning: Model not found at {MODEL_PATH}. Inference will fail until model is trained.")

    def predict(self, preprocessed_image: np.ndarray) -> dict:
        if self.model is None:
            raise RuntimeError("Model is not loaded.")
        
        # Model returns a probability between 0 and 1
        prediction = self.model.predict(preprocessed_image)[0][0]
        
        # Since we used sigmoid, closer to 1 is Pneumonia (based on Kaggle dataset folder structure)
        is_pneumonia = bool(prediction > 0.5)
        confidence = float(prediction) if is_pneumonia else float(1 - prediction)
        
        return {
            "prediction": "Pneumonia" if is_pneumonia else "Normal",
            "confidence": round(confidence * 100, 2)
        }

# Singleton instance to be used by the router
model_service = PneumoniaModelService()