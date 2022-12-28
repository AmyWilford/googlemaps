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
    center: { lat: parseInt(pollutionReports[pollutionReports.length-1].pollutionLat), lng: parseInt(pollutionReports[pollutionReports.length-1].pollutionLng) },
    zoom: 7,
    disableDefaultUI: true,
  });

  pollutionReports.forEach((e) => {
    const marker = new google.maps.Marker({
      position: {
        lat: parseInt(e.pollutionLat)*1,
        lng: parseInt(e.pollutionLng)*1,
      },
      map: map,
      // icon: './assets/images/campsite.png',
      //   content: e.pollutionConcern
    });
    const infowindow = new google.maps.InfoWindow({
      content: `<div>${e.pollutionConcern}<div><div>${e.pollutionLat} & ${e.pollutionLng}</div>`
    });

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
