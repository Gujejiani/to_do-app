"use strict";

import { choosingTheme } from "./themes.js";
choosingTheme();

class Task {
  constructor(
    id,
    task,
    description,
    type,
    status,
    priority,
    priorityColor,
    statusBackground,
    priorityPoint
  ) {
    this.id = id;
    this.task = task;
    this.description = description;
    this.type = type;
    this.status = status;
    this.priority = priority;
    this.priorityColor = priorityColor;
    this.statusBackground = statusBackground;
    this.priorityPoint = priorityPoint;
  }

  save(
    task,
    description,
    type,
    status,
    priority,
    priorityColor,
    statusBackground,
    priorityPoint
  ) {
    this.task = task;
    this.description = description;
    this.type = type;
    this.status = status;
    this.priority = priority;
    this.priorityColor = priorityColor;
    this.statusBackground = statusBackground;
    this.priorityPoint = priorityPoint;
  }
}

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

//tasks parrents
const todayTasks = document.querySelector(".today_task-list");
const tomorrowTasks = document.querySelector(".tomorrow_task-list");
const nextWeekTasks = document.querySelector(".nextWeek_task-list");

const defaultTaskPeriod = document.querySelector(".default-type");
// task Update
const updatedTaskInput = document.querySelector(".task_input");
const updatedTaskDescription = document.querySelector(".form-textArea");

const updateStatus = document.querySelector(".update-status");
const updatePriority = document.querySelector(".update-priority");

const setStatusUpdate = document.querySelector(".update_status");
const setPriorityUpdate = document.querySelector(".update_priority"); //

const deleteTask = document.querySelector(".delete-task");
const updateTask = document.querySelector(".update_modal");
const toggleUpdateModal = document.querySelector(".update_wrapper");
const sorts = document.querySelectorAll(".sort");

const bins = document.querySelectorAll(".trash");
class App {
  #taskID = 0;
  #timeId;
  #type = "today";
  #status = "To Do";
  #priority = "important";
  #priorityColor = "#965657";
  #tasks = [];
  #taskElement;
  #statusBackgorund = "#23ceb7";
  #ShowAndHideTaskEl;
  #priorityPoint = 1; //  default to Important

  constructor() {
    if (tasks_Wrapper) {
      tasks_Wrapper.addEventListener(
        "click",
        this._showAndHidetasks.bind(this)
      );
      createTask.addEventListener("click", this._toggleOverlayForm.bind(this));
      formSubmit.addEventListener("submit", this._newTaskAdded.bind(this));
      task_overlay.addEventListener("click", this._hideForm.bind(this));
      task_timeTypes.addEventListener(
        "click",
        this._taskTimeHandler.bind(this)
      );
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
      deleteTask.addEventListener("click", this._deleteTask.bind(this));
      this._getLocalStorageData();
      this._sortListener();
      this._binsAddEvenlisteners();
    }
  }

