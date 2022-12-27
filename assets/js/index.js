let key = config.MY_KEY;

let map;
let markers = [];
let script = document.createElement("script");
let coordinates;

// let coordinates = { lat: 43.6532, lng: -79.3832 };
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
// Function to initiate static map - center point Toronto, ON

function pageChange() {
  const home = document.getElementById("home");
  home.style.display = "none";
  const body = document.getElementById("body");
  body.style.display = "block";
}
function getValues() {
  let receivedLat = document.getElementById("lat");
  console.log(receivedLat.value);
  let receivedLng = document.getElementById("lng");
  let lat = parseInt(receivedLat.value);
  console.log(lat);
  let lng = parseInt(receivedLng.value);
  console.log(lng);
  coordinates = { lat: lat, lng: lng };
  initMap();
}
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: coordinates,
    zoom: 7,
    disableDefaultUI: true, //remove?
  });
}

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
