import json
from pathlib import Path

# Load data from fixture
FIXTURE_PATH = Path(__file__).parent / "fixtures" / "greetings.json"

with open(FIXTURE_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)
