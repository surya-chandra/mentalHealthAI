from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
import json
import os
import re

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

USER_DB = "users.json"


# ---------- DB ----------

def load_users():
    if not os.path.exists(USER_DB):
        return []
    with open(USER_DB, "r") as f:
        return json.load(f)


def save_users(users):
    with open(USER_DB, "w") as f:
        json.dump(users, f, indent=2)


# ---------- VALIDATION ----------

def is_email(value):
    return re.match(r"[^@]+@[^@]+\.[^@]+", value)


def is_phone(value):
    return re.match(r"^[0-9]{10}$", value)


# ---------- REGISTER ----------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"msg": "Email or Phone and password required"}), 400

    # Validate email or phone
    if not is_email(username) and not is_phone(username):
        return jsonify({"msg": "Enter valid Email or 10-digit Phone"}), 400

    users = load_users()

    # Prevent duplicate email/phone
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


# ---------- LOGIN ----------

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

    return jsonify({"msg": "Invalid email/phone or password"}), 401


# ---------- PROTECTED ----------

@app.route("/api/protected")
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify({"msg": f"Welcome {user}"})


if __name__ == "__main__":
    app.run(debug=True)
