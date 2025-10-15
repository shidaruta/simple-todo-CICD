from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__, static_folder="static")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///todos.db"
db = SQLAlchemy(app)


# Model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)


db.create_all()


# API routes
@app.route("/todos", methods=["GET", "POST"])
def todos():
    if request.method == "POST":
        data = request.get_json()
        todo = Todo(task=data["task"])
        db.session.add(todo)
        db.session.commit()
        return jsonify({"id": todo.id, "task": todo.task, "completed": todo.completed})
    todos_list = Todo.query.all()
    return jsonify(
        [{"id": t.id, "task": t.task, "completed": t.completed} for t in todos_list]
    )


@app.route("/todos/<int:id>", methods=["PUT", "DELETE"])
def todo_detail(id):
    todo = Todo.query.get_or_404(id)
    if request.method == "PUT":
        data = request.get_json()
        todo.task = data.get("task", todo.task)
        todo.completed = data.get("completed", todo.completed)
        db.session.commit()
        return jsonify({"id": todo.id, "task": todo.task, "completed": todo.completed})
    else:
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200


# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
