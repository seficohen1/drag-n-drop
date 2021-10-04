const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listCol = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;
// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];

// Drag Functionality
let draggedItem;
let currentCol;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Working out', 'Doing the dishes'];
    progressListArray = ['Work on projects'];
    completeListArray = ['Cleaning the house'];
    onHoldListArray = ['Walking the dog'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArray = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, i) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArray[i]));
  });
}

// Filter Arrays toemove empty items
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null || '');
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.id = index;
  listEl.draggable = true;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;

  // Apend
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, i) => {
    createItemEl(backlogList, 0, backlogItem, i);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, i) => {
    createItemEl(progressList, 1, progressItem, i);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, i) => {
    createItemEl(completeList, 2, completeItem, i);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, i) => {
    createItemEl(onHoldList, 3, onHoldItem, i);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Updated/Delete Item or Update the Array val
function updateItem(id, column) {
  const selectedArray = listArray[column];
  const selectedCol = listCol[column].children;
  if (!dragging) {
    if (!selectedCol[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedCol[id].textContent;
    }
    updateDOM();
  }
}
// Add to Col list
function addToColumn(col) {
  const itemText = addItems[col].textContent;
  const selectedArray = listArray[col];
  selectedArray.push(itemText);
  addItems[col].textContent = '';
  updateDOM();
}

// Show Add Item Input Box
function showInputBox(col) {
  addBtns[col].style.visibility = 'hidden';
  saveItemBtns[col].style.display = 'flex';
  addItemContainers[col].style.display = 'flex';
  addToColumn(col);
}
// Hide Item Input Box
function hideInputBox(col) {
  addBtns[col].style.visibility = 'visible';
  saveItemBtns[col].style.display = 'none';
  addItemContainers[col].style.display = 'none';
}

// Allows arrays to reflect drag and drop items
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(
    (item) => item.textContent
  );
  progressListArray = Array.from(progressList.children).map(
    (item) => item.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (item) => item.textContent
  );
  onHoldListArray = Array.from(onHoldList.children).map(
    (item) => item.textContent
  );
  updateDOM();
}

//When Item Starts Dragging
function drag(event) {
  draggedItem = event.target;
  dragging = true;
}

// When Item enters col
function dragEnter(col) {
  listCol[col].classList.add('over');
  currentCol = col;
}

// Col allws for Item to Drop
function allowDrop(event) {
  event.preventDefault();
}

// Dropping Item in Col
function drop(event) {
  event.preventDefault();
  //remove padding and color
  listCol.forEach((col) => {
    col.classList.remove('over');
  });
  // add item to col
  const parent = listCol[currentCol];
  parent.appendChild(draggedItem);
  // Dragging completed
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();
