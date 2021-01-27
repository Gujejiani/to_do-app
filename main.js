"use strict";

/////////////////// Theme Start ////////////////////////

const thems = document.querySelectorAll(".them");
const nav = document.querySelector(".nav");
const body = document.querySelector("body");
const imgs = document.querySelectorAll("img");

thems.forEach((theme) => {
  //adding listener to ich theme
  theme.addEventListener("click", function (e) {
    const currentTheme = e.currentTarget.dataset.id;
    themeCheked(currentTheme);
  });
});

const navStyle = JSON.parse(localStorage.getItem("nav_style"));
const bodyStyle = JSON.parse(localStorage.getItem("body_style"));
const checked = JSON.parse(localStorage.getItem("checked"));
//checking if theme styles is already added to local Storage, if so than adding them to elements

if (navStyle && bodyStyle && checked) {
  addStylesFromLocalStorage();
}

const themeCheked = (id) => {
  if (!id) return;
  const check = document.querySelector(`.${id}`);
  check.classList.toggle("hide");

  switchThemeColors(id);
};

const switchThemeColors = (id) => {
  switch (id) {
    case "dark":
      nav.classList.remove("sky_nav", "tangerine_nav");
      body.classList.remove("sky_body", "tangerine_body");
      nav.classList.toggle("darker_nav");
      body.classList.toggle("darker_body");
      removeChecked(id);
      break;
    case "sky":
      nav.classList.remove("darker_nav", "tangerine_nav");
      body.classList.remove("darker_body", "tangerine_body");
      nav.classList.toggle("sky_nav");
      body.classList.toggle("sky_body");
      removeChecked(id);
      break;
    case "tangerine":
      body.classList.remove("darker_body", "sky_body");
      nav.classList.remove("sky_nav", "darker_nav");
      nav.classList.toggle("tangerine_nav");
      body.classList.toggle("tangerine_body");
      removeChecked(id);
  }
};

const removeChecked = (id) => {
  //saving theme colors to local Storage
  saveThemeToLocalStorage(id);
  //checking if other thems are already checked and if so, removing img
  imgs.forEach((img) => {
    if (!img.classList.contains(id)) {
      img.classList.add("hide");
    }
  });
};

const saveThemeToLocalStorage = (id) => {
  let navStyle = nav.className.split(" ")[1];

  if (navStyle) {
    localStorage.setItem("nav_style", JSON.stringify(navStyle));
    localStorage.setItem("body_style", JSON.stringify(body.className));
    localStorage.setItem("checked", JSON.stringify(`${id}`));
  }
};
function addStylesFromLocalStorage() {
  nav.classList.add(`${navStyle}`);
  body.classList.add(`${bodyStyle}`);
  imgs.forEach((img) => {
    if (img.classList.contains(`${checked}`)) {
      img.classList.remove("hide");
    } else {
      img.classList.add("hide");
    }
  });
}
////////////////////////////////////////// Theme End /////////////////////////////////////////////////////

const createTask = document.querySelector(".create_task");
const tasks_Wrapper = document.querySelector(".tasks_wrapper");
const tasksTitle = document.querySelectorAll(".task-title");

const formContainer = document.querySelector(".form_container");

const taskInput = document.querySelector(".form_about-task");
const descriptionInput = document.querySelector(".form_about-description");
const task_types = document.querySelector(".form_about_type");
const formSubmit = document.querySelector(".form");
const types = document.querySelectorAll(".type");

const overlay = document.querySelector(".overlay");
const task_overlay = document.querySelector(".task-overlay");
const setType = document.querySelector(".set-type");

const statusModal = document.querySelector(".status_wrapper");
const statusSelectedICons = document.querySelectorAll(".status_icon");
const statusType = document.querySelector(".set-type");

const priorityModal = document.querySelector(".priority_wrapper");
const prioritySelectedIcons = document.querySelectorAll(".priority_icon");
const setPriorityType = document.querySelector(".set-priority");

const prioritySave = document.querySelector(".priority-save");
const priorityCancel = document.querySelector(".priority-cancel");

class App {
  #id;
  #hideForm;
  #type;
  #status;
  #priority;
  #priorityColor;
  #tasks = [];

  constructor() {
    tasks_Wrapper.addEventListener("click", this._showAndHidetasks.bind(this));
    createTask.addEventListener("click", this._toggleOverlayForm.bind(this));
    formSubmit.addEventListener("submit", this._newTaskAdded.bind(this));
    task_overlay.addEventListener("click", this._hideForm.bind(this));
    task_types.addEventListener("click", this._taskTypeHandler.bind(this));
    setType.addEventListener("click", this._typeSelectHandler);
    overlay.addEventListener("click", this._overlayClicked);
    statusModal.addEventListener("click", this._selectStatus.bind(this));
    priorityModal.addEventListener("click", this._selectPriority.bind(this));
    prioritySave.addEventListener("click", this._savePriority.bind(this));
    setPriorityType.addEventListener("click", this._priorityModal.bind(this));
    priorityCancel.addEventListener("click", this._priorityCancel.bind(this));
  }

