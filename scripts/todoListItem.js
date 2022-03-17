export class TodoListItem {
  textContent;
  node;
  classList = ["listItem"];
  id;
  constructor(content, classList, id) {
    this.textContent = content;
    if (id) {
      this.id = id;
    } else {
      this.id = crypto.randomUUID();
    }
    this.node = document.createElement("li");
    this.node.id = this.id;
    if (classList) {
      this.classList = classList;
    }
    this.generateListElement();
  }

  getContent() {
    return this.textContent;
  }

  setContent(content) {
    this.textContent = content;
    return this.textContent;
  }

  generateListElement() {
    this.node.appendChild(this.generateContentChild());
    this.node.appendChild(this.generateCheckmarkChild());
    this.node.appendChild(this.generateTrashChild());
    this.classList.forEach((className) => this.node.classList.add(className));
  }

  generateContentChild() {
    const contentChild = document.createElement("p");
    contentChild.innerText = this.textContent;
    return contentChild;
  }

  generateCheckmarkChild() {
    const checkmarkChild = document.createElement("p");
    checkmarkChild.innerHTML = "&check;";
    checkmarkChild.classList.add("checkmark");
    return checkmarkChild;
  }

  generateTrashChild() {
    const trashNode = document.createElement("p");
    trashNode.innerHTML = "&#9851;";
    trashNode.classList.add("trash");
    return trashNode;
  }
}
