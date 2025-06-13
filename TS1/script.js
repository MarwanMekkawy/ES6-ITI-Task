var form = document.getElementById('todo-form');
var titleInput = document.getElementById('todo-title');
var descriptionInput = document.getElementById('todo-description');
var submitButton = document.getElementById('submit-button');
var todoList = document.getElementById('todo-list');
var todos = JSON.parse(localStorage.getItem('todos') || '[]');
var isUpdating = false;
var currentUpdateId = null;
function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
form.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = titleInput.value.trim();
    var description = descriptionInput.value.trim();
    if (!title || !description)
        return;
    if (isUpdating && currentUpdateId !== null) {
        var index = todos.findIndex(function (todo) { return todo.id === currentUpdateId; });
        if (index !== -1) {
            todos[index].title = title;
            todos[index].description = description;
        }
        isUpdating = false;
        currentUpdateId = null;
        submitButton.innerHTML = '<span>➕</span>';
    }
    else {
        var newTodo = {
            id: Date.now(),
            title: title,
            description: description,
            done: false
        };
        todos.push(newTodo);
    }
    titleInput.value = '';
    descriptionInput.value = '';
    saveToLocalStorage();
    renderTodos();
});
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(function (todo) {
        var li = document.createElement('li');
        li.className = todo.done ? 'done' : '';
        var text = document.createElement('span');
        text.textContent = "".concat(todo.title, " - ").concat(todo.description);
        li.appendChild(text);
        var doneBtn = document.createElement('button');
        doneBtn.innerHTML = '✔';
        doneBtn.className = 'done';
        doneBtn.onclick = function () {
            todo.done = !todo.done;
            saveToLocalStorage();
            renderTodos();
        };
        var updateBtn = document.createElement('button');
        updateBtn.innerHTML = '✎';
        updateBtn.className = 'update';
        updateBtn.onclick = function () {
            titleInput.value = todo.title;
            descriptionInput.value = todo.description;
            isUpdating = true;
            currentUpdateId = todo.id;
            submitButton.innerHTML = '<span>✎</span>';
        };
        var removeBtn = document.createElement('button');
        removeBtn.innerHTML = '✖';
        removeBtn.className = 'remove';
        removeBtn.onclick = function () {
            todos = todos.filter(function (t) { return t.id !== todo.id; });
            saveToLocalStorage();
            renderTodos();
        };
        li.appendChild(doneBtn);
        li.appendChild(updateBtn);
        li.appendChild(removeBtn);
        todoList.appendChild(li);
    });
}
renderTodos();
