"""
Fine-tunes MobileNetV2 using PyTorch with GPU (RTX 3050 CUDA) acceleration.

Dataset expected at: backend/ml_training/PlantVillage/PlantVillage/<class_name>/*.jpg
Outputs:
  - backend/models/disease_model.pth
  - backend/models/class_indices.json
"""
import os
import json
import time
import torch  # type: ignore[import-untyped]
import torch.nn as nn  # type: ignore[import-untyped]
import torch.optim as optim  # type: ignore[import-untyped]
from torch.utils.data import DataLoader, random_split  # type: ignore[import-untyped]
from torchvision import datasets, transforms, models  # type: ignore[import-untyped]

# ── Config ────────────────────────────────────────────────────────────────────
BATCH_SIZE = 64
EPOCHS = 5
VAL_SPLIT = 0.2
SEED = 42
DATA_DIR = "PlantVillage/PlantVillage"
MODEL_SAVE_PATH = "../models/disease_model.pth"
CLASS_INDEX_PATH = "../models/class_indices.json"

torch.manual_seed(SEED)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})")

# ── Data Transformations ──────────────────────────────────────────────────────
train_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# ── Dataset Loading & Split ───────────────────────────────────────────────────
dataset = datasets.ImageFolder(DATA_DIR, transform=train_transform)
num_classes = len(dataset.classes)
class_indices = dataset.class_to_idx

print(f"Found {len(dataset)} images across {num_classes} classes.")

val_size = int(len(dataset) * VAL_SPLIT)
train_size = len(dataset) - val_size
train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0, pin_memory=True)
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0, pin_memory=True)

# ── Model Definition (MobileNetV2 Transfer Learning) ─────────────────────────
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)

# Freeze backbone
for param in model.parameters():
    param.requires_grad = False

# Replace classifier head
model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(model.last_channel, 128),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(128, num_classes)
)

model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)

# ── Training Loop ─────────────────────────────────────────────────────────────
print(f"\nStarting GPU training for {EPOCHS} epochs...\n")
start_time = time.time()

for epoch in range(EPOCHS):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()

    train_acc = 100.0 * correct / total
    train_loss = running_loss / total

    # Validation
    model.eval()
    val_loss = 0.0
    val_correct = 0
    val_total = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            val_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            val_total += labels.size(0)
            val_correct += predicted.eq(labels).sum().item()

    val_acc = 100.0 * val_correct / val_total
    val_loss = val_loss / val_total

    print(f"Epoch [{epoch+1}/{EPOCHS}] | "
          f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}% | "
          f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%")

elapsed = time.time() - start_time
print(f"\nTraining completed in {elapsed:.2f} seconds!")

# ── Save Model & Class Index Mapping ──────────────────────────────────────────
os.makedirs("../models", exist_ok=True)
torch.save(model.state_dict(), MODEL_SAVE_PATH)

with open(CLASS_INDEX_PATH, "w") as f:
    json.dump(class_indices, f, indent=2)

print(f"Saved PyTorch model to {MODEL_SAVE_PATH} and class_indices.json to {CLASS_INDEX_PATH}")