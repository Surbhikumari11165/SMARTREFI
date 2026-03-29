from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import sys
import os

# --- PATH CONFIGURATION ---
# Ensures api.py can find the 'utils' folder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Import your custom logic modules
try:
    from utils.expiry_tracker import get_expiry_status
    from utils.recommender import recommend
except ImportError as e:
    print(f"Import Error: {e}")
    # Basic fallbacks to prevent crash
    def get_expiry_status(item): return "fresh"
    def recommend(items): return ["Chef's Surprise"]

app = Flask(__name__)
CORS(app) 

# --- HELPER: SORTING PRIORITY ---
# This ensures Expired (0) > Expiring (1) > Fresh (2)
STATUS_ORDER = {"expired": 0, "expiring": 1, "fresh": 2}

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        items = data.get("items", [])
        analysis_results = []

        for item in items:
            # 1. Calculate Freshness Status
            status = get_expiry_status({
                "addedOn": item.get("date"), 
                "category": item.get("category", "vegetable")
            })
            
            # 2. Generate Simulated ML Confidence Score
            # High score for Fresh, Low score for Expired
            if status == "fresh":
                ml_score = random.randint(75, 98)
            elif status == "expiring":
                ml_score = random.randint(30, 60)
            else: # expired
                ml_score = random.randint(5, 25)

            analysis_results.append({
                "name": item.get("name"),
                "qty": item.get("qty"),
                "status": status,
                "ml_score": ml_score,
                "category": item.get("category")
            })

        # --- 3. SORTING LOGIC ---
        # Sort by Status Priority first, then by ML Score (lowest score = most urgent)
        sorted_analysis = sorted(
            analysis_results, 
            key=lambda x: (STATUS_ORDER.get(x["status"], 3), x["ml_score"])
        )

        # --- 4. SAFETY FILTER FOR AI ---
        # Only send items that are NOT expired to the Gemini AI recommender
        safe_ingredients = [i for i in sorted_analysis if i['status'] != 'expired']
        
        # Get recipes based only on safe food
        recipes = recommend(safe_ingredients) 

        return jsonify({
            "analysis": sorted_analysis, 
            "recipes": recipes
        })

    except Exception as e:
        print(f"Backend Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/get-recipes", methods=["POST"])
def get_recipes():
    """Separate endpoint if you just want recipes without re-analyzing"""
    try:
        data = request.json
        items = data.get("items", [])
        suggestions = recommend(items)
        return jsonify({"recipes": suggestions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)