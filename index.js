"use strict";

const USER_LIST_KEY = "userList";
const CAR_LIST_KEY = "carList";

function setToLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromLS(key, defaultValue) {
  const valueFromLs = localStorage.getItem(key);

  return valueFromLs === null && defaultValue
    ? defaultValue
    : JSON.parse(valueFromLs);
}

function createActionButton(id, text) {
  const button = document.createElement("button");
  button.setAttribute("data-action", id);

  button.textContent = text;
  return button;
}

const formUser = document.forms.user;
const formCar = document.forms.car;
const userListBlock = document.getElementById("usersList");
const carListBlock = document.getElementById("carsList");

const userList = getFromLS(USER_LIST_KEY, []);
const carList = getFromLS(CAR_LIST_KEY, []);

let user1;
function renderList() {
  carListBlock.innerHTML = "";
  carList.forEach(function (car) {
    const blockCar = document.createElement("div");

    blockCar.classList.add("car");

    const lineCar = document.createElement("p");
    lineCar.textContent = `Model: ${car.newModel},
     Year: ${car.newYear},
     Color: ${car.newColor},
     Owner: ${car.owner.name}`;
    blockCar.append(lineCar);

    carListBlock.append(blockCar);
  });
}

renderList();

formUser.addEventListener("submit", function (event) {
  event.preventDefault();

  const errorClass = "error";

  function getErrorElement(message) {
    const errorMsg = document.createElement("p");
    errorMsg.classList.add("errorText");
    errorMsg.textContent = message;
    return errorMsg;
  }

  function addErrorMessege(inputElement, message) {
    if (inputElement.classList.contains(errorClass)) return;
    inputElement.classList.add(errorClass);
    const error = getErrorElement(message);
    inputElement.closest(".fieldWrapper").append(error);
  }

  function removeErrorMessege(form) {
    form.addEventListener("input", function (event) {
      event.preventDefault();
      event.target.classList.remove(errorClass);
      event.target
        .closest(".fieldWrapper")
        .querySelector(".errorText")
        .remove();
    });
  }

  removeErrorMessege(formUser);

  if (formUser.elements.name.value.trim() === "") {
    addErrorMessege(formUser.elements.name, "enter data");
    return;
  }
  if (formUser.elements.age.value.trim() === "") {
    addErrorMessege(formUser.elements.age, "enter data");
    return;
  }
  if (formUser.elements.address.value.trim() === "") {
    addErrorMessege(formUser.elements.address, "enter data");
    return;
  }

  const newUser = {
    name: this.elements.name.value,
    age: this.elements.age.value,
    address: this.elements.address.value,
  };
  userList.push(newUser);
  setToLS(USER_LIST_KEY, userList);

  formUser.elements.name.value = "";
  formUser.elements.age.value = "";
  formUser.elements.address.value = "";

  const blockUser = document.createElement("div");
  blockUser.classList.add("userblock");
  for (let key in newUser) {
    const lineUser = document.createElement("p");
    lineUser.textContent = key + ": " + newUser[key];
    blockUser.append(lineUser);
  }
  const btnCar = document.createElement("button");
  btnCar.classList.add("btn-add");
  btnCar.innerText = "Add car";
  blockUser.append(btnCar);
  userListBlock.append(blockUser);

  user1 = { ...newUser };

  btnCar.addEventListener("click", function (event) {
    event.preventDefault();

    const formCar = document.createElement("form");
    formCar.setAttribute("name", "car");
    formCar.classList.add("carform");

    formCar.innerHTML = `<h3>Add new car</h3>
      <div class="fieldWrapper">
        <input class="field" name="model" type="text" placeholder="Model car" />
      </div>
      <div class="fieldWrapper">
        <input
          class="field"
          name="year"
          type="number"
          placeholder="production year"
        />
      </div>
      <div class="fieldWrapper">
        <input class="field" name="color" type="text" placeholder="color" />
      </div>
      <button type="submit">Save</button>
       
      `;
    userListBlock.append(formCar);
    removeErrorMessege(formCar);
    formCar.addEventListener("submit", function (event) {
      event.preventDefault();
      if (formCar.model.value.trim() === "") {
        addErrorMessege(formCar.model, "Enter name");
        return;
      }
      if (formCar.year.value.trim() === "") {
        addErrorMessege(formCar.year, "Enter age");
        return;
      }
      if (formCar.color.value.trim() === "") {
        addErrorMessege(formCar.color, "Enter adress");
        return;
      }
      const car = {
        model: "",
        year: "",
        color: "",
        owner: user1,
        set newModel(value) {
          this.model = value;
        },
        set newYear(value) {
          this.year = value;
        },
        set newColor(value) {
          this.color = value;
        },
        get newModel() {
          return this.model;
        },
        get newYear() {
          return this.year;
        },
        get newColor() {
          return this.color;
        },
      };

      car.newModel = this.elements.model.value;
      car.newYear = this.elements.year.value;
      car.newColor = this.elements.color.value;
      Object.setPrototypeOf(car, GeneralCarObj);

      carList.push(car);

      setToLS(CAR_LIST_KEY, carList);
      renderList();

      formCar.remove();
    });
  });
});

function Car() {
  this.getInfo = function () {
    console.log(
      "Model: ",
      this.model,
      "Year: ",
      this.year,
      "Color: ",
      this.color
    );
  };
}
const GeneralCarObj = new Car();
