import { TodoListItem } from "./todoListItem.js";
import { loadFromStorage, loadToStorage } from "./utils.js";

let todoList = [];

const domList = document.getElementById("todoList");
const inputValue = document.getElementById("inputForm");
const form = document.getElementById("todoForm");

function launch() {
  form.addEventListener("submit", getData);
  generateTodoList();
}

function getData(e) {
  e.preventDefault();
  addItem(inputValue.value);
  inputValue.value = "";
}

function generateTodoList() {
  const listFromStorage = JSON.parse(loadFromStorage());
  domList.innerHTML = "";
  if (listFromStorage !== null) {
    listFromStorage.forEach((item) => {
      const newNode = new TodoListItem(
        item.textContent,
        item.classList,
        item.id
      );
      addEventHandlersForItem(newNode.node);
      todoList.push(newNode);
      domList.appendChild(newNode.node);
    });
  }
}

function addItem(item) {
  if (item !== "") {
    const newItem = new TodoListItem(item);
    domList.appendChild(newItem.node);
    todoList.push(newItem);
    addEventHandlersForItem(newItem.node);
    loadToStorage(todoList);
  }
}

function addEventHandlersForItem(item) {
  // Need to add correct listener depending on if strikethrough is already a class list name
  if (item.classList[1] == "strikethrough") {
    item.childNodes[1].addEventListener("click", uncompleteItem);
  } else {
    item.childNodes[1].addEventListener("click", completeItem);
  }
  item.childNodes[2].addEventListener("click", deleteItem);
  item.childNodes[0].addEventListener("click", editItem);
}

function deleteItem(deleted) {
  deleted.target.parentNode.remove();
  todoList = todoList.filter(
    (item) => item.id !== deleted.target.parentNode.id
  );
  loadToStorage(todoList);
}

function completeItem(item) {
  item.target.parentNode.classList.add("strikethrough");

  // Local manipulation of the todoList classlist
  const itemInStorage = todoList.find((listItem) => {
    return listItem.id == item.target.parentNode.id;
  });
  itemInStorage.classList.push("strikethrough");
  loadToStorage(todoList);

  // Toggle the eventListeners on the button
  item.target.removeEventListener("click", completeItem);
  item.target.addEventListener("click", uncompleteItem);
}

function uncompleteItem(item) {
  // remove strikethrough class in dom node
  item.target.parentNode.classList.remove("strikethrough");

  // remove strikethrough from the todoList.item.classList in memory
  const itemInStorage = todoList.find((listItem) => {
    return listItem.id == item.target.parentNode.id;
  });

  itemInStorage.classList = itemInStorage.classList.filter(
    (className) => className !== "strikethrough"
  );

  loadToStorage(todoList);

  // Event Listeners
  item.target.removeEventListener("click", uncompleteItem);
  item.target.addEventListener("click", completeItem);
}

function editItem(item) {
  const completeIcon = item.target.parentNode.childNodes[1];
  const inputChild = item.target;
  const newInput = document.createElement("input");
  newInput.value = inputChild.innerText;
  newInput.type = "text";
  addInputEventListeners(newInput);
  item.target.parentNode.insertBefore(newInput, completeIcon);
  newInput.focus();
  item.target.parentNode.removeChild(inputChild);
}

function submitEdit(item) {
  if (item.type == "keyup") {
    item.target.removeEventListener("blur", submitEdit);
  }
  const inputChild = item.target;
  const value = inputChild.value;
  const itemToUpdate = todoList.find(
    (item) => item.id === inputChild.parentNode.id
  );

  itemToUpdate.textContent = value;
  loadToStorage(todoList);
  const contentChild = document.createElement("p");
  contentChild.innerText = value;
  contentChild.addEventListener("click", editItem);
  inputChild.parentNode.insertBefore(contentChild, inputChild);
  inputChild.parentNode.removeChild(inputChild);
}

function addInputEventListeners(item) {
  item.addEventListener("blur", submitEdit);
  item.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      submitEdit(event);
    }
  });
}
launch();
