
import cv2
import numpy as np
import tensorflow as tf

from tensorflow.keras.models import load_model
from tensorflow.keras.applications.densenet import preprocess_input

from exceptions.custom_exceptions import (
    InvalidImageException,
    ModelPredictionException
)


# Load DenseNet model once when server starts
model = load_model(
    "model/pneumonia_model.keras"
)


def predict_xray(image_path):

    if not image_path:
        raise InvalidImageException()

    try:

        # Read image
        img = cv2.imread(image_path)

        if img is None:
            raise InvalidImageException()

        # Resize to DenseNet input size
        img = cv2.resize(img, (224, 224))

        # DenseNet preprocessing
        img = preprocess_input(img)

        # Add batch dimension
        img = np.expand_dims(img, axis=0)

        # Model prediction
        prediction = model.predict(img)

        probability = float(prediction[0][0])

        # Classification threshold
        if probability > 0.5:
            label = "PNEUMONIA"
        else:
            label = "NORMAL"

        confidence = round(probability * 100, 2)

        return label, confidence

    except Exception as e:
        print("Prediction Error:", e)
        raise ModelPredictionException()

