// variable to hold API key value
let key = config.MY_KEY;

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
let thankYouMessage = document.getElementById("thankYouMessage");
let coordinates;

// JQuery Date Picker
$(function () {
  $("#datepicker").datepicker({ maxDate: new Date(), autoclose: true });
});
// Function to reload page
function reload() {
  document.location.href = "index.html";
  thankYouMessage.classList.add('d-none')
}
document.getElementById("confirmationRelaod").addEventListener("click", reload);

// Function to open past reports page
function openPastReports() {
  document.location.href = "pastreports.html";
}
// Add event listener to button to change page
seeReportsButton.addEventListener("click", openPastReports);
document
  .getElementById("confirmationSeeReports")
  .addEventListener("click", openPastReports);

// Function to initiate map - center point begins at Toronto
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

  // Place input and search button on the  map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  // Set a marker on the center point of map
  marker = new google.maps.Marker({
    map,
  });
  // Add click event listener to map - use geocode to grab location
  map.addListener("click", (e) => {
    geocode({ location: e.latLng });
  });
  // Add click event listener to submit button to change geocode address
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
    position: { lat: 43.6532, lng: -79.3832 },
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
    // Get latitude and logitude of geocoded area - use JSON.stringify to access object data - set values to auto fill the Lat and Lng form fields
    pollutionLat = JSON.stringify(mapsMouseEvent.latLng.toJSON().lat);
    inputLatField.value = pollutionLat;
    pollutionLng = JSON.stringify(mapsMouseEvent.latLng.toJSON().lng);
    inputLngField.value = pollutionLng;
    infoWindow.open(map);
  });
}

// Function clear previous markers
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

// Get previous pollution reports from local storage.
let pollutionReports = JSON.parse(localStorage.getItem("pollutionReports"));
if (!pollutionReports) {
  pollutionReports = [];
  localStorage.setItem("pollutionReports", JSON.stringify(pollutionReports));
}

// Function to generate random UUID for each report
function create_UUID() {
  let dt = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
// Function to reset form
function reset() {
  document.getElementById("report-form").reset();
}

// Function to submit pollition report
function submitPollutionReport(event) {
  event.preventDefault();
  // Access all form input values
  let inputLat = inputLatField.value;
  let inputLng = inputLngField.value;
  let userName = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let pollutionConcern = document.getElementById("pollutionConcern").value;
  let date = document.getElementById("datepicker").value;
  let image = document.getElementById("formFile").value;
  let uuid = create_UUID();
  thankYouMessage.classList.add("d-block");
  document.getElementById("report-form").classList.add("d-none");
  // Set form values as Object called report
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
  // Push new report to pollutionReports array and set into local storage
  pollutionReports.push(report);
  if (report) {
    localStorage.setItem("pollutionReports", JSON.stringify(pollutionReports));
  }
  // Reset form
  reset();
}

// On form submit, run submitPollutionReport function
let reportForm = document.getElementById("report-form");
reportForm.addEventListener("submit", submitPollutionReport);

// Init map and append script file with google maps api url
window.initMap = initMap;
document.head.appendChild(script);
