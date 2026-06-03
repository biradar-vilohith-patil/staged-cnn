import tensorflow as tf
from tensorflow.keras import layers, models
import os
import kagglehub

# Define Image Parameters
IMG_HEIGHT = 150
IMG_WIDTH = 150
BATCH_SIZE = 32

def create_model():
    model = models.Sequential([
        layers.Rescaling(1./255, input_shape=(IMG_HEIGHT, IMG_WIDTH, 3)),
        layers.Conv2D(32, (3, 3), activation='relu'),
        layers.MaxPooling2D(2, 2),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D(2, 2),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D(2, 2),
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid') # Binary classification
    ])
    
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])
    return model

if __name__ == "__main__":
    print("Initiating KaggleHub...")
    print("Fetching Paul Mooney's Pneumonia Dataset (this may take a minute on first run)...")
    
    # Download the dataset directly to the Codespaces cache
    dataset_path = kagglehub.dataset_download("paultimothymooney/chest-xray-pneumonia")
    print(f"Dataset cached successfully at: {dataset_path}")

    # The dataset structure has a nested 'chest_xray' folder containing train/val/test
    TRAIN_DIR = os.path.join(dataset_path, 'chest_xray', 'train')
    VAL_DIR = os.path.join(dataset_path, 'chest_xray', 'val')

    print("Loading datasets into memory pipeline...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        image_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=BATCH_SIZE)

    val_ds = tf.keras.utils.image_dataset_from_directory(
        VAL_DIR,
        image_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=BATCH_SIZE)

    model = create_model()
    
    print("Starting CNN training process...")
    # Using 5 epochs for a faster initial run in Codespaces, you can increase this later
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=5 
    )
    
    # Save the model so the FastAPI predict router can use it
    model.save('pneumonia_model.keras')
    print("Success! Model saved locally as pneumonia_model.keras")