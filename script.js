document.addEventListener("DOMContentLoaded", function () {



//--------------------------------------------------------------------------------Loading Overly---------------------------------------------------------//


var loadingOverlay = document.getElementById('loading-overlay');
showLoadingOverlay();


function showLoadingOverlay() {
    loadingOverlay.style.display = 'flex';
}

function hideLoadingOverlay() {
    loadingOverlay.style.display = 'none';
}


//--------------------------------------------------------------------------------User Signin status---------------------------------------------------------//

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        const userName = user.displayName;
        displayTransactions();
        displayCropInspections();
        displayPrescriptions();

        // Pass user to getUserData function
        getUserData(user);

        document.getElementById('userNameLink').textContent = userName; 
        document.getElementById('userNameGreetings').textContent = userName; 
        hideLoadingOverlay();
    } else {
        // User is not signed in
        hideLoadingOverlay(); 
        window.location.href = 'login.html';
    }
});
//--------------------------------------------------------------------------------Greeting Update---------------------------------------------------------//

function getGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return 'Good Morning!';
  } else if (currentHour >= 12 && currentHour < 16) {
    return 'Good Afternoon!';
  } else if (currentHour >= 16 && currentHour < 20) {
    return 'Good Evening!';
  } else {
    return 'Good Night!';
  }
}
document.getElementById('greeting').textContent = getGreeting();

//--------------------------------------------------------------------------------Dark Mode---------------------------------------------------------//

const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode === "dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus === "close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
});

//--------------------------------------------------------------------------------Logout---------------------------------------------------------//

document.getElementById('signoutbtn').addEventListener('click', logout);

document.getElementById('logoutBtn').addEventListener('click', logout);
// Assuming you have initialized Firebase previously

// Get a reference to the Firebase Authentication service
var auth = firebase.auth();

// Function to handle logout
function logout() {
    showLoadingOverlay(); // Call the showLoadingOverlay function before starting the logout process

    auth.signOut().then(function() {
        // Sign-out successful.
        console.log('User logged out successfully');
        // You can redirect the user to a login page or perform any other actions after logout.
    }).catch(function(error) {
        // An error happened.
        console.error('Error during logout:', error);
    });
}


//--------------------------------------------------------------------------------Minu-link and load to dash-content---------------------------------------------------------//

// Get all elements with the class "menu-link"
var menuLinks = document.querySelectorAll('.menu-link');

// Get all elements with the class "dash-content"
var dashContents = document.querySelectorAll('.dash-content');

// Function to show the content based on the URL hash
function showContentFromHash() {
    var currentHash = window.location.hash;
    var targetId = currentHash.substring(1);

    // Remove "active" class from all menu links
    menuLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });

    // Show the corresponding dash content based on the current URL
    dashContents.forEach(function(content) {
        content.style.display = content.id === targetId || (!currentHash && content.id === 'dashboard-content') ? 'block' : 'none';
    });
}

// Add a click event listener to each menu link
menuLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
        // Prevent the default behavior of the link
        event.preventDefault();

        // Get the href value of the clicked link
        var targetId = link.getAttribute('href').substring(1);

        // Hide all dash contents
        dashContents.forEach(function(content) {
            content.style.display = 'none';
        });

        // Show the corresponding dash content based on the clicked link
        var targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.style.display = 'block';
        }

        // Update the URL without reloading the page
        history.pushState(null, null, '#' + targetId);

        // Update the content based on the URL hash
        showContentFromHash();
        toggleSearchBox();
    });
});

// Listen for changes to the URL
window.addEventListener('popstate', showContentFromHash);

// Show content based on the initial URL on page load
showContentFromHash();

// Update the URL when loaded without a hash
if (!window.location.hash) {
    window.location.replace('#dashboard');
}


// Listen for changes to the URL
window.addEventListener('popstate', showContentFromHash);

// Show content based on the initial URL on page load
showContentFromHash();

//--------------------------------------------------------------------------------Slidein PopUp--------------------------------------------------------//
var isPopupVisible = false;

function showPopup(message, isSuccess) {
    var popup = document.querySelector('.popup');
    var popupContent = document.getElementById('popupContent');

    // If the popup is currently visible, return
    if (isPopupVisible) {
        return;
    }

    // Set popup content and style based on success or error
    popupContent.textContent = message;

    if (isSuccess) {
        popupContent.style.backgroundColor = 'var(--green)';
    } else {
        popupContent.style.backgroundColor = 'var(--red)'; // Set your error color
    }

    // Show the popup with slide-in animation
    popup.classList.remove('slide-out'); // Remove slide-out class if present
    popup.classList.add('slide-in');
    popup.style.display = 'flex';
    isPopupVisible = true;

    // Hide the popup after 3 seconds with slide-out animation
    setTimeout(function () {
        // Hide the popup with slide-out animation
        popup.classList.remove('slide-in');
        popup.classList.add('slide-out');

        // Reset the flag and classes when the popup is hidden
        setTimeout(function () {
            popup.style.display = 'none';
            isPopupVisible = false;
            popup.classList.remove('slide-out');
        }, 300);
    }, 3000);
}





//--------------------------------------------------------------------------------vaidate add Trasaction form---------------------------------------------------------//

const form = document.getElementById('transaction-form');
const titleInput = document.getElementById('expenseTitle');
const dateInput = document.getElementById('expenseDate');
const amountInput = document.getElementById('expenseAmount');
const remarksInput = document.getElementById('expenseRemarks');
const addButton = document.getElementById('addTransactionBtn');

// Add event listeners to form elements for input validation
titleInput.addEventListener('input', validateForm);
dateInput.addEventListener('input', validateForm);
amountInput.addEventListener('input', validateForm);
remarksInput.addEventListener('input', validateForm);

