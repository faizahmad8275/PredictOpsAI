import random


def get_system_metrics():
    """
    Simulate real-time system metrics.
    Later this can be replaced with actual server monitoring.
    """

    cpu_usage = round(random.uniform(20, 95), 2)
    memory_usage = round(random.uniform(30, 95), 2)
    error_rate = round(random.uniform(0, 15), 2)
    response_time = round(random.uniform(200, 4000), 2)

    return {
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "error_rate": error_rate,
        "response_time": response_time
    }