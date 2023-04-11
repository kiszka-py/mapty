"use strict";

const form = document.querySelector(".form");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const containerWorkouts = document.querySelector(".workouts");

class Workout {
  date = new Date();
  id = Date.now();

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / this.duration / 60;
    return this.speed;
  }
}

class App {
  #map;
  #clickedPoint;
  #workouts = [];

  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleElevationField);

    containerWorkouts.addEventListener("click", this._moveToPopup);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Something went wrong");
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    this.#map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    L.marker([latitude, longitude]).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _newWorkout(e) {
    const validInputs = (...inputs) => {
      return inputs.every((input) => Number.isFinite(input));
    };
    const allPositive = (...inputs) => {
      return inputs.every((input) => input > 0);
    };
    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    let workout;
    if (type === "running") {
      const cadence = +inputCadence.value;
      console.log(distance, duration, cadence);
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive numbers");
      workout = new Running(this.#clickedPoint, distance, duration, cadence);
    }
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Inputs have to be positive numbers");
      workout = new Cycling(this.#clickedPoint, distance, duration, elevation);
    }

    this.#workouts.push(workout);
    this._renderWorkout(workout);
    console.log(workout);

    inputDistance.value = inputDuration.value = inputCadence.value = "";
    // Add makret to the map
    L.marker(this.#clickedPoint)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 150,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.description}`)
      .openPopup();
    console.log(workout);
    this._hideForm();
  }

  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-in=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === "running" ? "🏃‍♂️" : "🚴‍♂️"
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🧘‍♂️</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">km</span>
          </div>`;
    if (workout.type === "running") {
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }
    if (workout.type === "cycling") {
      html += `
            <div class="workout__details">
            <span class="workout__icon">⏩</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon"></span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }
    form.insertAdjacentHTML("afterend", html);
  }

  _showForm(eventMap) {
    this.#clickedPoint = eventMap.latlng;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    form.getElementsByClassName.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    console.log(workoutEl.dataset.in);
  }
}

const app = new App();
