import csv
import random
import os


random.seed(42)

rows = []

for _ in range(2000):

    cpu = round(random.uniform(20, 100), 2)
    memory = round(random.uniform(20, 100), 2)
    error_rate = round(random.uniform(0, 20), 2)
    response_time = round(random.uniform(100, 5000), 2)

    # Calculate risk score for generating training labels
    cpu_score = cpu / 100
    memory_score = memory / 100
    error_score = error_rate / 20
    response_score = response_time / 5000

    risk_score = (
        cpu_score * 0.30
        + memory_score * 0.25
        + error_score * 0.25
        + response_score * 0.20
    )

    # Add a small amount of randomness
    risk_score += random.uniform(-0.05, 0.05)

    failure = 1 if risk_score >= 0.55 else 0

    rows.append([
        cpu,
        memory,
        error_rate,
        response_time,
        failure
    ])


file_path = os.path.join(
    os.path.dirname(__file__),
    "training_data.csv"
)

with open(file_path, "w", newline="") as file:

    writer = csv.writer(file)

    writer.writerow([
        "cpu_usage",
        "memory_usage",
        "error_rate",
        "response_time",
        "failure"
    ])

    writer.writerows(rows)


print("Dataset generated successfully!")
print(f"Total records: {len(rows)}")
print(f"Saved to: {file_path}")