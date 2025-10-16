def test_todo_model():
    from app import Todo
    todo = Todo(task="test")
    assert todo.task == "test"
    assert not todo.completed
