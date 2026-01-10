from flask import Flask
from flask_cors import CORS
from extensions import db

app = Flask(__name__)
app.config.from_object("config.Config")

db.init_app(app)
CORS(app)

@app.route("/")
def home():
    return {"status": "RoomMateX backend running"}

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
