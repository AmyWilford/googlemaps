let key = config.MY_KEY;

let script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;

let pollutionReports = JSON.parse(localStorage.getItem("pollutionReports"));
if (!pollutionReports) {
  pollutionReports = [];
  localStorage.setItem("pollutionReports", JSON.stringify(pollutionReports));
}
console.log(pollutionReports);

markers = [];

function initMap() {
  //   coordinates = { lat: 43.6532, lng: -79.3832 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: parseInt(pollutionReports[0].inputLat),
      lng: parseInt(pollutionReports[0].inputLng),
    },
    zoom: 5,
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
  });

  pollutionReports.forEach((el) => {
    console.log('working')
    let lat = el.inputLat*1
    let lng = el.inputLng*1;
    const marker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng,
      },
      map: map,
    });
    console.log(lat),
    console.log(lng)
    const infowindow = new google.maps.InfoWindow({
      content: `<div class="mb-1"><b>Your Pollution Concern:</b></div><div class="font-italic">${el.pollutionConcern}</div><div class="mt-2">Latitude: ${lat}</div><div> Longitude: ${lng}</div>`,
    });
    infowindow.close();

    markers.push(marker); // Add it to the list of markers
    console.log(markers);

    // Add a listener so that you can edit sites by clicking on the marker
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });
  });
}

window.initMap = initMap;
document.head.appendChild(script);
