import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# Load dataset
dataset_path = os.path.join(
    os.path.dirname(__file__),
    "dataset",
    "training_data.csv"
)

data = pd.read_csv(dataset_path)

print("Dataset loaded successfully!")
print(f"Total records: {len(data)}")


# Features
X = data[
    [
        "cpu_usage",
        "memory_usage",
        "error_rate",
        "response_time"
    ]
]

# Target
y = data["failure"]


# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"Training records: {len(X_train)}")
print(f"Testing records: {len(X_test)}")


# Random Forest
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)


# Train
model.fit(X_train, y_train)

print("Model training completed!")


# Prediction
y_pred = model.predict(X_test)


# Evaluation
accuracy = accuracy_score(y_test, y_pred)

print(f"\nModel Accuracy: {accuracy:.2%}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# Save model
model_path = os.path.join(
    os.path.dirname(__file__),
    "model.pkl"
)

joblib.dump(model, model_path)

print("\nModel saved successfully!")
print(f"Path: {model_path}")