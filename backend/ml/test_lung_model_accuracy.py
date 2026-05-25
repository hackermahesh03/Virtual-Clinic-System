"""
AI CareNet — Lung Model Accuracy Test Script
=============================================
Usage:
  python test_lung_model_accuracy.py <path_to_test_images_folder>

The folder should be organized as:
  test_images/
    COVID-19/
      img1.png
      img2.png
    Lung Opacity/
      img1.png
    Normal/
      img1.png
    Viral Pneumonia/
      img1.png

This script will:
  1. Load the trained model (lung_model.h5)
  2. Run predictions on all images in each class subfolder
  3. Calculate per-class and overall accuracy
  4. Generate a confusion matrix
  5. Print a detailed classification report
"""

import os
import sys
import json
import io
import numpy as np

# Fix Windows console encoding for emoji/unicode
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Suppress TF warnings for cleaner output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf
from preprocessing import load_and_preprocess

CLASS_LABELS = ["COVID-19", "Lung Opacity", "Normal", "Viral Pneumonia"]
MODEL_PATH = os.path.join(os.path.dirname(__file__), "lung_model.h5")


def run_accuracy_test(test_folder):
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Model file not found at {MODEL_PATH}")
        sys.exit(1)

    if not os.path.isdir(test_folder):
        print(f"ERROR: Test folder not found: {test_folder}")
        sys.exit(1)

    print("=" * 60)
    print("  AI CareNet — Lung Model Accuracy Test")
    print("=" * 60)
    print(f"  Model:  {MODEL_PATH}")
    print(f"  Tests:  {test_folder}")
    print(f"  Labels: {CLASS_LABELS}")
    print("=" * 60)

    # Load model once
    print("\n📦 Loading model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("  ✅ Model loaded successfully.")

    # Collect all predictions
    y_true = []
    y_pred = []
    per_class_stats = {label: {"total": 0, "correct": 0} for label in CLASS_LABELS}

    total_images = 0
    for class_label in CLASS_LABELS:
        class_folder = os.path.join(test_folder, class_label)
        if not os.path.isdir(class_folder):
            print(f"\n⚠️  Folder missing for '{class_label}', skipping...")
            continue

        import random
        all_images = [f for f in os.listdir(class_folder)
                  if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        # Pick 100 random images (or all if less than 100 exist)
        images = random.sample(all_images, min(100, len(all_images)))

        print(f"\n🔬 Testing '{class_label}' (100 random images out of {len(all_images)})...")

        for img_name in images:
            img_path = os.path.join(class_folder, img_name)
            try:
                # Use enhanced prediction (TTA + class bias correction)
                try:
                    from preprocessing_enhanced import predict_enhanced
                    predicted_index, confidence, _ = predict_enhanced(model, img_path)
                except ImportError:
                    # Fallback to standard preprocessing
                    img_array = load_and_preprocess(img_path)
                    predictions = model.predict(img_array, verbose=0)
                    predicted_index = np.argmax(predictions[0])
                    confidence = float(predictions[0][predicted_index])
                
                predicted_label = CLASS_LABELS[predicted_index]

                true_index = CLASS_LABELS.index(class_label)
                y_true.append(true_index)
                y_pred.append(predicted_index)

                per_class_stats[class_label]["total"] += 1
                if predicted_label == class_label:
                    per_class_stats[class_label]["correct"] += 1
                    status = "✅"
                else:
                    status = "❌"

                total_images += 1

            except Exception as e:
                print(f"  ⚠️  Error processing {img_name}: {e}")

    if total_images == 0:
        print("\n❌ No images found! Make sure the test folder has subfolders named:")
        print("   COVID-19, Lung Opacity, Normal, Viral Pneumonia")
        sys.exit(1)

    # ─── Results ─────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("  RESULTS")
    print("=" * 60)

    # Per-class accuracy
    print(f"\n{'Class':25s} {'Correct':>8s} {'Total':>8s} {'Accuracy':>10s}")
    print("-" * 55)
    total_correct = 0
    for label in CLASS_LABELS:
        stats = per_class_stats[label]
        if stats["total"] > 0:
            acc = stats["correct"] / stats["total"] * 100
            total_correct += stats["correct"]
            print(f"  {label:23s} {stats['correct']:>6d}   {stats['total']:>6d}   {acc:>8.1f}%")
        else:
            print(f"  {label:23s}      -        -         -")

    overall_accuracy = total_correct / total_images * 100
    print("-" * 55)
    print(f"  {'OVERALL':23s} {total_correct:>6d}   {total_images:>6d}   {overall_accuracy:>8.1f}%")

    # Confusion Matrix
    print(f"\n{'─' * 60}")
    print("  CONFUSION MATRIX")
    print(f"{'─' * 60}")
    n = len(CLASS_LABELS)
    matrix = [[0] * n for _ in range(n)]
    for t, p in zip(y_true, y_pred):
        matrix[t][p] += 1

    # Header
    print(f"\n{'Predicted →':>20s}", end="")
    for label in CLASS_LABELS:
        print(f" {label[:8]:>10s}", end="")
    print()
    print(" " * 20 + "-" * (10 * n + n))

    for i, label in enumerate(CLASS_LABELS):
        print(f"  {'Actual: ' + label[:10]:>18s}", end="")
        for j in range(n):
            marker = f"[{matrix[i][j]}]" if i == j else str(matrix[i][j])
            print(f" {marker:>10s}", end="")
        print()

    print(f"\n{'─' * 60}")
    print(f"  🎯 Overall Accuracy: {overall_accuracy:.2f}%")
    print(f"  📊 Total Images Tested: {total_images}")
    print(f"{'─' * 60}")

    # Save results to JSON
    results = {
        "overall_accuracy": round(overall_accuracy, 2),
        "total_images": total_images,
        "per_class": {
            label: {
                "correct": per_class_stats[label]["correct"],
                "total": per_class_stats[label]["total"],
                "accuracy": round(per_class_stats[label]["correct"] / per_class_stats[label]["total"] * 100, 2)
                    if per_class_stats[label]["total"] > 0 else None
            }
            for label in CLASS_LABELS
        },
        "confusion_matrix": matrix,
    }

    results_path = os.path.join(os.path.dirname(__file__), "test_results.json")
    with open(results_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n  💾 Results saved to: {results_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_lung_model_accuracy.py <path_to_test_images_folder>")
        print()
        print("The folder should contain subfolders named after each class:")
        print("  COVID-19/")
        print("  Lung Opacity/")
        print("  Normal/")
        print("  Viral Pneumonia/")
        sys.exit(1)

    run_accuracy_test(sys.argv[1])
