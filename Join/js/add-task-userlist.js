let users = [];
let selectedUser = [];
let selectedUserList;


/**
 * This function load users from remote storage
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem("users"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}


/**
 * This function filters users in search function
 */
function filterUser() {
    let search = document.getElementById('search-user').value;
    search = search.toLowerCase();
    selectedUserList = document.getElementById('selected-user');;
    let userList = document.getElementById('user-list');
    userList.innerHTML = '';
    if (userList.classList.contains('d-none')) {
        userList.classList.remove('d-none');
    }
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userColor = users[i]['color'];
        let initialLetters = nameInitialLettersAddTasks(user);
        if (user.name.toLowerCase().includes(search)) {
            userList.innerHTML += generateFilteredUserHtml(user, userColor, initialLetters, i); // Hier ist die Änderung
        }
    }
}


/**
 * This function is used to open user list
 * 
 * @param {*} event  
 */
function openUserList(event) {
    selectedUserList = document.getElementById('selected-user');;
    let userList = document.getElementById('user-list');
    let inputIcon = document.getElementById('input-icon');
    if (selectedUser.length >= 1) {
        userList.classList.remove('d-none');
        event.stopPropagation();
        return;
    }
    userList.innerHTML = '';
    if (userList.classList.contains('d-none')) {
        userList.classList.remove('d-none');
        inputIcon.src = './assets/img/arrow_drop_down_2.svg';
    }
    generateUserListHTML(userList);
    event.stopPropagation();
}


/**
 * This function generates HTML for the user list
 * 
 * @param {*} userList 
 */
function generateUserListHTML(userList) {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userColor = users[i]['color'];
        let initialLetters = nameInitialLettersAddTasks(user);
        userList.innerHTML += generateOpenUserListHtml(user, userColor, initialLetters, i);
    }
}


/**
 * this function checks if user is selected
 * 
 * @param {*} i 
 */
function isUSerSelected(i) {
    return selectedUser.some(su => su.id === i)
}


/**
 * This function gets initial letters from users to add to task
 * 
 * @param {*} user 
 */
function nameInitialLettersAddTasks(user) {
    const fullNameSplitt = user.name.split(" ");
    const letters = fullNameSplitt.map(name => name[0]);
    const initialLetters = letters.join("");
    return initialLetters;
}


/**
* This function is used to render the user list
*/
function renderUserList() {
    selectedUserList.innerHTML = '';
    selectedUser.forEach(user => {
        let initialLetters = nameInitialLettersAddTasks(user);
        const userColor = user['color'];
        selectedUserList.innerHTML += /* html */ `
        <div class="user-icon" style="background-color: ${userColor};">${initialLetters}</div>
      `;
    });
}


/**
 * This function is used to select a user for a task by toggeling
 * 
 * @param {*} i 
 */
function toggleAddUser(i) {
    let userColumn = document.getElementById(`currentUser${i}`);
    let user = users[i];
    let selectedUSerIndex = selectedUser.findIndex(u => u.id === i);
    let checkBoxUser = document.getElementById(`user-checkbox${i}`);
    if (selectedUSerIndex === -1) {
        userColumn.classList.add('user-list-active');
        selectedUser.push(user)
        checkBoxUser.src = './assets/img/checkbox_active_white.svg';
    } else {
        userColumn.classList.remove('user-list-active');
        selectedUser.splice(selectedUSerIndex, 1);
        checkBoxUser.src = './assets/img/checkbox.svg';
    }
    renderUserList(i);
    save();
}


/**
   * saves a selected user in local storage
   */
function save() {
    let saveUser = JSON.stringify(selectedUser);
    localStorage.setItem("selectedUser", saveUser);
}


/**
 * this function loads a user for Task
 */
function loadAddTaskUser() {
    let loadUser = localStorage.getItem("selectedUser");
    if (loadUser) {
        selectedUser = JSON.parse(loadUser);
    }
}