// Function to validate the form and enable/disable the button
function validateForm() {
    const isFormValid = form.checkValidity();
    addButton.disabled = !isFormValid;
}

// Function to add a transaction
const transactionForm = document.getElementById("transaction-form");

transactionForm.addEventListener("submit", function (event) {
event.preventDefault();
addTransaction();
});

function clearForm(formId) {
    document.getElementById(formId).reset();
    const addButtonId =
        formId === 'transaction-form' 
            ? 'addTransactionBtn' 
            : formId === 'prescription-form' 
                ? 'addPrescription' 
                : 'addInspection';
    document.getElementById(addButtonId).disabled = true;
}


//--------------------------------------------------------------------------------add Trasaction---------------------------------------------------------//


function addTransaction() {
    showLoadingOverlay();
    const title = document.getElementById('expenseTitle').value;
    const date = document.getElementById('expenseDate').value;
    const amountInput = document.getElementById('expenseAmount');
    const remarks = document.getElementById('expenseRemarks').value;
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    // Get the raw value from the input
    let amount = parseFloat(amountInput.value);

    // If the toggle switch is checked, store the amount as positive; otherwise, store as negative
    amount = toggleSwitch.checked ? Math.abs(amount) : -Math.abs(amount);

    const userId = firebase.auth().currentUser.uid;

    // Reference to the "transactions" collection for the current user
    const transactionsRef = db.collection("users").doc(userId).collection("transactions");

    // Add expense data to Firestore
    transactionsRef.add({
        title: title,
        date: date,
        amount: amount,
        remarks: remarks,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Transaction added to Firestore");
        hideLoadingOverlay();
        clearForm('transaction-form'); 
        showPopup('Transaction added successfully!', true);
        displayTransactions();
    })
    .catch((error) => {
        hideLoadingOverlay(); 
        showPopup('Error adding transaction. Please try again.', false);
        console.error("Error adding transaction to Firestore:", error);
    });
}


//--------------------------------------------------------------------------------Display Trasaction---------------------------------------------------------//
// Function to display recent transactions
function displayRecentTransactions(querySnapshot) {
    const recentTableBody = document.getElementById('recentTransactionsTable').tBodies[0];

    // Clear existing rows
    recentTableBody.innerHTML = "";

    if (querySnapshot.empty) {
        // Display a message when there are no recent transactions
        const noTransactionsRow = recentTableBody.insertRow();
        const noTransactionsCell = noTransactionsRow.insertCell(0);
        noTransactionsCell.colSpan = 6;
        noTransactionsCell.textContent = 'No transactions to display';
    } else {
        querySnapshot.forEach((doc) => {
            const transactionData = doc.data();
            const row = recentTableBody.insertRow();

            // Add columns to the row
            const statusCell = row.insertCell(0);
            const dateCell = row.insertCell(1);
            const titleCell = row.insertCell(2);
            const amountCell = row.insertCell(3);
            const remarksCell = row.insertCell(4);
            const addedDateCell = row.insertCell(5);

            // Set values to the cells
            statusCell.innerHTML = transactionData.amount > 0
                ? '<i class="uil uil-arrow-down-right" style="color:#6DD64D"></i>'
                : '<i class="uil uil-arrow-up-left" style="color:#FF4842"></i>';

            dateCell.textContent = formatDate(transactionData.date);
            titleCell.textContent = transactionData.title;
            const absAmount = Math.abs(transactionData.amount);
            amountCell.innerHTML = absAmount;
            amountCell.style.color = transactionData.amount > 0 ? '#6DD64D' : '#FF4842';
            remarksCell.textContent = transactionData.remarks;
            addedDateCell.textContent = formatTimestamp(transactionData.timestamp);
        });
    }
}

// Function to display all transactions
function displayAllTransactions(querySnapshot) {
    const allTableBody = document.getElementById('allTransactionsTable').querySelector('tbody');

    // Clear existing rows
    allTableBody.innerHTML = "";

    if (querySnapshot.empty) {
        const noTransactionsRow = allTableBody.insertRow();
        const noTransactionsCell = noTransactionsRow.insertCell(0);
        noTransactionsCell.colSpan = 9;
        noTransactionsCell.textContent = 'No transactions to display';
    } else {
        querySnapshot.forEach((doc) => {
            const transactionData = doc.data();
            const transactionId = doc.id;
            const row = allTableBody.insertRow();
            row.setAttribute('data-transaction-id', transactionId); // Add this line to set transaction ID to the row

            const selectCell = row.insertCell(0);
            const statusCell = row.insertCell(1);
            const dateCell = row.insertCell(2);
            const titleCell = row.insertCell(3);
            const amountCell = row.insertCell(4);
            const remarksCell = row.insertCell(5);
            const addedDateCell = row.insertCell(6);
            const editCell = row.insertCell(7);
            const deleteCell = row.insertCell(8);

            // Add checkboxes for selection
            const selectCheckbox = document.createElement('input');
            selectCheckbox.type = 'checkbox';
            selectCheckbox.setAttribute('data-transaction-id', transactionId);
            selectCell.appendChild(selectCheckbox);

            // Set values to the cells
            statusCell.innerHTML = transactionData.amount > 0
                ? '<i class="uil uil-arrow-down-right" style="color:#6DD64D"></i>'
                : '<i class="uil uil-arrow-up-left" style="color:#FF4842"></i>';
            dateCell.textContent = formatDate(transactionData.date);
            titleCell.textContent = transactionData.title;
            const absAmount = Math.abs(transactionData.amount);
            amountCell.innerHTML = absAmount;
            amountCell.style.color = transactionData.amount > 0 ? '#6DD64D' : '#FF4842';
            remarksCell.textContent = transactionData.remarks;
            addedDateCell.textContent = formatTimestamp(transactionData.timestamp);

            // Add "Edit" button with icon
            const editButton = document.createElement('button');
            editButton.id = `editButton_${doc.id}`;
            editButton.innerHTML = '<i class="uil uil-edit"></i>';
            editButton.addEventListener('click', () => handleEditTransaction(doc.id));
            editCell.appendChild(editButton);

            // Add "Delete" button with icon
            const deleteButton = document.createElement('button');
            deleteButton.id = `deleteButton_${doc.id}`;
            deleteButton.innerHTML = '<i class="uil uil-trash"></i>';
            deleteButton.addEventListener('click', () => handleDeleteTransaction(doc.id));
            deleteCell.appendChild(deleteButton);
        });
    }
}


