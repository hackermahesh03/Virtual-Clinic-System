"""
Split dataset into 80% train / 20% test and run accuracy tests on test set.
"""
import os, sys, io, random, shutil
import numpy as np

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_ROOT = os.path.join(os.path.expanduser("~"), "Downloads", "archive (2)", "COVID-19_Radiography_Dataset")
SPLIT_DIR = os.path.join(SCRIPT_DIR, "dataset")
TRAIN_DIR = os.path.join(SPLIT_DIR, "train")
TEST_DIR = os.path.join(SPLIT_DIR, "test")

CLASS_LABELS = ["COVID-19", "Lung Opacity", "Normal", "Viral Pneumonia"]
FOLDER_MAP = {
    "COVID-19": "COVID",
    "Lung Opacity": "Lung_Opacity",
    "Normal": "Normal",
    "Viral Pneumonia": "Viral Pneumonia",
}

random.seed(42)

def split_dataset():
    """Split full dataset into 80% train / 20% test."""
    print("=" * 60)
    print("  Splitting dataset: 80% train / 20% test")
    print("=" * 60)
    
    # Clean existing split
    if os.path.exists(SPLIT_DIR):
        print("Split already exists. Skipping split.")
    else:
        for label in CLASS_LABELS:
            src_folder = FOLDER_MAP[label]
            src_images = os.path.join(DATASET_ROOT, src_folder, "images")
            
            all_imgs = sorted([f for f in os.listdir(src_images) if f.lower().endswith('.png')])
            random.shuffle(all_imgs)
            
            split_idx = int(len(all_imgs) * 0.8)
            train_imgs = all_imgs[:split_idx]
            test_imgs = all_imgs[split_idx:]
            
            # Create directories
            train_class_dir = os.path.join(TRAIN_DIR, label)
            test_class_dir = os.path.join(TEST_DIR, label)
            os.makedirs(train_class_dir, exist_ok=True)
            os.makedirs(test_class_dir, exist_ok=True)
            
            # Copy files
            for img in train_imgs:
                shutil.copy2(os.path.join(src_images, img), os.path.join(train_class_dir, img))
            for img in test_imgs:
                shutil.copy2(os.path.join(src_images, img), os.path.join(test_class_dir, img))
            
            print(f"  {label:23s} train: {len(train_imgs):>5d}  test: {len(test_imgs):>5d}  total: {len(all_imgs):>5d}")
        
        print(f"\n  Train dir: {TRAIN_DIR}")
        print(f"  Test dir:  {TEST_DIR}")
        print("=" * 60)


def run_test(sample_size=100):
    """Run accuracy test on random sample from the 20% test set."""
    import tensorflow as tf
    from preprocessing_enhanced import predict_enhanced
    import random
    
    MODEL_PATH = os.path.join(SCRIPT_DIR, "lung_model.h5")
    model = tf.keras.models.load_model(MODEL_PATH)
    
    print(f"\n{'=' * 60}")
    print(f"  Testing {sample_size} random images/class from permanent 20% test set")
    print(f"{'=' * 60}\n")
    
    total_correct = 0
    total_images = 0
    per_class = {}
    confusion = [[0]*4 for _ in range(4)]
    
    for label in CLASS_LABELS:
        test_class_dir = os.path.join(TEST_DIR, label)
        all_imgs = sorted([f for f in os.listdir(test_class_dir) if f.lower().endswith('.png')])
        
        sample = random.sample(all_imgs, min(sample_size, len(all_imgs)))
        true_idx = CLASS_LABELS.index(label)
        correct = 0
        
        print(f"  Testing '{label}' ({len(sample)} from {len(all_imgs)} test images)...")
        
        for img_name in sample:
            img_path = os.path.join(test_class_dir, img_name)
            pred_idx, conf, scores = predict_enhanced(model, img_path)
            confusion[true_idx][pred_idx] += 1
            if pred_idx == true_idx:
                correct += 1
        
        acc = correct / len(sample) * 100
        per_class[label] = (correct, len(sample), acc)
        total_correct += correct
        total_images += len(sample)
        print(f"    => {correct}/{len(sample)} = {acc:.1f}%")
    
    overall = total_correct / total_images * 100
    
    print(f"\n{'-' * 55}")
    print(f"{'Class':25s} {'Correct':>8s} {'Total':>6s} {'Accuracy':>10s}")
    print(f"{'-' * 55}")
    for label in CLASS_LABELS:
        c, n, a = per_class[label]
        print(f"  {label:23s} {c:>6d}   {n:>4d}   {a:>8.1f}%")
    print(f"{'-' * 55}")
    print(f"  {'OVERALL':23s} {total_correct:>6d}   {total_images:>4d}   {overall:>8.1f}%")
    
    status = "PASS" if overall >= 85 else "FAIL"
    print(f"\n  Result: {status} ({overall:.1f}% {'>='}  85% threshold)")
    print(f"{'=' * 60}")
    
    return overall


if __name__ == "__main__":
    # Step 1: Split
    split_dataset()
    
    # Step 2: Test on 100 samples per class from the test set
    acc = run_test(sample_size=100)
