let key = config.MY_KEY;

// Create script tag & link google api url with config key
let script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;

let map;
let markers = [];
let marker;
let geocoder;
let responseDiv;
let response;
let pollutionLat;
let pollutionLng;

let coordinates;
let lat = 43.6532;
let lng = -79.3832;
// let coordinates = { lat: 43.6532, lng: -79.3832 };
// Function to initiate static map - center point Toronto, ON

// function getValues() {
//   let receivedLat = document.getElementById("lat");
//   console.log(receivedLat.value);
//   let receivedLng = document.getElementById("lng");
//   lat = parseInt(receivedLat.value);
//   console.log(lat);
//   lng = parseInt(receivedLng.value);
//   console.log(lng);
//   // coordinates = { lat: 43.6532, lng: -79.3832 };

//   initMap();
// }
function initMap() {
  coordinates = { lat: lat, lng: lng };

  map = new google.maps.Map(document.getElementById("map"), {
    center: coordinates,
    zoom: 7,
    disableDefaultUI: true,
  });

  geocoder = new google.maps.Geocoder();

  const inputText = document.createElement("input");

  inputText.type = "text";
  inputText.placeholder = "Search your location";

  const submitButton = document.createElement("input");

  submitButton.type = "button";
  submitButton.value = "Geocode";
  submitButton.classList.add("btn", "btn-success");

  const clearButton = document.createElement("input");

  clearButton.type = "button";
  clearButton.value = "Clear";
  clearButton.classList.add("button", "button-secondary");
  response = document.createElement("pre");
  response.id = "response";
  response.innerText = "";
  responseDiv = document.createElement("div");
  responseDiv.id = "response-container";
  responseDiv.appendChild(response);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  // map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);
  marker = new google.maps.Marker({
    map,
  });
  map.addListener("click", (e) => {
    geocode({ location: e.latLng });
  });
  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
  );
  clearButton.addEventListener("click", () => {
    clear();
  });
  clear();

  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });

  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get Lat/Lng!",
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
    console.log(JSON.stringify(mapsMouseEvent.latLng.toJSON().lat));
    console.log(JSON.stringify(mapsMouseEvent.latLng.toJSON().lng));
    pollutionLat = JSON.stringify(mapsMouseEvent.latLng.toJSON().lat);
    pollutionLng = JSON.stringify(mapsMouseEvent.latLng.toJSON().lng);
    infoWindow.open(map);
  });
}

function clear() {
  marker.setMap(null);
  responseDiv.style.display = "none";
}

function geocode(request) {
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      responseDiv.style.display = "block";
      response.innerText = JSON.stringify(result, null, 2);
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

function placeMarkerAndPanTo(latLng, map) {
  new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}

function submitPollutionReport(event) {
  event.preventDefault();
  let inputLat = document.getElementById("lat").value;
  let inputLng = document.getElementById("lng").value;
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let pollutionConcern = document.getElementById("pollutionConcern").value;

  if (inputLat || inputLng) {
    pollutionLat = inputLat;
    pollutionLng = inputLng;
  }

  let report = {
    pollutionLat,
    pollutionLng,
    name,
    email,
    pollutionConcern,
  };

  console.log(report);
  console.log("working");
}

let submitReport = document.getElementById("submit-report");
submitReport.addEventListener("click", submitPollutionReport);
window.initMap = initMap;
document.head.appendChild(script);
