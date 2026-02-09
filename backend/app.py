from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend Running"

@app.route("/api/test")
def test():
    return jsonify({"message": "Backend working"})

if __name__ == "__main__":
    app.run(debug=True)
