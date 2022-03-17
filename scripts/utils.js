const localStorage = window.localStorage;

export function loadToStorage(todoList) {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

export function loadFromStorage() {
  return localStorage.getItem("todoList");
}
