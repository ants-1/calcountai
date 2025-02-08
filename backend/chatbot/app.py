import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*", 
        "methods": ["GET", "POST", "PUT", "DELETE"], 
        "supports_credentials": True 
    }
})

genai.configure(api_key=GEMINI_API_KEY)

def chatbot(user_message):
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 512, 
        "response_mime_type": "text/plain",
    }
    
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash-exp",
        generation_config=generation_config,
    )
    
    chat_session = model.start_chat(history=[])
    
    response = chat_session.send_message(user_message)
    
    return response.text

@app.route("/chats", methods=['POST'])
def chat():
    print("Received request:", request.json)
    user_message = request.json.get("message")
    
    if not user_message:
        return jsonify({"error": "No message provided."}), 400
    
    try:
        chatbot_response = chatbot(user_message)
        return jsonify({"response": chatbot_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)