  _newTaskAdded(e) {
    e.preventDefault();

    this._hideForm();
  }

  _showAndHidetasks(e) {
    const title = e.target;
    const task = title.nextSibling;
    //checking if title clicked
    if (title.nodeName === "H3") {
      this.#id = title.dataset.id;
      title.classList.toggle("task_title_clicked");
      const taskUlList = document.querySelector(`.${this.#id}`);

      let tasksCount = taskUlList.childElementCount;
      task.textContent = tasksCount;
      //  counting ul height, acording to children
      const height = 35 * tasksCount;

      this._removeTitleSelectors(tasksTitle, this.#id, "task_title_clicked");

      //checking if heigth is added or not to ul element, which cotains our task lists
      if (taskUlList.offsetHeight === 0) {
        taskUlList.style.height = `${height}px`;
      } else {
        taskUlList.style.height = `0`;
      }
    }
  }

  //removing color from past selected task titles
  _removeTitleSelectors(el, id, className) {
    el.forEach((title) => {
      // console.log(title.dataset.id, id, className);
      if (title.dataset.id !== id) {
        title.classList.remove(`${className}`);
      }
    });
  }

  _toggleOverlayForm(e) {
    console.log(e.target);
    task_overlay.classList.toggle("task_overlay-show");
    console.log(task_overlay);
    formContainer.classList.toggle("form_modal-Show");
    setTimeout(() => {
      taskInput.focus();
    }, 30);
  }
  _hideForm(e) {
    console.log(e.target);
    //checking if closest node is from element

    if (!e.target) return;

    formContainer.classList.remove("form_modal-Show");
    task_overlay.classList.remove("task_overlay-show");
    this._removeTitleSelectors(types, "all", "task_type-selected");

    // if (formContainer.classList.contains("form_modal-Show")) {
    //   //if overlay is already show and target is not form, we are hiding form overlay
    //   console.log("hid Form");
    //   formContainer.classList.remove("form_modal-Show");
    //   descriptionInput.value = taskInput.value = "";
    //   this.#hideForm = false;
    //   //remove selected types

    // } else {
    //   this.#hideForm = true;
    // }
  }

  _taskTypeHandler(e) {
    const type = e.target;

    if (type.classList.contains("type")) {
      type.classList.add("task_type-selected");
      this.#type = type.dataset.id;

      this._removeTitleSelectors(types, this.#type, "task_type-selected");
    }
  }
  _selectStatus(e) {
    //checking if list of status clicked
    if (e.target.nodeName === "LI") {
      let list = e.target;
      this.#status = list.dataset.status;
      // by children finding icon element

      let selecTedIcon = list.children[0];
      //changing style to visibility visible
      selecTedIcon.classList.toggle("status_selected");

      this._removeTitleSelectors(
        statusSelectedICons,
        this.#status,
        "status_selected"
      );
      statusType.textContent = this.#status;
      console.log("245 overlay");
      this._overlayClicked();
    }
  }
  _savePriority() {
    if (this.#priority) {
      this._getPriorityColor(this.#priority);

      statusModal.classList.remove("status-show");
      setPriorityType.innerHTML = `${this.#priority}`;
      setPriorityType.style.background = `${this.#priorityColor}`;
      priorityModal.classList.remove("priority-show");
      this._overlayClicked();
    }
  }
  _priorityCancel() {
    this._resetPriority();
  }

  _resetPriority() {
    this.#priority = "";
    this.#priorityColor = "";
    statusModal.classList.remove("status-show");
    this._overlayClicked();
  }

  _selectPriority(e) {
    if (e.target.nodeName === "LI") {
      let list = e.target;
      this.#priority = list.dataset.priority;

      let selecTedIcon = list.children[0];
      //changing style to visibility visible
      selecTedIcon.classList.toggle("priority_selected");
      this._removeTitleSelectors(
        prioritySelectedIcons,
        this.#priority,
        "priority_selected"
      );
      console.log(this.#priority);
    }
  }

  _typeSelectHandler() {
    overlay.classList.add("show");
    statusModal.classList.add("status-show");
  }
  _priorityModal() {
    console.log("asdda");
    overlay.classList.add("show");
    priorityModal.classList.add("priority-show");
  }
  _overlayClicked(e) {
    statusModal.classList.remove("status-show");
    priorityModal.classList.remove("priority-show");
    overlay.classList.remove("show");
  }
  _getPriorityColor(priority) {
    switch (priority) {
      case "Important":
        this.#priorityColor = "#965657";
        break;
      case "Family":
        this.#priorityColor = "#c96567";
        break;
      case "Deadline":
        this.#priorityColor = "#e8a87c";
        break;
      case "Fun":
        this.#priorityColor = "#85dccb";
        break;
      default:
        console.log("no match");
        break;
    }
  }
}

const app = new App();

class Task {
  constructor(task, description, type, priority) {
    this.task = task;
    this.description = description;
    this.type = type;
    this.priority = priority;
  }
}
