loggedInUser = [];

let currentDraggedElement;


/**
 * This function is used to initial the board.
 */
async function initBoard() {
  await includeHTML();
  loadAllTasks();
  activeMenu();
  load();
  loadUsers();
  loadUserProfile();
  showAllTasks(allTasks);
  if (!localStorage.getItem("allTasks")) {
    saveTasksToLocalStorage(allTasks);
  } else {
    allTasks = JSON.parse(localStorage.getItem("allTasks"));
    saveTasksToLocalStorage(allTasks);
  }
}


/**
 * This function is used to update the subtask status
 * 
 * @param {*} taskId 
 * @param {*} subtaskName 
 * @param {*} status 
 */
function updateSubtaskStatus(taskId, subtaskName, status) {
  let task = findTaskById(taskId);
  if (task) {
    let subtask = task.subtask.find(sub => sub.name === subtaskName);
    if (subtask && subtask.status !== status) {
      subtask.status = status;
      let completedSubtasks = task.subtask ? task.subtask.filter(subtask => subtask.status).length : 0;
      let totalSubtasks = task.subtask ? task.subtask.length : 0;
      let progressPercentage = Math.round((completedSubtasks / totalSubtasks) * 100);
      task.progress = progressPercentage;
      saveTasksToLocalStorage(allTasks);
      showAllTasks(allTasks);
    }
  }
}


/**
 * This function is used to find tasks by id
 * 
 * @param {*} taskId 
 */
function findTaskById(taskId) {
  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].id === taskId) {
      return allTasks[i];
    }
  }
  return null;
}


/**
 * This function is used to filter all Tasks from array to render in the correct progressfield
 * 
 * @param {*} allTasks - 
 */
function showAllTasks(allTasks) {
  filterAndRenderTasksForTodo(allTasks);
  filterAndRenderTasksForInProgress(allTasks);
  filterAndRenderTasksAwaitFeedback(allTasks);
  filterAndRenderTasksDone(allTasks);
}


/**
 * This function filter all Tasks for 'todo' progressfield
 * 
 * @param {*} allTasks 
 */
function filterAndRenderTasksForTodo(allTasks) {
  let todo_container = allTasks.filter(
    (t) => t["progressfield"] == "todo_container"
  );
  document.getElementById("todo_container").innerHTML = "";
  if (todo_container.length === 0) {
    document.getElementById('todo_container').innerHTML = renderEmptyProgressfieldTodo();
  } else {
    for (let i = 0; i < todo_container.length; i++) {
      let task = todo_container[i];
      let taskDetails = calculateTaskDetails(task);
      document.getElementById('todo_container').innerHTML += renderAllTasksInProgressfieldTodo(task, taskDetails.urgentSymbolHTML, taskDetails.mediumSymbolHTML, taskDetails.lowSymbolHTML, taskDetails.userInitialsHTML, taskDetails.progressPercentage, taskDetails.completedSubtasks, taskDetails.totalSubtasks);
    }
  }
}


/**
 * This function filter all Tasks for 'in progress' progressfield
 * 
 * @param {*} allTasks 
 */
function filterAndRenderTasksForInProgress(allTasks) {
  let inprogress_container = allTasks.filter(
    (t) => t["progressfield"] == "inprogress_container"
  );
  document.getElementById("inprogress_container").innerHTML = "";
  if (inprogress_container.length === 0) {
    document.getElementById('inprogress_container').innerHTML = renderEmptyProgressfieldInProgress();
  } else {
    for (let i = 0; i < inprogress_container.length; i++) {
      let task = inprogress_container[i];
      let taskDetails = calculateTaskDetails(task);
      document.getElementById("inprogress_container").innerHTML += renderAllTasksInProgressfieldInProgress(task, taskDetails.urgentSymbolHTML, taskDetails.mediumSymbolHTML, taskDetails.lowSymbolHTML, taskDetails.userInitialsHTML, taskDetails.progressPercentage, taskDetails.completedSubtasks, taskDetails.totalSubtasks);
    }
  }
}


/**
 * This function filter all Tasks for 'await feedback' progressfield
 * 
 * @param {*} allTasks 
 */
function filterAndRenderTasksAwaitFeedback(allTasks) {
  let await_feedback_container = allTasks.filter(
    (t) => t["progressfield"] == "await_feedback_container"
  );
  document.getElementById("await_feedback_container").innerHTML = "";
  if (await_feedback_container.length === 0) {
    document.getElementById('await_feedback_container').innerHTML = renderEmptyProgressfieldAwaitFeedback();
  } else {
    for (let i = 0; i < await_feedback_container.length; i++) {
      let task = await_feedback_container[i];
      let taskDetails = calculateTaskDetails(task);
      document.getElementById("await_feedback_container").innerHTML += renderAllTasksInProgressfieldAwaitFeedback(task, taskDetails.urgentSymbolHTML, taskDetails.mediumSymbolHTML, taskDetails.lowSymbolHTML, taskDetails.userInitialsHTML, taskDetails.progressPercentage, taskDetails.completedSubtasks, taskDetails.totalSubtasks);
    }
  }
}


/**
 * This function filter all Tasks for 'done' progressfield
 * 
 * @param {*} allTasks 
 */
