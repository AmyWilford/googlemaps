// Function to initiate static map - center point Toronto, ON
function initMap() {
    let options = {
      zoom: 14,
      center: { lat: 43.6532, lng: -79.3832 },
    };
  
    let map = new google.maps.Map(document.getElementById("map"), options);
  }