// Function to calculate and display totals
function calculateAndDisplayTotals(querySnapshot) {
    let totalTransactions = 0;
    let totalCredit = 0;
    let totalDebit = 0;

    querySnapshot.forEach((doc) => {
        totalTransactions++;
        const transactionData = doc.data();
        if (transactionData.amount > 0) {
            totalCredit += transactionData.amount;
        } else {
            totalDebit += Math.abs(transactionData.amount);
        }
    });

    document.getElementById('totalTransactions').textContent = totalTransactions;
    document.getElementById('totalCredit').textContent = totalCredit;
    document.getElementById('totalDebit').textContent = totalDebit;
    animateCounter('totalDebit', 0, totalDebit, 100);
    animateCounter('totalCredit', 0, totalCredit, 100);
    animateCounter('totalTransactions', 0, totalTransactions, 200);
}

// Function to display transactions
function displayTransactions() {
    const userId = firebase.auth().currentUser.uid;
    const transactionsRef = db.collection("users").doc(userId).collection("transactions");

    // Fetch recent and all transactions
    transactionsRef.orderBy("timestamp", "desc").limit(10).get()
        .then((recentQuerySnapshot) => {
            const allTransactionsQuery = transactionsRef.orderBy("timestamp", "desc").get();

            Promise.all([recentQuerySnapshot, allTransactionsQuery])
                .then(([recentQuerySnapshot, allQuerySnapshot]) => {
                    displayRecentTransactions(recentQuerySnapshot);
                    displayAllTransactions(allQuerySnapshot);
                    calculateAndDisplayTotals(allQuerySnapshot);
                })
                .catch((error) => {
                    console.error("Error fetching transactions from Firestore:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching recent transactions from Firestore:", error);
        });
}





//--------------------------------------------------------------------------------Update Trasaction---------------------------------------------------------//
function handleEditTransaction(transactionId) {
    const userId = firebase.auth().currentUser.uid;
    const transactionRef = db.collection("users").doc(userId).collection("transactions").doc(transactionId);

    // Fetch the transaction details
    transactionRef.get()
        .then((doc) => {
            if (doc.exists) {
                const transactionData = doc.data();
                replaceTableCellsWithInputs(transactionId, transactionData);

            } else {
                console.log("Transaction not found");
            }
        })
        .catch((error) => {
            console.error("Error fetching transaction details:", error);
        });
}


function replaceTableCellsWithInputs(transactionId, transactionData) {
    const tableRow = document.querySelector(`[data-transaction-id="${transactionId}"]`);
    
    if (!tableRow) {
        console.error(`Table row not found for transactionId ${transactionId}`);
        return;
    }

    const fieldNames = ['date', 'title', 'amount', 'remarks'];

    for (let i = 2; i <= 5; i++) {
        const cell = tableRow.cells[i];
        if (i === 0 && cell.firstChild && cell.firstChild.type === 'checkbox') continue;

        const fieldName = fieldNames[i - 2];
        const inputType = i === 2 ? 'text' : 'text';
        const inputValue = transactionData[fieldName];

        cell.setAttribute('data-field-name', fieldName);
        cell.innerHTML = `<input type="${inputType}" id="edit${capitalizeFirstLetter(fieldName)}_${transactionId}" value="${inputValue}">`;
    }
        const saveButton = document.createElement('button');
        saveButton.id = `editButton_${transactionId}`;
        saveButton.innerHTML = '<i class="uil uil-save"></i>';
        saveButton.addEventListener('click', () => saveEditedTransaction(transactionId));

        const cancelButton = document.createElement('button');
        cancelButton.id = `deleteButton_${transactionId}`;
        cancelButton.innerHTML = '<i class="uil uil-times-circle"></i>';
        cancelButton.addEventListener('click', () => cancelEditTransaction(transactionId,transactionData));

        tableRow.cells[tableRow.cells.length - 2].innerHTML = '';
        tableRow.cells[tableRow.cells.length - 2].appendChild(saveButton);

        tableRow.cells[tableRow.cells.length - 1].innerHTML = ''; 
        tableRow.cells[tableRow.cells.length - 1].appendChild(cancelButton);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function cancelEditTransaction(transactionId, transactionData) {
    const tableRow = document.querySelector(`[data-transaction-id="${transactionId}"]`);

    if (!tableRow) {
        console.error(`Table row not found for transactionId ${transactionId}`);
        return;
    }

    const fieldNames = ['date', 'title', 'amount', 'remarks'];

    // Check if transactionData is defined and has the expected properties
    if (transactionData && typeof transactionData === 'object') {
        for (let i = 2; i <= 5; i++) {
            const cell = tableRow.cells[i];

            // Get the original value from the data-field-name attribute
            const fieldName = fieldNames[i - 2];

            // Check if the property exists in transactionData
            if (transactionData.hasOwnProperty(fieldName)) {
                const originalValue = transactionData[fieldName];

                // Set the cell content back to the original value
                cell.innerHTML = originalValue;
            } else {
                console.error(`Property '${fieldName}' not found in transactionData`);
            }
        }
    } else {
        console.error('Invalid or undefined transactionData');
    }

    // Restore the original edit and delete buttons
    const editButton = document.createElement('button');
    editButton.id = `editButton_${transactionId}`;
    editButton.innerHTML = '<i class="uil uil-pen"></i>';
    editButton.addEventListener('click', () => replaceTableCellsWithInputs(transactionId, transactionData));

    const deleteButton = document.createElement('button');
    deleteButton.id = `deleteButton_${transactionId}`;
    deleteButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
    deleteButton.addEventListener('click', () => deleteTransaction(transactionId));

    tableRow.cells[tableRow.cells.length - 2].innerHTML = '';
    tableRow.cells[tableRow.cells.length - 2].appendChild(editButton);

    tableRow.cells[tableRow.cells.length - 1].innerHTML = '';
    tableRow.cells[tableRow.cells.length - 1].appendChild(deleteButton);
}







function saveEditedTransaction(transactionId) {
    showLoadingOverlay();
    const userId = firebase.auth().currentUser.uid;
    const transactionsRef = firestore.collection('users').doc(userId).collection('transactions');

    const tableRow = document.querySelector(`[data-transaction-id="${transactionId}"]`);
    if (!tableRow) {
        console.error(`Table row not found for transactionId ${transactionId}`);
        return;
    }

    // Get the transaction ID directly from the row's data attribute
    const transactionIdToUpdate = tableRow.getAttribute('data-transaction-id');

    const updatedValues = {};

   // Iterate over the input fields within the table row
    tableRow.querySelectorAll('[data-field-name]').forEach((input) => {
        const fieldName = input.getAttribute('data-field-name');
        const value = document.getElementById(`edit${capitalizeFirstLetter(fieldName)}_${transactionId}`).value;
        console.log(`${fieldName}: ${value}`);
        updatedValues[fieldName] = value;
    });

        const updatedData = {
        title: updatedValues['title'],
        date: updatedValues['date'],
        amount: parseFloat(updatedValues['amount']),
        remarks: updatedValues['remarks'],
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Update the transaction in Firestore
    transactionsRef.doc(transactionIdToUpdate).update(updatedData)
        .then(() => {
            displayTransactions();
            hideLoadingOverlay();
            showPopup("Transaction updated successfully",true);
        })
        .catch((error) => {
            showPopup("Error updating transaction in Firestore",false);
            console.error("Error updating transaction in Firestore:", error);
        });
}
 
//--------------------------------------------------------------------------------------Delete transaction----------------------------------------------//
const firestore = firebase.firestore();
// Function to delete a transaction from Firestore
function handleDeleteTransaction(transactionId) {
    showLoadingOverlay();
    const userId = firebase.auth().currentUser.uid;
    const transactionsRef = firestore.collection('users').doc(userId).collection('transactions');

    transactionsRef.doc(transactionId).delete()
        .then(() => {
            displayTransactions();
            hideLoadingOverlay();
            showPopup('Transaction deleted successfully.', true);

            console.log(`Transaction with ID ${transactionId} deleted successfully.`);
            // Optionally, you may want to update the UI or perform additional actions after deletion
            
        })
        .catch(error => {
            hideLoadingOverlay();
            console.error('Error deleting transaction:', error);
            // Handle errors, display an error message, or take appropriate action
            showPopup('Error deleting transaction. Please try again.', false);
        });
}

//--------------------------------------------------------------------------------------Select all function----------------------------------------------//

let isAllSelected = false;

    // Toggle Select All button
    const toggleSelectAllBtn = document.getElementById('toggleSelectAllBtn');
    toggleSelectAllBtn.addEventListener('click', toggleSelectAll);

    // Delete Selected button
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    deleteSelectedBtn.addEventListener('click', deleteSelected);


function toggleSelectAll() {
    const visibleRows = document.querySelectorAll('#allTransactionsTable tbody tr[style="display: table-row;"]');

    visibleRows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]:not(:disabled)');
        if (checkbox) {
            checkbox.checked = !isAllSelected;
        }
    });

    // Toggle the state
    isAllSelected = !isAllSelected;
    deleteSelectedBtn.disabled = !isAllSelected;
}


// Function to delete selected transactions
function deleteSelected() {
    const checkboxes = document.querySelectorAll('#allTransactionsTable tbody input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
        showPopup('No transactions selected.', false);
        return;
    }

    const confirmed = confirm('Are you sure you want to delete the selected transactions?');

    if (confirmed) {
        checkboxes.forEach(checkbox => {
            const transactionId = checkbox.getAttribute('data-transaction-id');
            
            // Implement your logic to delete the selected transaction using the transactionId
            handleDeleteTransaction(transactionId);
        });
    }
}


//--------------------------------------------------------------------------------format date---------------------------------------------------------//

function formatDate(date) {
    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-GB', options).replace(/\//g, '-');
}

function formatTimestamp(timestamp) {
    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return timestamp.toDate().toLocaleDateString('en-GB', options).replace(/\//g, '-');
}

//--------------------------------------------------------------------------------counterup animation---------------------------------------------------------//

function animateCounter(targetId, startValue, endValue, duration) {
            const element = document.getElementById(targetId);
            const increment = (endValue - startValue) / duration;
            let currentValue = startValue;

            function updateCounter() {
                currentValue += increment;
                element.textContent = Math.round(currentValue);

                if (currentValue < endValue) {
                    requestAnimationFrame(updateCounter);
                }
            }

            updateCounter();
        }
//--------------------------------------------------------------------------------search animation---------------------------------------------------------//

function toggleSearchBox() {
    const activeLinks = document.querySelectorAll('.menu-link');
    const searchBox = document.getElementById('searchBox');
    const searchInput = document.getElementById('searchInput');
    let shouldDisplaySearchBox = false;

    activeLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (link.classList.contains('active') && (href === '#view-transactions' || href === '#view-pesticides')) {
            shouldDisplaySearchBox = true;
            searchInput.value = ''; // Clear the value of the searchInput

            // Trigger the filtering logic immediately after clearing the input
            const tableId = getTableIdByHash(href);
            filterTableRows(tableId, searchInput.value.toLowerCase());
        }
    });

    searchBox.style.visibility = shouldDisplaySearchBox ? 'visible' : 'hidden';
}