  _ulHeightUpdate(type) {
    const el = this.#ShowAndHideTaskEl //h3 title of tasks
      ? this.#ShowAndHideTaskEl.classList.contains("task_title_clicked")
      : null;
    const bin = document.querySelector(`.${type}-bin`);

    if (this.#timeId && el) {
      const ul = document.querySelector(`.${type}_task-list`);
      ul.style.height = `${ul.childElementCount * 43}px`;
      let tasks = ul.childElementCount;
      let sort = this.#ShowAndHideTaskEl.childNodes[1];
      let count = this.#ShowAndHideTaskEl.nextSibling;

      this._changeTaskConteinerChildrensDisplay(tasks, type, bin, sort, count);
    }
  }
  _changeTaskConteinerChildrensDisplay(tasks, type, bin, sort, count) {
    if (tasks < 1) {
      document.querySelector(`.${type}-bin`).classList.remove("bin-show");
    }
    if (tasks < 2) {
      sort.classList.remove("show-sort");
    } else if (
      tasks === 2 &&
      this.#ShowAndHideTaskEl.classList.contains(`${bin.dataset.bin}`)
    ) {
      bin.classList.add("bin-show");
      sort.classList.add("show-sort");
    }
    if (tasks === 0) {
      count.style.transform = "translateY(0)";
      count.style.backgroundColor = "rgb(52, 121, 248)";
    }
  }
  _newTaskAdded(e) {
    e.preventDefault();
    const ul = document.querySelector(`.${this.#timeId}`);
    //checking if ul is empty
    let ulTasksCount = ul ? ul.childElementCount : null;
    if (ulTasksCount < 1) {
      this._removeTitleSelectors(tasksTitle, "all", "task_title_clicked"); //removing all titlel selectors
    }
    const toDotask = taskInput.value;
    if (toDotask) {
      // 1. add tasks to our main tasks array
      this._addTaskToTasksArray();
      //2. add task to the dom
      this._addTask(this.#tasks);
      //3. update tasks wrapper height
      this._ulHeightUpdate(this.#type);
      //4. update counter of tasks
      this._updateTasksCounter(this.#type);
      //5. hide form //
      this._hideForm();
      //6. add sort listener
      this._sortListener();
    } else {
      // else add focus to unfilled task
      taskInput.focus();
    }
    // 7. add listener to new tasks
    this._addEvenTListenerToTasks();
    //8. reset counter color, may it will be red
    this._resetTaskCountColor();
    // 9. save updated task to local storage
    this._saveToLocalStorage();

    //add default time background
    defaultTaskPeriod.classList.add("task_type-selected");
  }
  _genereteIDForTasks() {
    this.#taskID = 0;
    if (this.#tasks[0]) {
      let max = Math.max(...this.#tasks.map((task) => task.id));

      this.#taskID = max + 1;
    }
  }
  _closeTasksUl() {
    const taskContainer = document.querySelectorAll(".task_list");
    taskContainer.forEach((ul) => {
      ul.style.height = "0";
    });
    bins.forEach((bin) => {
      bin.classList.remove("bin-show");
    });
    sorts.forEach((sort) => {
      sort.classList.remove("show-sort");
    });
    this._removeTitleSelectors(tasksTitle, "all", "task_title_clicked");
    const tasksCount = document.querySelectorAll(".task_count");
    tasksCount.forEach((count) => {
      count.style.transform = "translateY(0)";
    });
  }

  _sortListener() {
    sorts.forEach((sort) => {
      sort.addEventListener("click", this._sortItems.bind(this));
    });
  }
  _sortItems(e) {
    const parrent = e.target.dataset.id;
    const type = e.target.dataset.type;
    let sortArray = this.#tasks.filter((task) => task.type === type);
    const sorted = sortArray.sort((a, b) => {
      if (a.priorityPoint < b.priorityPoint) return 1;
      if (a.priorityPoint > b.priorityPoint) return -1;
    });
    document.querySelector(`.${parrent}`).innerHTML = "";
    sorted.forEach((item) => {
      item.added = false;
    });
    this.#tasks = sortArray;
    this._addTask(sorted);
    this._saveToLocalStorage();
    this._addEvenTListenerToTasks();
  }

  _addTaskToTasksArray() {
    this._genereteIDForTasks();

    const description = descriptionInput.value.trim();
    const toDotask = taskInput.value;
    const task = new Task(
      this.#taskID,
      toDotask,
      description,
      this.#type,
      this.#status,
      this.#priority,
      this.#priorityColor,
      this.#statusBackgorund,
      this.#priorityPoint
    );
    this.#tasks.push(task);
  }
  _addEvenTListenerToTasks() {
    let allTasks = document.querySelectorAll(".task_list-li");
    allTasks.forEach((task) => {
      task.addEventListener("click", this._taskUpdateModal.bind(this));
    });
  }

  _taskUpdateModal(e) {
    let label;

    if (e.target.nodeName === "LI") {
      label = e.target;
      this._toggleUpdateModal(label);
    } else {
      label = e.target.closest("li");
      this._toggleUpdateModal(label);
    }

    if (this.#taskElement) {
      toggleUpdateModal.classList.add("showUpdateModal");
      updatedTaskInput.focus();
      //find and return current object info which we want to update
      let taskInfo = this._getCurrentTaskObjForUpdate(this.#taskElement);
      this.#type = taskInfo.type;
      this._getValuesToUpdateForm(taskInfo);
    }
  }
  _toggleUpdateModal(lab) {
    this.#taskElement = lab;
    task_overlay.classList.add("task_overlay-show");

    updatedTaskInput.focus();
  }
  _getCurrentTaskObjForUpdate(taskEl) {
    //returns current task from array
    if (taskEl) {
      let id = Number(taskEl.dataset.id);

      const task = this.#tasks.find((task) => {
        return task.id === id;
      });

      return task;
    }
  }
  _updateTask(e) {
    e.preventDefault();

    if (this.#taskElement) {
      const [
        priorityNode,
        taskTitle,
        statusNode,
      ] = this.#taskElement.childNodes;
      priorityNode.style.background = this.#priorityColor;
      taskTitle.innerHTML = updatedTaskInput.value;
      statusNode.style.background = this.#statusBackgorund;
      statusNode.innerHTML = this.#status;
      this._updatePrivateTaskArray();

      this._removeOverlayAndUpdateModal();
      this._resetNewTask();

      this._saveToLocalStorage();
    }
  }
  _deleteTask(e) {
    // _updateTasksCounter(type) //update count

    this.#taskElement.remove();

    this._ulHeightUpdate(this.#type);
    this._deleteTaskFromArray();
  }
  _deleteTaskFromArray() {
    //get current task to delete
    const currentTask = this._getCurrentTaskObjForUpdate(this.#taskElement);
    //find index of task
    const deleteObj = this.#tasks.findIndex(
      (task) => task.id === currentTask.id
    );
    //remove task
    this.#tasks.splice(deleteObj, 1);
    //update task counter

    this._updateTasksCounter(this.#type);
    this.#type = "today";

    this._resetValuesToUpdateForm();

    //hide form end overlay after delete
    this._removeOverlayAndUpdateModal();

    this._saveToLocalStorage();
  }
  _removeOverlayAndUpdateModal() {
    task_overlay.classList.remove("task_overlay-show");
    toggleUpdateModal.classList.remove("showUpdateModal");
  }

  _updatePrivateTaskArray() {
    //updating araay of tasks

    const updateTask = this._getCurrentTaskObjForUpdate(this.#taskElement);
    const index = this.#tasks.findIndex((task) => task.id === updateTask.id);
    this.#tasks[index].save(
      updatedTaskInput.value,
      updatedTaskDescription.value,
      this.#type,
      this.#status,
      this.#priority,
      this.#priorityColor,
      this.#statusBackgorund,
      this.#priorityPoint
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
  _resetValuesToUpdateForm() {
    updatedTaskInput.value = "";
    updatedTaskDescription.value = "";
    setStatusUpdate.innerHTML = "To Do";
    setStatusUpdate.style.background = task.statusBackground;
    setPriorityUpdate.innerHTML = "important";
    setPriorityUpdate.style.background = "#965657";
  }
  _updateStatusInUpdateModal() {
    setStatusUpdate.innerHTML = this.#status;
    setStatusUpdate.style.background = `${this.#statusBackgorund}`;
  }

  _updatePriorityInUpdateModal() {
    setPriorityUpdate.innerHTML = this.#priority;
    setPriorityUpdate.style.background = this.#priorityColor;
  } ///////////////////////////////////////// UPDATE PRIORITY   yyyyyyyyyyy

  _addTask(tasks) {
    tasks.forEach((task) => {
      if (!task.added) {
        switch (task.type) {
          case "today":
            task.added = true;
            todayTasks.insertAdjacentHTML(
              "afterbegin",
              `   <li data-id="${task.id}" class="task_list-li"><span class="priority" style="background-color:${task.priorityColor};"  ></span><span class="task_title" >${task.task}</span><span class="task_status"  style="background-color:${task.statusBackground};">${task.status}</span></li>`
            );

            break;
          case "tomorrow":
            task.added = true;
            tomorrowTasks.insertAdjacentHTML(
              "afterbegin",
              `   <li data-id="${task.id}" class="task_list-li"><span class="priority" style="background-color:${task.priorityColor};"  ></span><span class="task_title" >${task.task}</span><span class="task_status"  style="background-color:${task.statusBackground};">${task.status}</span></li>`
            );

            break;
          case "nextWeek":
            task.added = true;
            nextWeekTasks.insertAdjacentHTML(
              "afterbegin",
              `   <li data-id="${task.id}" class="task_list-li"><span class="priority" style="background-color:${task.priorityColor};"></span><span class="task_title" >${task.task}</span><span class="task_status"  style="background-color:${task.statusBackground};">${task.status}</span></li>`
            );

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
    const count = title.nextSibling; //task = the ul list tasks
    const sortIcon = title.childNodes[1]; // today || tomorrow   || nextWeek

    //checking if title clicked
    if (title.nodeName === "H3") {
      this.#ShowAndHideTaskEl = e.target;
      this.#timeId = title.dataset.id;
      const bin = document.querySelector(`.${sortIcon.dataset.type}-bin`); // today-bin || tomorrow-bin   || nextWeek-bin
      title.classList.toggle("task_title_clicked");
      const taskUlList = document.querySelector(`.${this.#timeId}`);
      let tasksCount = taskUlList.childElementCount;

      this._removeTitleSelectors(
        tasksTitle,
        this.#timeId,
        "task_title_clicked"
      );

      //checking if heigth is added or not to ul element, which cotains our task lists

      if (taskUlList.offsetHeight === 0 && tasksCount > 0) {
        taskUlList.style.height = `${tasksCount * 43}px`;
        count.style.transform = "translateY(120%)";
        count.style.backgroundColor = "rgb(52, 121, 248)";
        bin.classList.add("bin-show");
        if (tasksCount > 1) {
          sortIcon.classList.add("show-sort");
        }
      } else {
        count.style.transform = "translateY(0)";
        count.style.backgroundColor = "rgb(52, 121, 248)";
        taskUlList.style.height = `0`;
        sortIcon.classList.remove("show-sort");
        bin.classList.remove("bin-show");
        this.#ShowAndHideTaskEl.classList.remove("task_title_clicked");
      }
      if (taskUlList.offsetHeight === 0 && tasksCount === 0) {
        count.style.backgroundColor = "#c96567";
      }
    }
  }

  //removing color from past selected task titles
  _removeTitleSelectors(el, id, className) {
    el.forEach((title) => {
      if (title.dataset.id !== id) {
        title.classList.remove(`${className}`);
      }
    });
  }
  _getLocalStorageData() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
      this._linkObjectToTaskClass(tasks);

      this._couneterUpdate();
    }
  }

  _toggleOverlayForm(e) {
    formModal.classList.toggle("form_modal-Show");
    task_overlay.classList.add("task_overlay-show");

    this._closeTasksUl();
    //add default time background
    defaultTaskPeriod.classList.add("task_type-selected");
    taskInput.focus();
  }
  _hideForm(e) {
    //hide form modal
    formModal.classList.remove("form_modal-Show");

    //remove overlay and update modals
    this._removeOverlayAndUpdateModal();
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
      // setTime.innerHTML = `${this.#type}`;
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
      document
        .querySelector(".priority_selected")
        .classList.remove("priority_selected");
      this._overlayClicked();
    }
  }

  _priorityCancel() {
    this._resetPriority();
  }
  _resetNewTask() {
    descriptionInput.value = taskInput.value = "";
    this.#priority = "important";
    this.#type = "today";
    this.#status = "To Do";
    this.#priorityColor = "#965657";
    this.#statusBackgorund = "#23ceb7";
    this.#priorityPoint = 1;
    priority.style.background = "#965657";
    priority.innerHTML = "important";
    Status.innerHTML = "To Do";

    // setTime.innerHTML = "today";
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
  _updateTasksCounter(type) {
    const currentTasks = this._getTasksByType(type); //returns filtered tasks by tyoe  today || tomorrow || nextWeek
    const count = document.querySelector(`.${type}`).nextSibling;
    count.textContent = `${currentTasks.length}`;
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
        this.#priorityPoint = 1;
        break;
      case "Family":
        this.#priorityColor = "#2880a3";
        this.#priorityPoint = 3;
        break;
      case "Deadline":
        this.#priorityColor = "#e8a87c";
        this.#priorityPoint = 2;
        break;
      case "Fun":
        this.#priorityPoint = 4;
        this.#priorityColor = "#85dccb";
        break;
      default:
        console.log("no match");
        break;
    }
  }
  _resetTaskCountColor() {
    const tasksCount = document.querySelectorAll(".task_count");

    tasksCount.forEach((count) => {
      count.style.backgroundColor = "rgb(52 121 248)";
    });
  }

  _binsAddEvenlisteners() {
    bins.forEach((bin) => {
      bin.addEventListener("click", this._binResetTasks.bind(this));
    });
  }
  _binResetTasks(e) {
    // 1.  get time type  which value to reset
    const type = e.target.dataset.bin;

    // 2. filter tasks and only get those types which don"t match to our reset type
    const filteredTaks = this.#tasks.filter((task) => task.type !== type);

    // 3. update tasks
    this.#tasks = filteredTaks;
    // 4. remove filtered aitems from dom
    const ul = document.querySelector(`.${type}_task-list`);
    ul.innerHTML = "";
    // 5. reset Type ul and other elements
    this._closeTasksUl();
    // 6. update data in local storage
    this._saveToLocalStorage();

    // 7. update task counter
    this._updateTasksCounter(type);
  }
  _couneterUpdate() {
    this._updateTasksCounter("today");
    this._updateTasksCounter("tomorrow");
    this._updateTasksCounter("nextWeek");
  }

  _saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.#tasks));
  }
  _linkObjectToTaskClass(tasks) {
    tasks.forEach((task) => {
      task.added = false;
      Object.setPrototypeOf(task, new Task());
      // task.__proto__ = new Task();
    });

    this.#tasks = tasks;
    this._addTask(this.#tasks);

    this._addEvenTListenerToTasks();
  }
}

const app = new App();
