let todos = [];


/**
 * This function is used to initialise the add Task side
 */
async function initAddTasks() {
  await includeHTML();
  activeMenu();
  load();
  loadUserProfile();
  loadUsers();
  loadAddTaskUser();
  setMinimumDateForToday('dueDate');
}


/**
 * this
 * 
 * @param {*} event 
 */
function doNotClose(event) {
  event.stopPropagation();
}


/**
 * Close assigned to popup when click outside from popup.
 * 
 * @param userList ID from popup container
 */
if (window.location.href.includes('add_task.html')) {
  document.getElementById('container').addEventListener('click', function (event) {
    const userList = document.getElementById('user-list');
    const inputIcon = document.getElementById('input-icon');
    const isClickInside = userList.contains(event.target);
    if (!isClickInside) { // Klick war außerhalb der Benutzerliste
      userList.classList.add('d-none');
      inputIcon.src = './assets/img/arrow_drop_down_1.svg';
    }
  });
}


/**
 * alles in Json und array speichern und umwandeln
 */
function loadAllTasks() {
  let allTasksAsString = localStorage.getItem("allTasks");
  if (allTasksAsString) {
    allTasks = JSON.parse(allTasksAsString); // Aktualisieren des allTasks-Arrays mit den Daten aus dem Local Storage
  }
}


/**
 * saves a task to local storage
 * 
 * @param {*} tasks 
 */
function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("allTasks", JSON.stringify(tasks));
}


/**
 * This function adds a task to allTasks array
 */
async function addTask(event) {
  event.preventDefault();
  let { titel, description, category, urgent, medium, low, dueDate } = getValueFromAddTaskForm();
  let allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  let userListData = selectedUser.map(user => ({
    fname: user.name.split(' ')[0], // Extrahieren des Vornamens aus dem Namen des Benutzers
    lname: user.name.split(' ')[1], // Extrahieren des Nachnamens aus dem Namen des Benutzers
    backgroundcolor: user.color // Verwendung der Hintergrundfarbe des Benutzers
  }));
  let subtasks = todos.map(todo => ({ name: todo, status: false }));
  let task = setVariableforSaveTask(allTasks, titel, description, dueDate, category, userListData, subtasks, urgent, medium, low);
  allTasks.push(task);

  saveTasksToLocalStorage(allTasks);
  clearInputFields();
  await createTaskMessage()

  let currentPage = window.location.pathname;
  if (currentPage === "/board.html") {
    showTaskOnPage(task);
    closeAddTaskPopup();
  }
}


/**
 * This function set variables for saveAddTask
 * 
 * @param {*} allTasks 
 * @param {*} titel 
 * @param {*} description 
 * @param {*} dueDate 
 * @param {*} category 
 * @param {*} userListData 
 * @param {*} subtasks 
 * @param {*} urgent 
 * @param {*} medium 
 * @param {*} low 
 */
function setVariableforSaveTask(allTasks, titel, description, dueDate, category, userListData, subtasks, urgent, medium, low) {
  let task = {
    id: allTasks.length > 0 ? allTasks[allTasks.length - 1].id + 1 : 1,
    titel: titel,
    description: description,
    dueDate: dueDate,
    category: category,
    userList: userListData,
    subtask: subtasks,
    priority: {
      urgent: urgent,
      medium: medium,
      low: low,
    },
    progressfield: "todo_container"
  };
  return task;
}


/**
 * 
 * @returns get values from addTask input fields
 */
function getValueFromAddTaskForm() {
  return {
    titel: document.getElementById('titel').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    urgent: document.getElementById('urgent').classList.contains('active-urgent'),
    medium: document.getElementById('medium').classList.contains('active-medium'),
    low: document.getElementById('low').classList.contains('active-low'),
    dueDate: document.getElementById('dueDate').value
  };
}


/**
 * this function clears all inputfields after add a task
 */
function clearInputFields() {
  document.getElementById('titel').value = '';
  document.getElementById('description').value = '';
  document.getElementById('category').value = '';
  document.getElementById('subtask-inputfield').value = '';
  document.getElementById('urgent').classList.remove('active-urgent');
  document.getElementById('medium').classList.add('active-medium');
  document.getElementById('low').classList.remove('active-low');
  document.getElementById('dueDate').value = '';
  document.getElementById('mylist').innerHTML = '';
  document.getElementById('selected-user').innerHTML = '';
  document.getElementById('search-user').value = '';
  selectedUser.length = 0;
}


/**
 * shows a task on page
 * 
 * @param {} task 
 */
function showTaskOnPage(task) {
  let container = document.getElementById(task.progressfield);
  let taskElement = document.createElement('div');
  taskElement.classList.add('task');
  taskElement.textContent = task.titel;
  container.appendChild(taskElement);
}


