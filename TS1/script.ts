const form = document.getElementById('todo-form') as HTMLFormElement;
const titleInput = document.getElementById('todo-title') as HTMLInputElement;
const descriptionInput = document.getElementById('todo-description') as HTMLInputElement;
const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;

interface Todo {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

let todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
let isUpdating = false;
let currentUpdateId: number | null = null;

function saveToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !description) return;

  if (isUpdating && currentUpdateId !== null) {
    const index = todos.findIndex(todo => todo.id === currentUpdateId);
    if (index !== -1) {
      todos[index].title = title;
      todos[index].description = description;
    }
    isUpdating = false;
    currentUpdateId = null;
    submitButton.innerHTML = '<span>➕</span>';
  } else {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description,
      done: false,
    };
    todos.push(newTodo);
  }

  titleInput.value = '';
  descriptionInput.value = '';
  saveToLocalStorage();
  renderTodos();
});

function renderTodos(): void {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.done ? 'done' : '';

    const text = document.createElement('span');
    text.textContent = `${todo.title} - ${todo.description}`;
    li.appendChild(text);

    const doneBtn = document.createElement('button');
    doneBtn.innerHTML = '✔';
    doneBtn.className = 'done';
    doneBtn.onclick = () => {
      todo.done = !todo.done;
      saveToLocalStorage();
      renderTodos();
    };

    const updateBtn = document.createElement('button');
    updateBtn.innerHTML = '✎';
    updateBtn.className = 'update';
    updateBtn.onclick = () => {
      titleInput.value = todo.title;
      descriptionInput.value = todo.description;
      isUpdating = true;
      currentUpdateId = todo.id;
      submitButton.innerHTML = '<span>✎</span>';
    };

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '✖';
    removeBtn.className = 'remove';
    removeBtn.onclick = () => {
      todos = todos.filter(t => t.id !== todo.id);
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
