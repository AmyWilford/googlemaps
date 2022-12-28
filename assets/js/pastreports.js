let key = config.MY_KEY;

let script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;

// Pull pollution reports from local storage
let pollutionReports = JSON.parse(localStorage.getItem("pollutionReports"));
if (!pollutionReports) {
  pollutionReports = [];
  localStorage.setItem("pollutionReports", JSON.stringify(pollutionReports));
}
console.log(pollutionReports);

// Create empty array to hold pollution report markers
const markers = [];

// Function to create map - center will load to location of last pollution report.
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: pollutionReports[pollutionReports.length - 1].inputLat * 1,
      lng: pollutionReports[pollutionReports.length - 1].inputLng * 1,
    },
    zoom: 12,
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
  });

  //  For each pollution report create a marker
  pollutionReports.forEach((el) => {
    console.log("working");
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

    let table = document.getElementById("tableReports");
    let newTableRow = document.createElement("tr");
    newTableRow.setAttribute("scope", "row");
    let tdDate = document.createElement("td");
    let tdLocation = document.createElement("td");
    let tdConcern = document.createElement("td");

    tdDate.innerHTML = el.date;
    tdLocation.innerHTML = `${lat} & ${lng}`;
    tdConcern.innerHTML = el.pollutionConcern;
    table.append(newTableRow);
    newTableRow.append(tdDate, tdLocation, tdConcern);
  });
}

window.initMap = initMap;
document.head.appendChild(script);
