from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
import json
import os
import re
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

USER_DB = "users.json"
JOURNAL_DB = "journal.json"


# ---------------- USERS DB ----------------

def load_users():
    if not os.path.exists(USER_DB):
        return []
    with open(USER_DB, "r") as f:
        return json.load(f)


def save_users(users):
    with open(USER_DB, "w") as f:
        json.dump(users, f, indent=2)


# ---------------- JOURNAL DB ----------------

def load_journal():
    if not os.path.exists(JOURNAL_DB):
        return []
    with open(JOURNAL_DB, "r") as f:
        return json.load(f)


def save_journal(entries):
    with open(JOURNAL_DB, "w") as f:
        json.dump(entries, f, indent=2)


# ---------------- VALIDATION ----------------

def is_email(value):
    return re.match(r"[^@]+@[^@]+\.[^@]+", value)


def is_phone(value):
    return re.match(r"^[0-9]{10}$", value)


# ---------------- HOME ----------------

@app.route("/")
def home():
    return "Backend Running"


# ---------------- REGISTER ----------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"msg": "Email/Phone and password required"}), 400

    if not is_email(username) and not is_phone(username):
        return jsonify({"msg": "Enter valid Email or 10-digit Phone"}), 400

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


# ---------------- LOGIN ----------------

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


# ---------------- PROTECTED ----------------

@app.route("/api/protected")
@jwt_required()
def protected():
    user = get_jwt_identity()
    return jsonify({"msg": f"Welcome {user}"})


# ---------------- SAVE JOURNAL ENTRY ----------------

@app.route("/api/journal", methods=["POST"])
@jwt_required()
def save_entry():
    user = get_jwt_identity()
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"msg": "Empty entry"}), 400

    entries = load_journal()
    today = datetime.now().strftime("%Y-%m-%d")
	
    mood = data.get("mood", "neutral") 

    entries.append({
        "user": user,
        "text": text,
        "date": today,
	"mood": mood
    })

    save_journal(entries)

    return jsonify({"msg": "Entry saved"})


# ---------------- GET USER JOURNAL ----------------

@app.route("/api/journal", methods=["GET"])
@jwt_required()
def get_entries():
    user = get_jwt_identity()
    entries = load_journal()
    user_entries = [e for e in entries if e["user"] == user]
    return jsonify(user_entries)


# ---------------- STREAK SYSTEM ----------------

@app.route("/api/streak")
@jwt_required()
def get_streak():
    user = get_jwt_identity()
    entries = load_journal()

    # Collect only entries that have date
    user_dates = []
    for e in entries:
        if e.get("user") == user and e.get("date"):
            user_dates.append(e["date"])

    user_dates = sorted(set(user_dates), reverse=True)

    if not user_dates:
        return jsonify({"streak": 0})

    streak = 0
    today = datetime.now().date()

    for i, d in enumerate(user_dates):
        date_obj = datetime.strptime(d, "%Y-%m-%d").date()

        if i == 0:
            if date_obj == today or date_obj == today - timedelta(days=1):
                streak = 1
            else:
                break
        else:
            prev_date = datetime.strptime(user_dates[i - 1], "%Y-%m-%d").date()
            if prev_date - date_obj == timedelta(days=1):
                streak += 1
            else:
                break

    return jsonify({"streak": streak})


# ---------------- RUN ----------------

if __name__ == "__main__":
    app.run(debug=True)
