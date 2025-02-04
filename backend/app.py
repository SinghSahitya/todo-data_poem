# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import time  

app = Flask(__name__)
CORS(app)

todos = []
current_id = 1

class Todo:
    def __init__(self, title):
        global current_id
        self.id = current_id
        self.title = title
        self.completed = False
        current_id += 1

@app.route('/api/todos', methods=['GET'])
def get_todos():
    time.sleep(0.5)  
    return jsonify([{'id': t.id, 'title': t.title, 'completed': t.completed} for t in todos])

@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.json
    if not data or 'title' not in data or not data['title'].strip():
        return jsonify({'error': 'Title is required'}), 400
    
    new_todo = Todo(data['title'])
    todos.append(new_todo)
    return jsonify({'id': new_todo.id, 'title': new_todo.title, 'completed': False}), 201

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    initial_length = len(todos)
    todos = [t for t in todos if t.id != todo_id]
    if len(todos) == initial_length:
        return jsonify({'error': 'Todo not found'}), 404
    return jsonify({'success': True}), 200

if __name__ == '__main__':
    app.run(debug=True)
