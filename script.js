"use strict";

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      const map = L.map("map").setView([latitude, longitude], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
        .openPopup();

      map.on("click", (e) => {
        const clicked = e.latlng;
        L.marker(clicked)
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
          .setPopupContent(`<h2>${clicked.lat.toFixed(2)}</h2>`)
          .openPopup();
      });
    },
    function () {
      alert("Something went wrong");
    }
  );
}
