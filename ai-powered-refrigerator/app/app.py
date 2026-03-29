import sys
import os

# Add root directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, request, jsonify
from utils.recommender import recommend

app = Flask(__name__)
@app.route("/")
def home():
    return "Smart Fridge API Running"

@app.route("/recommend", methods=["POST"])
def get_recommendations():
    data = request.json
    items = data.get("items", [])

    item_list = [{"category": item} for item in items]
    result = recommend(item_list)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)