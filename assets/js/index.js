// variable to hold API key value
let key = MY_KEY;

// Create script tag & link google api url with config key
let script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;

// Establish global variables
let map;
let marker;
let geocoder;
let pollutionLat;
let pollutionLng;
let inputLatField = document.getElementById("lat");
let inputLngField = document.getElementById("lng");
let seeReportsButton = document.getElementById("pastReportsButton");
let coordinates

// DatePicker
$(function () {
  $("#datepicker").datepicker({ maxDate: new Date(), autoclose: true });
});

// Function to initiate map - center point begins
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.6532, lng: -79.3832 },
    zoom: 12,
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
  });
  // establish google maps Geocoder
  geocoder = new google.maps.Geocoder();

  // Create geocoder search input and set attributes
  const inputText = document.createElement("input");
  inputText.classList.add("p-2", "m-2");
  inputText.type = "text";
  inputText.placeholder = "Search your location";

  // Create geocoder search button and set attributes
  const submitButton = document.createElement("input");
  submitButton.type = "button";
  submitButton.value = "search";
  submitButton.classList.add("btn", "search-button", "m-2", "btn-sm");

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  marker = new google.maps.Marker({
    map,
  });
  // Add event listener to map - use geocode to grab location
  map.addListener("click", (e) => {
    geocode({ location: e.latLng });
  });
  // Add event listener to submit button to change geocode address
  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
  );

  // Event listener to show lat and lng of area on click
  map.addListener("click", (e) => {
    placeMarker(e.latLng, map);
  });

  // Info window will show coordaintes
  let infoWindow = new google.maps.InfoWindow({
    content: "Zoom in to pin the pollution location",
    position: coordinates,
  });

  infoWindow.open(map);
  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow.
    infoWindow.close();
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent(
      JSON.stringify(
        mapsMouseEvent.latLng.toJSON().lat +
          " & " +
          mapsMouseEvent.latLng.toJSON().lng
      )
    );
    pollutionLat = JSON.stringify(mapsMouseEvent.latLng.toJSON().lat);
    inputLatField.value = pollutionLat;
    pollutionLng = JSON.stringify(mapsMouseEvent.latLng.toJSON().lng);
    inputLngField.value = pollutionLng;
    infoWindow.open(map);
  });
}

function clear() {
  marker.setMap(null);
}

// Function to reset map per geolocation search
function geocode(request) {
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}
// function to place marker and move map
function placeMarker(latLng) {
  if (marker) {
    marker.setPosition(latLng);
  } else {
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
    });
  }
}

function openPastReports() {
  document.location.href = "pastreports.html";
}

// let pastReportsPage = document.getElementById("pastReportsButton");
seeReportsButton.addEventListener("click", openPastReports);

// Get previous pollution reports from local storage
let pollutionReports = JSON.parse(localStorage.getItem("pollutionReports"));
if (!pollutionReports) {
  pollutionReports = [];
  localStorage.setItem("pollutionReports", JSON.stringify(pollutionReports));
}

console.log(pollutionReports);

// Function to generate random UUID for each report
function create_UUID() {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function submitPollutionReport(event) {
  event.preventDefault();
  let inputLat = inputLatField.value;
  let inputLng = inputLngField.value;
  let userName = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let pollutionConcern = document.getElementById("pollutionConcern").value;
  let date = document.getElementById("datepicker").value;
  let image = document.getElementById("formFile").value;
  let uuid = create_UUID();

  // Set report in an object
  let report = {
    inputLat,
    inputLng,
    id: uuid,
    userName,
    email,
    date,
    pollutionConcern,
    image,
  };
  pollutionReports.push(report);
  if (report) {
    localStorage.setItem("pollutionReports", JSON.stringify(pollutionReports));
  }
  reset();
}

function reset() {
  document.getElementById("report-form").reset();
}

// On form submit, run submitPollutionReport function
let reportForm = document.getElementById("report-form");
reportForm.addEventListener("submit", submitPollutionReport);

window.initMap = initMap;
document.head.appendChild(script);
