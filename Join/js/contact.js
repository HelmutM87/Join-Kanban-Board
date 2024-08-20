let selectedIndex = 0;
loggedInUser = [];

async function initContats() {
    await includeHTML();
    loadContactList();
    activeMenu();
    load();
    loadUserProfile();
}


/**
 * This function is used to initial the contact list.
 */
function initContactList() {
    let container = document.getElementById('contacts_list_container');
    container.innerHTML = '';
    let groupedContacts = groupContactsByFirstLetter(contact_list);
    for (const [letter, contacts] of groupedContacts) {
        container.innerHTML += renderLetterbox(letter);
        for (let i = 0; i < contacts.length; i++) {
            const contact = contacts[i];
            const initials = contact['given_name'][0] + contact['name'][0];
            const backgroundColor = contact['color'] ? `style="background-color: ${contact['color']};"` : 'style="background-color: rgb(209,209,209);"';
            container.innerHTML += renderSnippetBox(contact, backgroundColor);
        }
    }
}


/**
 * This function is used to group the contacts sorted in alphabet.
 * 
 * @param {string} contacts - this are the contacts to be sorted.
 * @returns creates a new Map object containing grouped contacts, filtering out empty groups and sorting them alphabetically.
 */
function groupContactsByFirstLetter(contacts) {
    const groupedContacts = contacts.reduce((map, contact) => {
        const firstLetter = contact.given_name[0].toUpperCase();
        const contactsWithSameLetter = map.get(firstLetter) || [];
        contactsWithSameLetter.push(contact);
        map.set(firstLetter, contactsWithSameLetter);
        return map;
    }, new Map());
    return new Map([...groupedContacts].filter(([letter, contacts]) => contacts.length > 0).sort());
}


/**
 * This function prevents to hide the popup by clicking on the popup.
 * 
 * @param {string} event - this parameter captures the event data.
 */
function doNotClose(event) {
    event.stopPropagation();
}


/**
 * this function is used to select a contact from the contact list.
 * 
 * @param {string} contactId - this is the id from the selected contact
 */
function selectContact(contactId) {
    const selectedContact = contact_list.find(contact => contact.id === contactId);
    const allContactSnippetBoxes = document.querySelectorAll('.contact_list_snippet_box');
    allContactSnippetBoxes.forEach(box => box.classList.remove('contact_list_snippet_box_blue'));
    const selectedContactSnippetBox = document.querySelector(`#contactSnippetBox${contactId}`);
    if (selectedContactSnippetBox) {
        selectedContactSnippetBox.classList.add('contact_list_snippet_box_blue');
    }
    const elements = ['contacts_list_container', 'showContactContainer', 'showContactHeaderBox', 'showContactFooterBox', 'add_contacts_button_box', 'open_sidebar_button'];
    selectedContactIfElseBranch(elements);
    renderContactDetails(selectedContact);
}


/**
 * This function is used to show a selected Contact.
 * 
 * @param {string} elements - this are the elements to add or remove classes to show the contact.
 */
function selectedContactIfElseBranch(elements) {
    document.getElementById('show-contact').classList.add('z_index1');
    elements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            if (elementId === 'contacts_list_container') {
                element.classList.remove('z_index3');
            } else if (elementId === 'showContactContainer' || elementId === 'showContactHeaderBox' || elementId === 'showContactFooterBox') {
                element.classList.add('z_index5');
                if (elementId === 'showContactFooterBox') {
                    element.classList.remove('d-none');
                }
            } else if (elementId === 'add_contacts_button_box') {
                element.classList.remove('z_index4');
            } else if (elementId === 'open_sidebar_button') {
                element.classList.add('z_index6');
            }
        }
    });
}


/**
 * This function is used to rendering an selected contact to show all details.
 * 
 * @param {string} contact - this is the selected contact to render.
 */
function renderContactDetails(contact) {
    const initials = contact['given_name'][0] + contact['name'][0];
    const name = contact['given_name'] + ' ' + contact['name'];
    const e_mail = contact['e-mail'];
    const phone = contact['phone'];

    document.getElementById('showContactContainer').innerHTML = generateContactDetailsHtml(contact);
}


/**
 * This function is used to delete a selected contact from the contact list.
 * 
 * @param {string} contactId - this is the id from the selected contact to be deleted.
 */
function deleteSelectedContact(contactId) {
    const contacts = JSON.parse(localStorage.getItem('contact_list'));
    const selectedIndex = contacts.findIndex(contact => contact.id === contactId);

    if (selectedIndex !== -1) {
        contacts.splice(selectedIndex, 1);
        localStorage.setItem('contact_list', JSON.stringify(contacts));
    }

    loadContactList();
    closeShowContact();
    showContactDeletedConfirmation();
}


/**
 * This function is used to hide the rendered Contact details.
 */
function closeShowContact() {
    document.getElementById('show-contact').classList.remove('z_index1');
    document.getElementById('contacts_list_container').classList.add('z_index3');
    document.getElementById('showContactContainer').classList.remove('z_index5');
    document.getElementById('showContactHeaderBox').classList.remove('z_index5');
    document.getElementById('showContactFooterBox').classList.remove('z_index5');
    document.getElementById('showContactFooterBox').classList.add('d-none');
    document.getElementById('add_contacts_button_box').classList.add('z_index4');
    const allContactSnippetBoxes = document.querySelectorAll('.contact_list_snippet_box');
    allContactSnippetBoxes.forEach(box => {
        box.classList.remove('contact_list_snippet_box_blue');
    });
}


/**
 * This function is used to show a confirmation-button when a contact is created or edited.
 */
function showContactCreatedConfirmation() {
    document.getElementById('confirmation_container').classList.remove('d-none');
    setTimeout(hideContactCreatedConfirmation, 1400);
}


/**
 * This function is used to hide the saved-confirmation-button.
 */
function hideContactCreatedConfirmation() {
    document.getElementById('confirmation_container').classList.add('d-none');
}


/**
 * This function is used to show a confirmation-button when a contact is deleted.
 */
function showContactDeletedConfirmation() {
    document.getElementById('delete_confirmation_container').classList.remove('d-none');
    setTimeout(hideContactDeletedConfirmation, 1400);
}


/**
 * This function is used to hide the deleted-confirmation-button.
 */
function hideContactDeletedConfirmation() {
    document.getElementById('delete_confirmation_container').classList.add('d-none');
}


/**
 * this function is used to load the Contact list.
 */
function loadContactList() {
    if (!localStorage.getItem('contact_list')) {
        localStorage.setItem('contact_list', JSON.stringify(contact_list));
    }

    let contactListAsString = localStorage.getItem('contact_list');
    contact_list = JSON.parse(contactListAsString);
    initContactList();
}