toggleSearchBox();

// JavaScript code to filter table rows based on search input
document.getElementById('searchInput').addEventListener('input', function () {
    const activeTableId = getActiveTableId();
    filterTableRows(activeTableId, this.value.toLowerCase());
});

function filterTableRows(tableId, query) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);

    rows.forEach(row => {
        const visible = Array.from(row.cells).some(cell => cell.textContent.toLowerCase().includes(query));
        row.style.display = visible ? 'table-row' : 'none';
    });
}

function getActiveTableId() {
    const activeLinks = document.querySelectorAll('.menu-link.active');
    const currentHash = activeLinks.length > 0 ? activeLinks[0].getAttribute('href') : '';
    return getTableIdByHash(currentHash);
}

function getTableIdByHash(hash) {
    switch (hash) {
        case '#view-transactions':
            return 'allTransactionsTable';
        case '#view-pesticides':
            return 'prescriptionTable'; // Change this to the appropriate ID for pesticides table
        // Add more cases if you have other tables
        default:
            return ''; // Return the default table ID
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Get the current URL
    const currentURL = window.location.href;

    // Extract the hash value from the URL
    const hashIndex = currentURL.indexOf('#');
    const currentHash = hashIndex !== -1 ? currentURL.substring(hashIndex) : '';

    // Find the corresponding menu link and add the "active" class
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });
});


