import numpy as np
from PIL import Image
from tensorflow.keras.applications.densenet import preprocess_input


IMG_SIZE = 224


def load_and_preprocess(image_path):
    """Load an image from disk, resize to 224x224, and apply DenseNet121
    preprocessing. Returns a batch-dimension array ready for model.predict().
    """
    img = Image.open(image_path).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE), Image.LANCZOS)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array


def load_original_array(image_path):
    """Load image as a uint8 numpy array (224x224x3) for overlay purposes."""
    img = Image.open(image_path).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE), Image.LANCZOS)
    return np.array(img, dtype=np.uint8)