/**
 * this function is used to select a priority to task by toggling
 * 
 * @param {} priority 
 */
function togglePriority(priority) {
  let urgentButton = document.getElementById('urgent');
  let mediumButton = document.getElementById('medium');
  let lowButton = document.getElementById('low');

  let prioButton = document.getElementById(priority);
  if (prioButton == urgentButton) {
    mediumButton.classList.remove('active-medium');
    lowButton.classList.remove('active-low');
    urgentButton.classList.add('active-urgent');

  } if (prioButton == mediumButton) {
    urgentButton.classList.remove('active-urgent');
    lowButton.classList.remove('active-low');
    mediumButton.classList.add('active-medium');
  } if (prioButton == lowButton) {
    urgentButton.classList.remove('active-urgent');
    mediumButton.classList.remove('active-medium');
    lowButton.classList.add('active-low');
  }
}


/**
 * loads subtasks in Task, if available
 */
function loadTodos() {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    showTodos();
  }
}


/**
 * shows subtask array
 */
function showTodos() {
  const mylist = document.getElementById("mylist");
  mylist.innerHTML = "";

  todos.forEach((todo, i) => {
    const li = `
      <li id="todo-id-${i}" class="todo-item" ondblclick="editTodo(${i})">
        ${generateTaskHtml(todo, i)}
      </li>
    `;
    mylist.innerHTML += li;
  });
}


/**
 *  adds subtasks to local storage
 */
function addTodo() {
  let todo = document.getElementById("subtask-inputfield").value;
  if (todo === '') {
    return
  } else {
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    showTodos();
    clearInput();
    document.getElementById("subtask-inputfield").value = "";
  }
}


/**
 * function to use enter key to save a subtask in todos array
 * 
 * @param {*} event 
 */
function handleSubtaskInputEnter(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.target.blur();
    addTodo();
  }

  const subtaskInput = document.getElementById('subtask-inputfield');
  subtaskInput.addEventListener('keydown', handleSubtaskInputEnter);
}


/**
 * this function deletes subtasks from todo array
 * 
 * @param {*} position 
 */
function deleteTodo(position) {
  todos.splice(position, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
  showTodos();
}


/**
 * this function allows to edit a subtask
 * 
 * @param {*} index 
 */
function editTodo(index) {
  let inputField = document.getElementById(`edit-input-${index}`);
  let todoValue = document.getElementById(`todo-value-${index}`);
  let newStyle = document.getElementById(`todo-id-${index}`);
  let hoverActions = document.getElementById(`show-actions-${index}`);
  let editActions = document.getElementById(`edit-actions-${index}`);


  todoValue.classList.add('d-none');
  inputField.classList.remove('d-none');
  newStyle.classList.remove('todo-item');
  newStyle.classList.add('todo-style');
  hoverActions.classList.add('d-none');
  editActions.classList.remove('d-none');

}


/**
 * saves subtasks to local Storage
 * 
 * @param {*} index 
 */
function saveTodo(index) {
  let = document.getElementById(`edit-input-${index}`).value;
  saveTodosToLocalStorage();
}


/**
 * saves subtasks to local Storage
 */
function saveTodosToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
  showTodos();
}


/**
 * this function is able to update subtasks in todo array in local storage
 * 
 * @param {*} index 
 * @param {*} newValue 
 */
function updateTodo(index, newValue) {
  todos[index] = newValue;
  localStorage.setItem('todos', JSON.stringify(todos));
  showTodos();
}


/**
 * this function prevents to select dates from past
 * 
 * @param {*} inputId 
 */
function setMinimumDateForToday(inputId) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1;
  let day = currentDate.getDate();
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  const minDate = year + '-' + month + '-' + day;
  document.getElementById(inputId).min = minDate;
}


/**
 * Confirmation message after successful registration.
 */
async function createTaskMessage() {
  let msg = document.getElementById('msg-box-create-task');
  msg.classList.remove('d-none');
  setTimeout(() => {
    msg.classList.add('d-none'); // Popup ausblenden
    window.location.href = "/board.html";
  }, 1500);
}


/**
 * Activate subtask inputfield options to add a subtask
 */
function activeInput() {
  let addButton = document.getElementById('addButton');
  let inputOptions = document.getElementById('input-options');
  addButton.classList.add('d-none');
  inputOptions.classList.remove('d-none');
}


/**
 * Deaktivate subtask inputfield options to add a subtask
 */
function clearInput() {
  let subTaskInput = document.getElementById('subtask-inputfield');
  let addButton = document.getElementById('addButton');
  let inputOptions = document.getElementById('input-options');
  addButton.classList.remove('d-none');
  inputOptions.classList.add('d-none');
  subTaskInput.value = '';
}