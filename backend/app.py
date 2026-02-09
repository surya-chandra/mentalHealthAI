from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
import json
import os

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

USER_DB = "users.json"


def load_users():
    if not os.path.exists(USER_DB):
        return []
    with open(USER_DB, "r") as f:
        return json.load(f)


def save_users(users):
    with open(USER_DB, "w") as f:
        json.dump(users, f, indent=2)


@app.route("/")
def home():
    return "Backend Running"


# REGISTER
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    users = load_users()

    for u in users:
        if u["username"] == username:
            return jsonify({"msg": "User already exists"}), 400

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    users.append({
        "username": username,
        "password": hashed.decode("utf-8")
    })

    save_users(users)

    return jsonify({"msg": "User registered successfully"})


# LOGIN
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    users = load_users()

    for u in users:
        if u["username"] == username:
            if bcrypt.checkpw(password.encode("utf-8"), u["password"].encode("utf-8")):
                token = create_access_token(identity=username)
                return jsonify({"token": token})

    return jsonify({"msg": "Invalid credentials"}), 401


# PROTECTED
@app.route("/api/protected")
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify({"msg": f"Welcome {user}, secure access granted"})


if __name__ == "__main__":
    app.run(debug=True)
