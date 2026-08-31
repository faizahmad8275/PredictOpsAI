import time

from monitoring.metrics import get_system_metrics
from ml.predict import predict_failure
from controllers.prediction_controller import save_monitoring_prediction


def monitor_system(interval=10):

    print("🚀 PredictOps AI Monitoring Started")
    print("Monitoring system metrics...\n")

    while True:

        # Get current system metrics
        metrics = get_system_metrics()

        # Run ML prediction
        prediction = predict_failure(
            metrics["cpu_usage"],
            metrics["memory_usage"],
            metrics["error_rate"],
            metrics["response_time"]
        )

        # Save prediction to MongoDB
        saved_prediction = save_monitoring_prediction(
            metrics,
            prediction
        )

        # Display metrics
        print("=" * 50)

        print("📊 System Metrics")
        print(f"CPU Usage      : {metrics['cpu_usage']}%")
        print(f"Memory Usage   : {metrics['memory_usage']}%")
        print(f"Error Rate     : {metrics['error_rate']}%")
        print(f"Response Time  : {metrics['response_time']} ms")

        print("\n🤖 AI Prediction")
        print(
            f"Failure Probability : "
            f"{prediction['failure_probability'] * 100}%"
        )

        print(f"Risk Level          : {prediction['risk_level']}")
        print(f"Predicted Status    : {prediction['predicted_status']}")

        # Early warning
        if prediction["risk_level"] in ["high", "critical"]:

            print("\n🚨 EARLY WARNING!")
            print("Potential system failure detected.")

        elif prediction["risk_level"] == "medium":

            print("\n⚠️ MODERATE RISK")
            print("System should be monitored closely.")

        else:

            print("\n✅ SYSTEM HEALTHY")

        # MongoDB save confirmation
        print(f"\n💾 Saved to MongoDB: {saved_prediction['id']}")

        print("=" * 50)

        # Wait before next monitoring cycle
        time.sleep(interval)


if __name__ == "__main__":
    monitor_system()