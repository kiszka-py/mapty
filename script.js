"use strict";

const form = document.querySelector(".form");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputEvelation = document.querySelector(".form__input--evelation");

let map, clickedPoint;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      map = L.map("map").setView([latitude, longitude], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([latitude, longitude]).addTo(map);

      map.on("click", (eventMap) => {
        clickedPoint = eventMap.latlng;
        form.classList.remove("hidden");
        inputDistance.focus();
      });
    },
    function () {
      alert("Something went wrong");
    }
  );
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  inputDistance.value = inputDuration.value = inputCadence.value = "";
  // Add makret to the map
  L.marker(clickedPoint)
    .addTo(map)
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
});

inputType.addEventListener("change", () => {
  inputEvelation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
