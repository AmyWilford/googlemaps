let key = config.MY_KEY;

let map;
let markers = [];
let script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
// Function to initiate static map - center point Toronto, ON
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.38, lng: -79.22 },
    zoom: 8,
    disableDefaultUI: true, //remove?
  });
}

initMap;
document.head.appendChild(script);
// map options - including location and zoom lelvel
//   let options = {
//     zoom: 7,
//     center: { lat: 43.6532, lng: -79.3832 },
//   };
//   //   add map
//   let map = new google.maps.Map(document.getElementById("map"), options);
//   //   add marker
//   let marker = new google.maps.Marker({
//     position: { lat: 43.38, lng: -79.22 },
//     map: map,
//   });
//   //   infowindow
//   let infoWindow = new google.maps.InfoWindow({
//     content: "<div>Lake Ontario Waterfront</div>",
//   });
//   //   add event listener to marker on click
//   marker.addListener("click", function () {
//     infoWindow.open(map, marker);
//   });

//   function addMarker(coordinates) {
//     let marker = new google.maps.Marker({
//       position: coordinates,
//       map: map,
//     });
//   }

//   addMarker({ lat: 42.4668, lng: -70.9496 });
