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
////////////////////////////////////////// Themes End /////////////////////////////////////////////////////
const createTask = document.querySelector(".create_task");
const tasks_Wrapper = document.querySelector(".tasks_wrapper");
const tasksTitle = document.querySelectorAll(".task-title");

let heightadded = false;

class App {
  #id;
  constructor() {
    // todayTasks.addEventListener("click", this.toggleTodayTasks);
    // tomorrowTasks.addEventListener("click", this.toggleTodayTasks);
    tasks_Wrapper.addEventListener("click", this._showAndHidetasks.bind(this));
  }

  _showAndHidetasks(e) {
    const title = e.target;
    const items = title.nextSibling;
    //checking if title clicked
    if (title.nodeName === "H3") {
      this.#id = title.dataset.id;

      title.classList.toggle("task_title_clicked");
      const taskUlList = document.querySelector(`.${this.#id}`);

      let tasksCount = taskUlList.childElementCount;
      items.textContent = tasksCount;
      //  counting ul height, acording to children
      const height = 35 * tasksCount;

      this._removeTitleSelectors(this.#id);

      //checking if heigth is added or not to ul element, which cotains our task lists
      if (taskUlList.offsetHeight === 0) {
        taskUlList.style.height = `${height}px`;
      } else {
        taskUlList.style.height = `0`;
      }
    }
  }

  //removing color from past selected task titles
  _removeTitleSelectors(id) {
    tasksTitle.forEach((title) => {
      if (title.dataset.id !== id) {
        title.classList.remove("task_title_clicked");
      }
    });
  }
}

const app = new App();
