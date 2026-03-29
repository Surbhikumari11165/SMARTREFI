import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load the variables from the .env file
load_dotenv()

# Fetch the key from the environment
API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    print("Warning: No API Key found in environment variables!")



def recommend(fridge_items):
    """
    Combines local 'Hardcoded' logic with 'Cloud AI' reasoning.
    1. Local logic ensures favorite dishes always appear.
    2. Cloud AI handles unknown items like Grapes, Spinach, etc.
    """
    if not fridge_items:
        return []

    # Prepare lists for processing
    my_food_with_qty = [f"{item['name']} ({item['qty']})" for item in fridge_items]
    food_names_only = [item['name'].lower() for item in fridge_items]
    
    suggestions = []

    # --- 1. LOCAL "STRICT" LOGIC ---
    # This keeps your specific favorites working instantly
    if "fish" in food_names_only: 
        suggestions.append("Lemon Garlic Butter Fish")
    if "curd" in food_names_only: 
        suggestions.append("Chilled Curd Rice")
    if "chicken" in food_names_only:
        suggestions.append("Homestyle Chicken Curry")

    # --- 2. CLOUD AI LOGIC (GEMINI) ---
    # Only runs if you have provided an API Key
    if API_KEY != "PASTE_YOUR_ACTUAL_API_KEY_HERE":
        try:
            # We give the AI a very specific 'Personality' and 'Constraint'
            prompt = (
                f"Act as a professional chef. I have these items in my fridge: {', '.join(my_food_with_qty)}. "
                f"Suggest 3 creative recipes using these ingredients. "
                f"Provide ONLY the recipe names, one per line. No descriptions. Max 4 words per name."
            )
            
            response = model.generate_content(prompt)
            
            # Clean the response (remove bullet points, stars, and dashes)
            ai_output = response.text.strip().split('\n')
            for line in ai_output:
                clean_name = line.replace('*', '').replace('-', '').strip()
                # Ensure we aren't adding empty strings
                if clean_name and len(clean_name) > 2:
                    suggestions.append(clean_name)
                    
        except Exception as e:
            # If internet is down or API fails, we print the error to console
            print(f"AI Brain Error: {e}")
            suggestions.append("Chef's Daily Special")

    # --- 3. FINAL PROCESSING ---
    # Use 'set' to remove any accidental duplicates
    unique_suggestions = list(dict.fromkeys(suggestions))
    
    # Return a maximum of 5 suggestions so the UI stays clean
    return unique_suggestions[:5]