function filterAndRenderTasksDone(allTasks) {
  let done_container = allTasks.filter(
    (t) => t["progressfield"] == "done_container"
  );
  document.getElementById("done_container").innerHTML = "";
  if (done_container.length === 0) {
    document.getElementById('done_container').innerHTML = renderEmptyProgressfieldDone();
  } else {
    for (let i = 0; i < done_container.length; i++) {
      let task = done_container[i];
      let taskDetails = calculateTaskDetails(task);
      document.getElementById("done_container").innerHTML += renderAllTasksInProgressfieldDone(task, taskDetails.urgentSymbolHTML, taskDetails.mediumSymbolHTML, taskDetails.lowSymbolHTML, taskDetails.userInitialsHTML, taskDetails.progressPercentage, taskDetails.completedSubtasks, taskDetails.totalSubtasks);
    }
  }
}


/**
 * this function calculates all tasks details
 * 
 */
function calculateTaskDetails(task) {
  let urgentSymbolHTML = task.priority.urgent ? `<img src="/assets/img/prio-urgent.svg" alt="Urgent">` : "";
  let mediumSymbolHTML = task.priority.medium ? `<img src="/assets/img/prio-medium.svg" alt="Medium">` : "";
  let lowSymbolHTML = task.priority.low ? `<img src="/assets/img/prio-low.svg" alt="Low">` : "";
  let userInitialsHTML = task.userList.map((user) => `<div class="initials-circle" style="background-color: ${user.backgroundcolor};">${user.fname.charAt(0)}${user.lname.charAt(0)}</div>`).join("");
  let completedSubtasks = task.subtask ? task.subtask.filter((subtask) => subtask.status).length : 0;
  let totalSubtasks = task.subtask ? task.subtask.length : 0;
  let progressPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  return { urgentSymbolHTML, mediumSymbolHTML, lowSymbolHTML, userInitialsHTML, completedSubtasks, totalSubtasks, progressPercentage, };
}


/**
 * This function allows dragging an element
 * 
 * @param {*} taskId - The ID of the task being dragged
 */
function startDragging(taskId) {
  currentDraggedElement = taskId;
}


/**
 * this function allows too drop an element
 * 
 */
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * This function moves a task to another progress field in desktop version
 * 
 * @param {*} progressfield - The progress field to move the task to
 */
function moveTo(progressfield, taskId) {
  const task = allTasks.find(task => task.id === currentDraggedElement);
  if (task) {
    task.progressfield = progressfield;
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    showAllTasks(allTasks);
  } else {
    console.error("Task not found.");
  }
}



/**
 * This function moves a task to another progress field in mobile version
 * 
 * @param {*} progressfield - The progress field to move the task to
 * @param {*} taskId - The ID of the task being moved
 */
function moveToMobile(progressfield, taskId) {
  const task = allTasks.find(task => task.id === taskId);

  if (task) {
    task.progressfield = progressfield;
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    showAllTasks(allTasks);
    closeDragAndDropPopup(); // Schließe das Popup nach dem Verschieben des Tasks
  } else {
    console.error("Task not found.");
  }
}


/**
 * this function is used to highlight the progressfield while dragging
 * 
 * @param {*} id 
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}


/**
 * this function removes the highlight when task is dropped
 * 
 * @param {*} id 
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}


/**
 * this function is used to search tasks 
 */
function findTask() {
  let searchInput = document.getElementById('search').value.toLowerCase();
  let filteredTasks = allTasks.filter(task =>
    task.titel.toLowerCase().includes(searchInput) ||
    task.description.toLowerCase().includes(searchInput) ||
    task.category.toLowerCase().includes(searchInput)
  );
  showAllTasks(filteredTasks);
}


/**
 * this function deletes a task
 * 
 * @param {*} taskId 
 */
function deleteTask(taskId) {
  let allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
  let taskIndex = allTasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    allTasks.splice(taskIndex, 1);
    saveTasksToLocalStorage(allTasks);
    loadAllTasks();
    closeIncomePopup();
    showAllTasks(allTasks);
  } else {
    console.log("Task not found");
  }
}


/**
 * its used to render the drag and drop popup
 * 
 * @param {*} taskId 
 */
function dragAndDropPopup(taskId) {
  let mobileDragPopup = document.getElementById('mobile-drag-popup');
  if (mobileDragPopup.classList.contains('d-none')) {
    mobileDragPopup.classList.remove('d-none')
  } else {
    mobileDragPopup.classList.add('d-none')
  }
  mobileDragPopup.innerHTML = '';
  mobileDragPopup.innerHTML += generateDragAndDropPopupHtml(taskId);
}


/**
 * 
 * @returns the html of the drag and drop popup
 */
function generateDragAndDropPopupHtml(taskId) {
  return /*html*/`
  <div class="mobile-drag-menu">
            <img class="img_popup img_popup_mobile" style="cursor: pointer;"  src="./assets/img/close_icon.svg" alt="close Button" onclick="dragAndDropPopup()">
        <div class="mobile-drag-item" onclick="moveToMobile('todo_container', ${taskId})">To do</div>
        <div class="mobile-drag-item" onclick="moveToMobile('inprogress_container', ${taskId})">In progress</div>
        <div class="mobile-drag-item" onclick="moveToMobile('await_feedback_container', ${taskId})">Await feedback</div>
        <div class="mobile-drag-item" onclick="moveToMobile('done_container', ${taskId})">Done</div>
        </div>
    </div>
  `;
}


/**
 * closes the drag and drop popup
 */
function closeDragAndDropPopup() {
  document.getElementById('mobile-drag-popup').classList.add('d-none');
}