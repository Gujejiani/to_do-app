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

const formModal = document.querySelector(".form_container");

const taskInput = document.querySelector(".form_about-task");
const descriptionInput = document.querySelector(".form_about-description");
const task_timeTypes = document.querySelector(".form_about_type");
const formSubmit = document.querySelector(".form");

const types = document.querySelectorAll(".type");
document;

const overlay = document.querySelector(".overlay");
const task_overlay = document.querySelector(".task-overlay");

const setStatus = document.querySelector(".set-status");
const Status = document.querySelector(".status");

const statusModal = document.querySelector(".status_wrapper");
const statusSelectedICons = document.querySelectorAll(".status_icon");

const priorityModal = document.querySelector(".priority_wrapper");
const prioritySelectedIcons = document.querySelectorAll(".priority_icon");

const setPriorityType = document.querySelector(".set-priority");
const priority = document.querySelector(".priority");

const prioritySave = document.querySelector(".priority-save");
const priorityCancel = document.querySelector(".priority-cancel");

//task add
const taskPriorityBackgorunds = document.querySelectorAll("span.priority");
const taskNames = document.querySelectorAll(".task_list-li");
const taskStatuses = document.querySelectorAll(".task_status");

const setTime = document.querySelector(".set-time");

//tasks parrents
const todayTasks = document.querySelector(".today_task-list");
const tomorrowTasks = document.querySelector(".tomorrow_task-list");
const nextWeekTasks = document.querySelector(".next_week-task");

// task Update
const updatedTaskInput = document.querySelector(".task_input");
const updatedTaskDescription = document.querySelector(".form-textArea");

const updateStatus = document.querySelector(".update-status");
const updatePriority = document.querySelector(".update-priority");

const setStatusUpdate = document.querySelector(".update_status");
const setPriorityUpdate = document.querySelector(".update_priority"); //

const deleteTask = document.querySelector(".delete-task");
const updateTask = document.querySelector(".update_modal");

let allTasks = document.querySelectorAll(".task_list-li");

class App {
  #taskID = 0;
  #id;
  #type = "today";
  #status = "To Do";
  #priority = "important";
  #priorityColor = "#965657";
  #tasks = [];
  #taskElement;
  #statusBackgorund;

  constructor() {
    tasks_Wrapper.addEventListener("click", this._showAndHidetasks.bind(this));
    createTask.addEventListener("click", this._toggleOverlayForm.bind(this));
    formSubmit.addEventListener("submit", this._newTaskAdded.bind(this));
    task_overlay.addEventListener("click", this._hideForm.bind(this));
    task_timeTypes.addEventListener("click", this._taskTimeHandler.bind(this));
    setStatus.addEventListener("click", this._typeSelectHandler);
    overlay.addEventListener("click", this._overlayClicked);
    statusModal.addEventListener("click", this._selectStatus.bind(this));
    priorityModal.addEventListener("click", this._selectPriority.bind(this));
    prioritySave.addEventListener("click", this._savePriority.bind(this));
    setPriorityType.addEventListener("click", this._priorityModal.bind(this));
    priorityCancel.addEventListener("click", this._priorityCancel.bind(this));
    updatePriority.addEventListener("click", this._priorityModal.bind(this));
    updateStatus.addEventListener("click", this._typeSelectHandler);
    updateTask.addEventListener("submit", this._updateTask.bind(this));
  }

