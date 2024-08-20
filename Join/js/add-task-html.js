/**
 * Generates HTML for displaying a filtered user with their name initials and checkbox.
 * @param {object} user - The user object containing user information.
 * @param {string} userColor - The color associated with the user.
 * @param {string} initialLetters - The initial letters of the user's name.
 * @param {number} i - The index of the user in the list.
 * @returns {string} The HTML string for displaying the filtered user.
 */
function generateFilteredUserHtml(user, userColor, initialLetters, i) {
  return /*html*/`
  <div id="currentUser${i}" class="userColumn ${isUSerSelected(i) ? 'user-list-active' : ''}" onclick="toggleAddUser(${i})">
    <div class="user-name">
      <span class="letter-icon" style="background-color:${userColor}">${initialLetters}</span>
      <div>${user.name}</div>
    </div>
    <img id="user-checkbox${i}" src="${isUSerSelected(i) ? './assets/img/checkbox_active_white.svg' : './assets/img/checkbox.svg'}" alt="">
  </div>
  `;
}


/**
* Generates HTML for displaying an open user list with their name initials and checkbox.
* @param {object} user - The user object containing user information.
* @param {string} userColor - The color associated with the user.
* @param {string} initialLetters - The initial letters of the user's name.
* @param {number} i - The index of the user in the list.
* @returns {string} The HTML string for displaying the open user list.
*/
function generateOpenUserListHtml(user, userColor, initialLetters, i) {
  return /*html*/`
  <div id="currentUser${i}" class="userColumn ${isUSerSelected(i) ? 'user-list-active' : ''}" onclick="toggleAddUser(${i})">
    <div class="user-name">
      <span class="letter-icon" style="background-color:${userColor}">${initialLetters}</span>
      <div>${user.name}</div>
    </div>
    <img id="user-checkbox${i}" src="${isUSerSelected(i) ? './assets/img/checkbox_active_white.svg' : './assets/img/checkbox.svg'}" alt="">
  </div>
  `;
}


/**
* Generates HTML for displaying a task with options for editing and deleting.
* @param {string} todo - The task to be displayed.
* @param {number} i - The index of the task in the list.
* @returns {string} The HTML string for displaying the task.
*/
function generateTaskHtml(todo, i) {
  return /*html*/`
  <div class="edit-input-style">
      <span id="todo-value-${i}" >${todo}</span>
      <input id="edit-input-${i}" class="edit-input d-none" value="${todo}" onchange="updateTodo(${i}, this.value)">
      </div>
      <div id="show-actions-${i}" class="actions">
        <img src="./assets/img/edit_icon.svg" class="subtask-btn" alt="" onclick="editTodo(${i})">
        <span class="input-options-border"></span>
        <img src="./assets/img/delete_icon.svg" class="subtask-btn" alt="" onclick="deleteTodo(${i})">
      </div>
      <div id="edit-actions-${i}" class="actions-edit d-none">
        <img src="./assets/img/create-subtask.svg" class="subtask-btn" alt="" onclick="saveTodo(${i})">
        <span class="input-options-border"></span>
        <img src="./assets/img/delete_icon.svg" class="subtask-btn" alt="" onclick="deleteTodo(${i})">
      </div>
  </div>
  `;
}
