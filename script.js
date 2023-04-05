"use strict";

const form = document.querySelector(".form");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
  date = new Date();
  id = Date.now();

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / this.duration / 60;
    return this.speed;
  }
}

const run1 = new Running([50, 20], 5.2, 24, 170);
const cycl1 = new Cycling([50, 20], 27, 95, 503);
console.log(run1, cycl1);

class App {
  #map;
  #clickedPoint;

  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleElevationField);
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
    e.preventDefault();

    inputDistance.value = inputDuration.value = inputCadence.value = "";
    // Add makret to the map
    L.marker(this.#clickedPoint)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 100,
          minWidth: 50,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent(`Workout: `)
      .openPopup();
  }

  _showForm(eventMap) {
    this.#clickedPoint = eventMap.latlng;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }
}

const app = new App();