  _newTaskAdded(e) {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const toDotask = taskInput.value;
    if (toDotask) {
      const task = new Task(
        this.#taskID,
        toDotask,
        description,
        this.#type,
        this.#status,
        this.#priority,
        this.#priorityColor,
        this.#statusBackgorund
      );
      this.#taskID++;
      console.log(this.#tasks);
      this.#tasks.push(task);
      const data1 = this.#tasks[0]?.fetchAll();
      const currentTasks = this._getTasksByType(this.#type); //returns filtered tasks by tyoe  today || tomorrow || nextWeek
      this._updateTasksCounter(this.#type, currentTasks);
      this._hideForm();
      this._addTask();
    }
    allTasks = document.querySelectorAll(".task_list-li");
    allTasks.forEach((task) => {
      task.addEventListener("click", this._taskUpdateModal.bind(this));
    });
  }

  _taskUpdateModal(e) {
    let label;
    if (e.target.nodeName === "LI") {
      label = e.target.value;
    } else if (e.target.closest("li")) {
      label = e.target.closest("li");
    }

    if (label) {
      console.log("taskUpdateModal");
      let task = label.dataset.id;
      let taskInfo = this.#tasks[task];
      this._getValuesToUpdateForm(taskInfo);

      this.#taskElement = label;
    }
  }
  _updateTask(e) {
    e.preventDefault();

    if (this.#taskElement) {
      console.log("updateTask");
      const [
        priorityNode,
        taskTitle,
        statusNode,
      ] = this.#taskElement.childNodes;
      priorityNode.style.background = this.#priorityColor;
      taskTitle.innerHTML = updatedTaskInput.value;
      statusNode.style.background = this.#statusBackgorund;
    }
    // (task,
    // description,
    // type,
    // status,
    // priority,
    // priorityColor,
    // statusBackground)
    this._updatePrivateTaskArray();
    console.log(this.#tasks);
  }
  _updatePrivateTaskArray() {
    //updating araay of tasks
    this.#tasks[this.#taskElement.dataset.id].save(
      updatedTaskInput.value,
      updatedTaskDescription.value,
      this.#type,
      this.#status,
      this.#priority,
      this.#priorityColor,
      this.#statusBackgorund
    );
  }
  _getValuesToUpdateForm(task) {
    updatedTaskInput.value = task.task;
    updatedTaskDescription.value = task.description;
    setStatusUpdate.innerHTML = task.status;
    setStatusUpdate.style.background = task.statusBackground;
    setPriorityUpdate.innerHTML = task.priority;
    setPriorityUpdate.style.background = task.priorityColor;
  }

  _updateStatusInUpdateModal() {
    console.log("updated status");
    setStatusUpdate.innerHTML = this.#status;
    setStatusUpdate.style.background = `${this.#statusBackgorund}`;
  }

  _updatePriorityInUpdateModal() {
    console.log("updated");
    setPriorityUpdate.innerHTML = this.#priority;
    setPriorityUpdate.style.background = this.#priorityColor;
  } ///////////////////////////////////////// UPDATE PRIORITY   yyyyyyyyyyy

  _addTask() {
    console.log("---------------------------");
    this.#tasks.forEach((task) => {
      console.log(task);
      if (!task.added) {
        switch (task.type) {
          case "today":
            task.added = true;
            todayTasks.insertAdjacentHTML(
              "afterbegin",
              `   <li data-id="${task.id}"  data class="task_list-li"><span class="priority" style="background-color:${task.priorityColor};"  ></span><span class="task_title" >${task.task}</span><span class="task_status"  style="background-color:${task.statusBackground};">${task.status}</span></li>`
            );
            console.log("today");
            break;
          case "tomorrow":
            task.added = true;
            tomorrowTasks.insertAdjacentHTML(
              "afterbegin",
              `   <li data-id="${task.id}" class="task_list-li"><span class="priority" style="background-color:${task.priorityColor};"  ></span><span class="task_title" >${task.task}</span><span class="task_status"  style="background-color:${task.statusBackground};">${task.status}</span></li>`
            );
            console.log("tomorrow added");
            break;
          case "nextWeek":
            task.added = true;
            nextWeekTasks.insertAdjacentHTML(
              "afterbegin",
              `   <li data-id="${task.id}" class="task_list-li"><span class="priority" style="background-color:${task.priorityColor};"></span><span class="task_title" >${task.task}</span><span class="task_status"  style="background-color:${task.statusBackground};">${task.status}</span></li>`
            );
            console.log("next WEek");
            break;

          default:
            console.log("error while ADDING tASK ");
            break;
        }
      }
    });
  }

  _showAndHidetasks(e) {
    const title = e.target;
    const task = title.nextSibling; //task = the ul list tasks
    console.log("task clicked");
    //checking if title clicked
    if (title.nodeName === "H3") {
      this.#id = title.dataset.id;
      title.classList.toggle("task_title_clicked");
      const taskUlList = document.querySelector(`.${this.#id}`);

      let tasksCount = taskUlList.childElementCount;

      this._removeTitleSelectors(tasksTitle, this.#id, "task_title_clicked");

      //checking if heigth is added or not to ul element, which cotains our task lists
      if (taskUlList.offsetHeight === 0 && tasksCount > 0) {
        taskUlList.style.height = `auto`;
        task.style.transform = "translateY(120%)";
      } else {
        task.style.transform = "translateY(0)";
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
    task_overlay.classList.toggle("task_overlay-show");

    formModal.classList.toggle("form_modal-Show");
    setTimeout(() => {
      taskInput.focus();
    }, 30);
  }
  _hideForm(e) {
    console.log("hide form");

    //hide form modal
    formModal.classList.remove("form_modal-Show");
    //remove overlay
    task_overlay.classList.remove("task_overlay-show");
    //removing selectors
    this._removeTitleSelectors(types, "all", "task_type-selected");

    //reseting form
    this._resetNewTask();
  }

  _taskTimeHandler(e) {
    //type  Today Tomoro
    const type = e.target;
    //type  -- Today || Tomorrow || Next week
    if (type.classList.contains("type")) {
      type.classList.add("task_type-selected");
      this.#type = type.dataset.id;
      setTime.innerHTML = `${this.#type}`;
      this._removeTitleSelectors(types, this.#type, "task_type-selected");
    }
  }
  _selectStatus(e) {
    //checking if list of status clicked
    if (e.target.nodeName === "LI") {
      let list = e.target;
      this.#status = list.dataset.status;
      // by children finding icon element
      this._saveStatusColor(list.dataset.status);
      console.log(this.#statusBackgorund);

      this._updateStatusInUpdateModal();
      let selecTedIcon = list.children[0];
      //changing style to visibility visible
      selecTedIcon.classList.toggle("status_selected");

      this._removeTitleSelectors(
        statusSelectedICons,
        this.#status,
        "status_selected"
      );
      Status.textContent = this.#status;
      console.log("245 overlay");
      this._overlayClicked();
    }
  }
  _saveStatusColor(status) {
    switch (status) {
      case "To Do":
        this.#statusBackgorund = "#23ceb7";
        break;
      case "In Progress":
        this.#statusBackgorund = "#ccb00f";
        break;
      case "done":
        this.#statusBackgorund = "#64df2b";

        break;

      default:
        console.log("status background not added");
        break;
    }
  }

  _savePriority() {
    if (this.#priority) {
      this._getPriorityColor(this.#priority);

      this._updatePriorityInUpdateModal();

      statusModal.classList.remove("status-show");
      priority.innerHTML = `${this.#priority}`;
      priority.style.background = `${this.#priorityColor}`;
      priorityModal.classList.remove("priority-show");
      this._overlayClicked();
    }
  }
  _priorityCancel() {
    this._resetPriority();
  }
  _resetNewTask() {
    descriptionInput.value = taskInput.value = "";
    this.#priority = "";

    this.#type = "today";
    this.#status = "To Do";
    this.#priorityColor = "#965657";

    priority.style.background = "#fff";
    priority.innerHTML = "status";
    Status.innerHTML = "To Do";
    setTime.innerHTML = "today";
    console.log("reseted");
  }

  _resetPriority() {
    this.#priority = "";
    this.#priorityColor = "#965657";
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
    }
  }
  _getTasksByType(type) {
    //filtering array by type
    const tasks = this.#tasks.filter((task) => {
      return task.type === type;
    });
    //setting count items to specific tasks type length

    return tasks;
  }
  _updateTasksCounter(type, task) {
    const count = document.querySelector(`.${type}`).nextSibling;
    count.textContent = `${task.length}`;
  }

  _typeSelectHandler() {
    overlay.classList.add("show");
    statusModal.classList.add("status-show");
  }
  _priorityModal() {
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
  #tasks = [];
  constructor(
    id,
    task,
    description,
    type,
    status,
    priority,
    priorityColor,
    statusBackground
  ) {
    this.id = id;
    this.task = task;
    this.description = description;
    this.type = type;
    this.status = status;
    this.priority = priority;
    this.priorityColor = priorityColor;
    this.statusBackground = statusBackground;
  }

  fetchAll() {
    return this;
  }
  save(
    task,
    description,
    type,
    status,
    priority,
    priorityColor,
    statusBackground
  ) {
    this.task = task;
    this.description = description;
    this.type = type;
    this.status = status;
    this.priority = priority;
    this.priorityColor = priorityColor;
    this.statusBackground = statusBackground;
  }
  update() {
    this.task = "kakha";
  }
}
