const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#newtask");
const todoList = document.querySelector("#todo-list");
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const taskDateInput = document.querySelector("#date");
const descriptionInput = document.getElementById('description');

let editTodoId = null; // Para controlar a edição das tarefas
let oldInputValue; // Variável para armazenar o valor original ao editar uma tarefa

// Função para formatar a data corretamente
function formatDate(dateString) {
    if (!dateString) return 'Data não definida';
    const date = new Date(dateString);
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
    return `${date.getDate().toString().padStart(2, '0')}/${
        (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()}`;
}

// Função para criar um contador de tempo (countdown)
function createCountdown(dateString, element) {
    const deadline = new Date(dateString);
    deadline.setHours(23, 59, 59, 999);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = deadline.getTime() - now;

        if (distance <= 0) {
            element.textContent = 'Prazo Expirado';
            clearInterval(interval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown(); 
    element.countdownInterval = setInterval(updateCountdown, 1000);
}

// Função para adicionar uma nova tarefa
function addTodoTask(title, description, date) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    
    const countdownSpan = document.createElement('span');
    countdownSpan.className = 'countdown';

    todoDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${formatDate(date)} - <span class="countdown"></span></p>
        <button class="see-description">
            <i class="fa-regular fa-eye"></i>
        </button>
        <button class="finish-todo">
            <i class="fa-solid fa-check"></i>
        </button>
        <button class="edit-todo">
            <i class="fa-solid fa-pen"></i>
        </button>
        <button class="remove-todo">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    // Evento dos botões
    todoDiv.querySelector('.see-description').addEventListener('click', () => {
        alert(description); 
    });

    todoDiv.querySelector('.finish-todo').addEventListener('click', () => {
        todoDiv.classList.add('done');
        // Para o countdown se a tarefa estiver concluída
        if (todoDiv.classList.contains('done')) {
            clearInterval(todoDiv.countdownInterval);
            todoDiv.querySelector('.countdown').textContent = 'Concluído';
        } 
    });

    todoDiv.querySelector('.edit-todo').addEventListener('click', () => {
        editTodoId = title;
        editForm.style.display = 'block';
        editInput.value = title;
    });

    todoDiv.querySelector('.remove-todo').addEventListener('click', () => {
        todoDiv.remove();
    });

    // Adiciona a tarefa à lista e inicia o countdown
    todoList.appendChild(todoDiv);
    createCountdown(date, todoDiv.querySelector('.countdown'));
}

// Função para filtrar as tarefas
function filterTodos() {
    const filterValue = filterSelect.value;
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        const isCompleted = todo.classList.contains('done');
        if (filterValue === 'all') {
            todo.style.display = 'block';
        } else if (filterValue === 'done' && !isCompleted) {
            todo.style.display = 'none';
        } else if (filterValue === 'to-do' && isCompleted) {
            todo.style.display = 'none';
        }
    });
}

// Função para editar a tarefa
editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedTitle = editInput.value.trim();
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        if (todo.querySelector('h3').textContent === editTodoId) {
            todo.querySelector('h3').textContent = updatedTitle;
        }
    });

    editTodoId = null;
    editForm.style.display = 'none';
});

// Cancelar edição
cancelEditBtn.addEventListener('click', () => {
    editTodoId = null;
    editForm.style.display = 'none';
});

// Adicionar tarefa
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    const date = taskDateInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title) {
        addTodoTask(title, description, date);
        todoForm.reset(); 
    } else {
        alert('Por favor, preencha todos o campo obrigatório (Título).');
    }
});

// Buscar tarefas
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const todos = document.querySelectorAll('.todo');

    todos.forEach(todo => {
        const title = todo.querySelector('h3').textContent.toLowerCase();
        todo.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});

// Filtrar tarefas por estado
filterSelect.addEventListener('change', filterTodos);


