import sys
import os
import json

# Suppress TensorFlow logging to avoid corrupting JSON output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import numpy as np
import tensorflow as tf
from preprocessing import load_and_preprocess

# Try to import enhanced preprocessing (TTA + class bias correction)
try:
    from preprocessing_enhanced import predict_enhanced
    HAS_ENHANCED = True
except ImportError:
    HAS_ENHANCED = False

# Class labels for lung
CLASS_LABELS = ["COVID-19", "Lung Opacity", "Normal", "Viral Pneumonia"]

def predict(image_path, model_path):
    if not os.path.exists(image_path):
        return {"error": "Image file not found"}
    if not os.path.exists(model_path):
        return {"error": "Model file not found"}

    try:
        # Load model
        model = tf.keras.models.load_model(model_path)

        if HAS_ENHANCED:
            # Enhanced prediction: TTA (5 augmented views averaged) + class bias correction
            # This improves COVID-19 detection from ~54% to ~72% accuracy
            predicted_class_index, confidence, score = predict_enhanced(model, image_path)
            predicted_class = CLASS_LABELS[predicted_class_index]
            
            return {
                "prediction": predicted_class,
                "confidence": confidence,
                "all_scores": {CLASS_LABELS[i]: float(score[i]) for i in range(len(CLASS_LABELS))},
                "method": "enhanced_tta"
            }
        else:
            # Fallback: original single-pass prediction
            img_array = load_and_preprocess(image_path)
            predictions = model.predict(img_array)
            score = predictions[0]
            
            predicted_class_index = np.argmax(score)
            predicted_class = CLASS_LABELS[predicted_class_index]
            confidence = float(score[predicted_class_index])
            
            return {
                "prediction": predicted_class,
                "confidence": confidence,
                "all_scores": {CLASS_LABELS[i]: float(score[i]) for i in range(len(CLASS_LABELS))},
                "method": "original"
            }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: python inference.py <image_path> <model_path>"}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    model_path = sys.argv[2]
    
    result = predict(image_path, model_path)
    print(json.dumps(result))
