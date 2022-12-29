// variable to hold API key value
let key = config.MY_KEY;

// Create script tag & link google api url with config key
let script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;

// Establish global variables
let lat;
let lng;
let warning = document.getElementById("noReportsWarning");
let table = document.getElementById('tableReports')

// Pull pollution reports from local storage
let pollutionReports = JSON.parse(localStorage.getItem("pollutionReports"));
if (!pollutionReports) {
  pollutionReports = [];
  localStorage.setItem("pollutionReports", JSON.stringify(pollutionReports));
}
// If there are no pollution reports in local storage - set lat/lng to Toronto. 
// Hide previous reports table and show no reports warning - Else, set to location of last submitted report
if (pollutionReports.length < 1) {
     warning.classList.add("d-block");
     table.classList.add('d-none')
  lat = 43.6532;
  lng = -79.3832;
} else {
  warning.classList.add("d-none");
  table.classList.add('d-block')
  lat = pollutionReports[pollutionReports.length - 1].inputLat * 1;
  lng = pollutionReports[pollutionReports.length - 1].inputLng * 1;
}
// Create empty array to hold pollution local storage report markers
const markers = [];

// Function to create map - center will load to location of last pollution report.
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: lat,
      lng: lng,
    },
    zoom: 12,
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
  });

  //  For each pollution report create a marker
  pollutionReports.forEach((el) => {
    let lat = el.inputLat * 1;
    let lng = el.inputLng * 1;
    const marker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng,
      },
      map: map,
    });
    // For each pollution report create an info window with content pulled from pollutionreports in local stroage
    const infowindow = new google.maps.InfoWindow({
      content: `<div class="mb-1"><b>Your Pollution Concern:</b></div>
      <div class="font-italic">${el.pollutionConcern}</div>
      <div class="mt-2">Latitude: ${lat}</div>
      <div> Longitude: ${lng}</div>`,
    });
    // Push single marker to markers array
    markers.push(marker);

    // Add listener to marker to open info window on click
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });

    // Create table row and td elements to hold previous report data - set inner HTML
    let newTableRow = document.createElement("tr");
    newTableRow.setAttribute("scope", "row");
    let tdDate = document.createElement("td");
    let tdLocation = document.createElement("td");
    let tdConcern = document.createElement("td");

    tdDate.innerHTML = el.date;
    tdLocation.innerHTML = `${lat} & ${lng}`;
    tdConcern.innerHTML = el.pollutionConcern;
    // Append new table row to table
    table.append(newTableRow);
    // Append td to table row
    newTableRow.append(tdDate, tdConcern, tdLocation);
  });
}

// Function to redirect to home page on click
function goHome() {
  document.location.href = "index.html";
}
let homeButton = document.getElementById("homeButton");
homeButton.addEventListener("click", goHome);

// Init map and append script file with google maps api url
window.initMap = initMap;
document.head.appendChild(script);
