/////////////////// Theme Start ////////////////////////

const thems = document.querySelectorAll(".them");
const nav = document.querySelector(".nav");
const body = document.querySelector("body");
const imgs = document.querySelectorAll("img");

thems.forEach((theme) => {
  console.log(theme);
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

themeCheked = (id) => {
  if (!id) return;
  const check = document.querySelector(`.${id}`);
  check.classList.toggle("hide");

  switchThemeColors(id);
};

switchThemeColors = (id) => {
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

removeChecked = (id) => {
  //saving theme colors to local Storage
  saveThemeToLocalStorage(id);
  //checking if other thems are already checked and if so, removing img
  imgs.forEach((img) => {
    if (!img.classList.contains(id)) {
      img.classList.add("hide");
    }
  });
};

saveThemeToLocalStorage = (id) => {
  let navStyle = nav.className.split(" ")[1];
  console.log(navStyle);
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
