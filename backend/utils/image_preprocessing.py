from PIL import Image
import numpy as np
import io

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Reads an uploaded image, resizes it to 150x150, 
    and converts it to a normalized numpy array for the CNN.
    """
    try:
        # Open image and convert to RGB (strips alpha channel if PNG)
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Resize to match the training input shape
        img = img.resize((150, 150))
        
        # Convert to numpy array and add batch dimension
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    except Exception as e:
        raise ValueError(f"Invalid image format: {str(e)}")