//--------------------------------------------------------------------------------------Add Prescriptons----------------------------------------------//
const prescriptionForm = document.getElementById('prescriptionForm');
const pesticideNameInput = document.getElementById('pesticideName');
const gramPerMLInput = document.getElementById('gramPerML');
const prescriptionDateInput = document.getElementById('prescriptionDate');
const prescriptionDescriptionInput = document.getElementById('prescriptionDescription');
const addPrescriptionButton = document.getElementById('addPrescription');

// Add event listeners to form elements for input validation
pesticideNameInput.addEventListener('input', validatePrescriptionForm);
gramPerMLInput.addEventListener('input', validatePrescriptionForm);
prescriptionDateInput.addEventListener('input', validatePrescriptionForm);
prescriptionDescriptionInput.addEventListener('input', validatePrescriptionForm);

// Function to validate the prescription form and enable/disable the button
function validatePrescriptionForm() {
    const isFormValid = prescriptionForm.checkValidity();
    addPrescriptionButton.disabled = !isFormValid;
}

// Function to add a prescription
prescriptionForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addPrescription();
});

function addPrescription() {
    showLoadingOverlay();
    const pesticideName = pesticideNameInput.value;
    const gramPerML = gramPerMLInput.value;
    const prescriptionDate = prescriptionDateInput.value;
    const description = prescriptionDescription.value; // Change this line to get the description

    const userId = firebase.auth().currentUser?.uid; // Use optional chaining


    // Reference to the "prescriptions" collection for the current user
    const prescriptionsRef = db.collection("users").doc(userId).collection("prescriptions");

    // Add prescription data to Firestore
    prescriptionsRef.add({
        pesticideName: pesticideName,
        gramPerML: gramPerML,
        prescriptionDate: prescriptionDate,
        description: description, // Add the description to the prescription data
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Prescription added to Firestore with ID:", docRef.id);
        displayPrescriptions();
        hideLoadingOverlay();
        clearForm('prescriptionForm');
        showPopup('Prescription added successfully!', true);
        // Additional logic as needed
    })
    .catch((error) => {
        hideLoadingOverlay();
        showPopup('Error adding prescription. Please try again.', false);
        console.error("Error adding prescription to Firestore:", error);
    });
}
document.getElementById('refreshButton').addEventListener('click', function() {
    location.reload(); // This will reload the page
});


//--------------------------------------------------------------------------------------Crop Inspection----------------------------------------------//
const inspectionForm = document.getElementById('cropInspectionForm');
const inspectionDateInput = document.getElementById('inspectionDate');
const doctorNameInput = document.getElementById('doctorName'); // New line
const inspectionFileInput = document.getElementById('inspectionFile');
const addInspectionButton = document.getElementById('addInspection');

inspectionDateInput.addEventListener('input', validateInspectionForm);
doctorNameInput.addEventListener('input', validateInspectionForm); // New line
inspectionFileInput.addEventListener('change', validateInspectionForm);

function validateInspectionForm() {
    const isFormValid = inspectionForm.checkValidity();
    addInspectionButton.disabled = !isFormValid;
}

inspectionForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addInspection();
});

