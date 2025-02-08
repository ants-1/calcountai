from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/chats", methods=['POST'])
def chat():
    
    user_message = request.json.get("message")
    
    if not user_message:
        return jsonify({"error": "No message provided."}), 400
    
    return jsonify({"response": user_message})

if __name__ == '__main__':
    app.run(debug=True)