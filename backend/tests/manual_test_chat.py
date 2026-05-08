import requests


def test_chat(message, lang="en"):
    url = "http://localhost:8000/api/v1/chat"
    payload = {"message": message, "language": lang, "history": []}
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print(f"User: {message}")
            print(f"Bot: {response.json()['reply']}")
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed to connect to backend: {e}")


if __name__ == "__main__":
    # Test Core Foundations triggers
    print("Testing technical triggers...")
    test_chat("Tell me about Git")
    print("-" * 20)
    test_chat("What are web vitals?")
    print("-" * 20)
    test_chat("How do you handle security?")
    print("-" * 20)
    test_chat("What is your testing pyramid?")
    print("-" * 20)
    test_chat("hola", lang="es")