function addInspection() {
    showLoadingOverlay();
    const inspectionDate = inspectionDateInput.value;
    const doctorName = doctorNameInput.value; // New line
    const inspectionFile = inspectionFileInput.files[0];
    const userId = firebase.auth().currentUser?.uid;

    // Reference to the "inspections" collection for the current user
    const inspectionsRef = db.collection("users").doc(userId).collection("inspections");

    // Create a storage reference for the file
    const storageRef = firebase.storage().ref().child(`inspections/${userId}/${inspectionDate}_${inspectionFile.name}`);

    // Upload the file to storage
    storageRef.put(inspectionFile)
        .then((snapshot) => {
            // Get the download URL for the file
            return snapshot.ref.getDownloadURL();
        })
        .then((downloadURL) => {
            // Add inspection data to Firestore with the file URL
            return inspectionsRef.add({
                doctorName: doctorName, // New line
                inspectionDate: inspectionDate,
                inspectionFileURL: downloadURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then((docRef) => {
            console.log("Inspection added to Firestore with ID:", docRef.id);
            displayCropInspections();
            hideLoadingOverlay();
            clearForm('cropInspectionForm');
            showPopup('Inspection added successfully!', true);

            // Additional logic as needed
        })
        .catch((error) => {
            hideLoadingOverlay();
            showPopup('Error adding inspection. Please try again.', false);
            console.error("Error adding inspection to Firestore:", error);
        });
}

//--------------------------------------------------------------------------------------Display Crop Inspection----------------------------------------------//
// Function to display recent crop inspections
function displayRecentCropInspections(querySnapshot) {
    const recentCropInspectionsTableBody = document.getElementById('recentCropInspectionsTable').querySelector('tbody');

    // Clear existing rows
    recentCropInspectionsTableBody.innerHTML = "";

    if (querySnapshot.empty) {
        const noInspectionsRow = recentCropInspectionsTableBody.insertRow();
        const noInspectionsCell = noInspectionsRow.insertCell(0);
        noInspectionsCell.colSpan = 3;
        noInspectionsCell.textContent = 'No crop inspections to display';
        noInspectionsCell.style.textAlign = 'center';
    } else {
        querySnapshot.forEach((doc) => {
            const inspectionData = doc.data();
            const inspectionId = doc.id;
            const row = recentCropInspectionsTableBody.insertRow();
            row.setAttribute('data-inspection-id', inspectionId); // Add this line to set inspection ID to the row

            const dateCell = row.insertCell(0);
            const doctorNameCell = row.insertCell(1);
            const fileCell = row.insertCell(2);

            // Set values to the cells
            dateCell.textContent = formatDate(inspectionData.inspectionDate);
            doctorNameCell.textContent = inspectionData.doctorName;

            // Create a button element dynamically
            const openModalBtn = document.createElement('a');
            openModalBtn.className = "button-link";
            openModalBtn.innerHTML = '<i class="uil-file-alt"></i>';

            // Attach an event listener to the button
            openModalBtn.addEventListener('click', function() {
                openCustomModal(inspectionData.inspectionFileURL);
            });

            // Append the button to the fileCell
            fileCell.appendChild(openModalBtn);
        });
    }
}

// Function to open the custom modal
function openCustomModal(imageUrl) {
    const modal = document.getElementById('customModal');
    const modalImage = document.getElementById('modalImage');

    modalImage.src = imageUrl;
    modal.style.display = 'flex';

    // Attach an event listener to the close button
    document.getElementById('closeModalBtn').addEventListener('click', closeCustomModal);
}

// Function to close the custom modal
function closeCustomModal() {
    const modal = document.getElementById('customModal');
    modal.style.display = 'none';
}


// Function to calculate and display totals for crop inspections
function calculateAndDisplayCropInspectionTotals(querySnapshot) {
    let totalCropInspections = 0;

    querySnapshot.forEach((doc) => {
        totalCropInspections++;
    });

    document.getElementById('totalCropInspections').textContent = totalCropInspections;
    animateCounter('totalCropInspections', 0, totalCropInspections, 100);
}

function displayAllCropInspections(querySnapshot) {
    const allCropInspectionsTableBody = document.getElementById('inspectionTable').querySelector('tbody');

    // Clear existing rows
    allCropInspectionsTableBody.innerHTML = "";

    if (!querySnapshot || querySnapshot.size === 0) {
        const noInspectionsRow = allCropInspectionsTableBody.insertRow();
        const noInspectionsCell = noInspectionsRow.insertCell(0);
        noInspectionsCell.colSpan = 5; // Adjust the colspan based on the number of columns
        noInspectionsCell.textContent = 'No crop inspections to display';
        noInspectionsCell.style.textAlign = 'center';
    } else {
        let serialNumber = querySnapshot.size; // Initialize the serial number counter with the total count

        querySnapshot.forEach((doc) => {
            const inspectionData = doc.data();
            const inspectionId = doc.id;
            const row = allCropInspectionsTableBody.insertRow();
            row.setAttribute('data-inspection-id', inspectionId);

            const slNoCell = row.insertCell(0);
            const dateCell = row.insertCell(1);
            const doctorNameCell = row.insertCell(2);
            const fileCell = row.insertCell(3);
            const deleteCell = row.insertCell(4);

            // Set serial number to the cell
            slNoCell.textContent = serialNumber--;

            // Set values to the cells
            dateCell.textContent = formatDate(inspectionData.inspectionDate);
            doctorNameCell.textContent = inspectionData.doctorName;

            // Create a button element dynamically for opening modal
            const openModalBtn = document.createElement('a');
            openModalBtn.className = "button-link";
            openModalBtn.innerHTML = '<i class="uil-file-alt"></i>';

            // Attach an event listener to the button
            openModalBtn.addEventListener('click', function() {
                openCustomModal(inspectionData.inspectionFileURL);
            });

            // Append the button to the fileCell
            fileCell.appendChild(openModalBtn);

            // Add "Delete" button with icon
            const deleteButton = document.createElement('button');
            deleteButton.id = `deleteButton_${inspectionId}`;
            deleteButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
            deleteButton.addEventListener('click', () => handleDeleteInspection(inspectionId));
            deleteCell.appendChild(deleteButton);
        });
    }
}




// Function to display crop inspections
function displayCropInspections() {
    const userId = firebase.auth().currentUser.uid;
    const inspectionsRef = db.collection("users").doc(userId).collection("inspections");

    // Fetch recent and all crop inspections
    inspectionsRef.orderBy("inspectionDate", "desc").limit(3).get()
        .then((recentQuerySnapshot) => {
            const allCropInspectionsQuery = inspectionsRef.orderBy("inspectionDate", "desc").get();

            Promise.all([recentQuerySnapshot, allCropInspectionsQuery])
                .then(([recentQuerySnapshot, allQuerySnapshot]) => {
                    displayRecentCropInspections(recentQuerySnapshot);
                    displayAllCropInspections(allQuerySnapshot);
                    calculateAndDisplayCropInspectionTotals(allQuerySnapshot);
                })
                .catch((error) => {
                    console.error("Error fetching crop inspections from Firestore:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching recent crop inspections from Firestore:", error);
        });
}






function handleDeleteInspection(inspectionId) {
    const userId = firebase.auth().currentUser.uid;
    const inspectionsRef = db.collection("users").doc(userId).collection("inspections");

    // Get the inspection data to retrieve the file URL
    inspectionsRef.doc(inspectionId).get()
        .then((doc) => {
            const inspectionData = doc.data();
            const fileURL = inspectionData.inspectionFileURL;

            // Delete the inspection document from Firestore
            return inspectionsRef.doc(inspectionId).delete()
                .then(() => {
                    console.log("Inspection document deleted successfully");

                    // Delete the associated image from Storage
                    const storageRef = firebase.storage().refFromURL(fileURL);
                    return storageRef.delete()
                        .then(() => {
                            console.log("Inspection image deleted successfully");

                            // Refresh the displayed inspections
                            displayCropInspections();

                            showPopup("Inspection deleted successfully", true);
                        })
                        .catch((error) => {
                            console.error("Error deleting inspection image from Storage:", error);
                            showPopup("Error deleting inspection image", false);
                        });
                })
                .catch((error) => {
                    console.error("Error deleting inspection document from Firestore:", error);
                    showPopup("Error deleting inspection document", false);
                });
        })
        .catch((error) => {
            console.error("Error retrieving inspection data from Firestore:", error);
            showPopup("Error retrieving inspection data", false);
        });
}


function displayAllPrescriptions(querySnapshot) {
    const allPrescriptionsTableBody = document.getElementById('prescriptionTable').querySelector('tbody');

    // Clear existing rows
    allPrescriptionsTableBody.innerHTML = "";

    if (!querySnapshot || querySnapshot.size === 0) {
        const noPrescriptionsRow = allPrescriptionsTableBody.insertRow();
        const noPrescriptionsCell = noPrescriptionsRow.insertCell(0);
        noPrescriptionsCell.colSpan = 6; // Adjust the colspan based on the number of columns
        noPrescriptionsCell.textContent = 'No prescriptions to display';
        noPrescriptionsCell.style.textAlign = 'center';
    } else {
        let serialNumber = querySnapshot.size; // Initialize the serial number counter with the total count

        querySnapshot.forEach((doc) => {
            const prescriptionData = doc.data();
            const prescriptionId = doc.id;
            const row = allPrescriptionsTableBody.insertRow();
            row.setAttribute('data-prescription-id', prescriptionId);

            const slNoCell = row.insertCell(0);
            const pesticideNameCell = row.insertCell(1);
            const gramMlCell = row.insertCell(2);
            const dateCell = row.insertCell(3);
            const descriptionCell = row.insertCell(4);
            const deleteCell = row.insertCell(5);

            // Set serial number to the cell
            slNoCell.textContent = serialNumber--;

            // Set values to the cells
            pesticideNameCell.textContent = prescriptionData.pesticideName;
            gramMlCell.textContent = prescriptionData.gramPerML;
            dateCell.textContent = formatDate(prescriptionData.prescriptionDate);
            descriptionCell.textContent = prescriptionData.description;

            // Add "Delete" button with icon
            const deleteButton = document.createElement('button');
            deleteButton.id = `deleteButton_${prescriptionId}`;
            deleteButton.innerHTML = '<i class="uil uil-trash-alt"></i>';
            deleteButton.addEventListener('click', () => handleDeletePrescription(prescriptionId));
            deleteCell.appendChild(deleteButton);
        });
    }
}

function calculateAndDisplayPrescriptionTotals(querySnapshot) {
    let totalPrescriptions = 0;

    querySnapshot.forEach((doc) => {
        totalPrescriptions++;
    });

    document.getElementById('totalPrescriptions').textContent = totalPrescriptions;
    animateCounter('totalPrescriptions', 0, totalPrescriptions, 100);
}

function displayPrescriptions() {
    const userId = firebase.auth().currentUser.uid;
    const prescriptionsRef = db.collection("users").doc(userId).collection("prescriptions");

    prescriptionsRef.get()
        .then((querySnapshot) => {
            // Display prescriptions in the dedicated table
            displayAllPrescriptions(querySnapshot);

            // Calculate and display the total number of prescriptions
            calculateAndDisplayPrescriptionTotals(querySnapshot);
        })
        .catch((error) => {
            console.error("Error fetching prescriptions from Firestore:", error);
        });
}



// Example function to handle prescription deletion
function handleDeletePrescription(prescriptionId, row) {
    const userId = firebase.auth().currentUser.uid;
    const prescriptionsRef = db.collection("users").doc(userId).collection("prescriptions");

    // Delete the prescription from Firestore
    prescriptionsRef.doc(prescriptionId).delete()
        .then(() => {
            console.log("Prescription deleted successfully");
            displayPrescriptions(); // Refresh the displayed prescriptions
            showPopup("Prescription deleted successfully",true);
        })
        .catch((error) => {
            console.error("Error deleting prescription from Firestore:", error);
            showPopup("Error deleting prescription",false);

        });
}

function displayMembershipValidity(membershipValidTill) {
    const membershipElement = document.getElementById('membership');
    let showExactDate = true;
    function updateValidity() {
        const parts = membershipValidTill.split('-');
        const membershipValidTillDate = new Date(`${parts[1]}-${parts[0]}-${parts[2]}`);

        const today = new Date();
        const remainingDays = Math.ceil((membershipValidTillDate - today) / (1000 * 60 * 60 * 24));

        if (showExactDate) {
            // Display exact date
            membershipElement.textContent = membershipValidTill;
        } else {
            // Display remaining days
            membershipElement.textContent = `${remainingDays} days left`;
        }

        // Toggle the flag for the next iteration
        showExactDate = !showExactDate;

        // Add animation class
        membershipElement.classList.add('animate-countdown');

        // Remove animation class after a short delay
        setTimeout(() => {
            membershipElement.classList.remove('animate-countdown');
        }, 500);
    }

    // Call the function initially
    updateValidity();

    // Update the content every 3 seconds
    setInterval(updateValidity, 5000);
}


function getUserData(userData) {
    const userId = firebase.auth().currentUser.uid;
    const userRef = db.collection("users").doc(userId);
    const isEmailVerified = userData.emailVerified;

    const emailInput = document.getElementById('email');

    if (userData.emailVerified) {
                emailInput.style.border = '1px solid var(--green)'; // Set border color to red
                
        } else {
                emailInput.style.border = '1px solid var(--red)'; // Set border color to red
    }

    userRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('name').value = data.name || '';
            document.getElementById('email').value = data.email|| '';
            document.getElementById('phone').value = data.phone || '';

            const lastLoginDate = data.lastLogin ? formatDates(data.lastLogin, 'DD-MM-YY hh:mm A') : 'N/A';
            const signupDate = data.signupDateTime ? formatDates(data.signupDateTime, 'DD-MM-YY hh:mm A') : 'N/A';

            document.getElementById('membershipInput').value = formatDates(data.membershipValidTill, 'DD-MM-YY hh:mm A');
            document.getElementById('lastLoginItem').innerHTML = `<strong>Last Login:</strong> ${lastLoginDate}`;

            // Display device details
            const deviceDetails = data.deviceDetails || {};
            const browser = deviceDetails.browser || 'N/A';
            const ip = deviceDetails.ip || 'N/A';
            const os = deviceDetails.os || 'N/A';

            document.getElementById('deviceDetailsItem').innerHTML = `<strong>IP:</strong> ${ip}<br><strong>OS:</strong> ${os}<br><strong>Browser:</strong> ${browser}`;


            document.getElementById('joinedDateItem').innerHTML = `<strong>Joined Date:</strong> ${signupDate}`;
            displayMembershipValidity(formatDates(data.membershipValidTill, 'DD-MM-YY'));
        } else {
            console.log('No such document!');
        }
    }).catch((error) => {
        console.error('Error getting document:', error);
    });
}



function formatDates(rawDate, format) {
    const date = new Date(rawDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear().toString().slice(-2);
    let hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const amPM = hours < 12 ? 'AM' : 'PM';

    if (hours > 12) {
        hours = (hours - 12).toString().padStart(2, '0');
    } else if (hours === '00') {
        hours = '12';
    }

    switch (format) {
        case 'DD-MM-YY':
            return `${day}-${month}-${year}`;
        case 'DD-MM-YY hh:mm A':
            return `${day}-${month}-${year} ${hours}:${minutes} ${amPM}`;
        default:
            return 'Invalid Format';
    }
}






document.getElementById('whatsappButton').addEventListener('click', openWhatsApp);

function openWhatsApp() {
    const user = auth.currentUser;

    if (user) {
        const phoneNumber = '+919902462472';  // Replace with your desired phone number

        const message = encodeURIComponent(`Hi, I need to upgrade my AgritecX membership. Name: ${user.displayName || 'N/A'}, Email: ${user.email || 'N/A'}, UID: ${user.uid}`);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        // Optional: Close the current tab/window
        // window.close();
    }
}









//--------------------------------------------------------------------------------------toggle tables----------------------------------------------//

const toggleSwitch = document.getElementById('togglePrescriptionInspection');
const prescriptionTable = document.getElementById('prescriptionTable');
const inspectionTable = document.getElementById('inspectionTable');
const tableTitle = document.getElementById('tableTitle');
const tableIcon = document.getElementById('tableIcon');
const tableText = document.getElementById('tableText');

toggleSwitch.addEventListener('change', function () {
    if (toggleSwitch.checked) {
        // If toggle is on, show inspectionTable and update the title
        prescriptionTable.style.display = 'none';
        inspectionTable.style.display = 'table'; // or 'block' for visibility
        updateTitle('uil-prescription-bottle', 'All Inspections');
    } else {
        // If toggle is off, show prescriptionTable and update the title
        prescriptionTable.style.display = 'table'; // or 'block' for visibility
        inspectionTable.style.display = 'none';
        updateTitle('uil-prescription-bottle', 'All Prescriptions');
    }
});

// Initial setup based on the default state of the toggle switch
if (toggleSwitch.checked) {
    prescriptionTable.style.display = 'none';
    inspectionTable.style.display = 'table'; // or 'block' for visibility
    updateTitle('uil-prescription-bottle', 'All Inspections');
} else {
    prescriptionTable.style.display = 'table'; // or 'block' for visibility
    inspectionTable.style.display = 'none';
    updateTitle('uil-prescription-bottle', 'All Prescriptions');
}

// Function to update the title dynamically
function updateTitle(iconClass, titleText) {
    tableIcon.className = `uil ${iconClass}`;
    tableText.textContent = titleText;
}




});
