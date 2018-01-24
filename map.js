const qs = require('querystring');

const markers = [];

function removeMarkers(map) {
  while (markers.length) {
    map.removeLayer(markers.pop());
  }
}

function fetchData(map) {
  const { lng, lat } = map.getCenter();
  const params = {
    longitude: lng,
    latitude: lat,
    radius: 1000000,
  };
  fetch(`/bahnparking?${qs.stringify(params)}`, {
  })
  .then((response) => {
    if (response.status !== 200) {
      throw new Error(`Provider failed with ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then((result) => {
    removeMarkers(map);
    result.forEach((parking) => {
      const marker = new L.Marker(new L.LatLng(parking.latitude, parking.longitude), {
        icon: L.BeautifyIcon.icon({
          isAlphaNumericIcon: true,
          text: parking.vacant,
        }),
      });
      map.addLayer(marker);
      markers.push(marker);
    });
  })
  .catch((e) => {
    console.log(e.message);
  });
}

function prepareMap() {
  const map = L.map('map');
  const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  const osm = new L.TileLayer(osmUrl, {minZoom: 6, maxZoom: 24, attribution: osmAttrib});
  map.setView(new L.LatLng(50.9375, 6.9603), 9);
  map.addLayer(osm);
  map.on('moveend', _ => fetchData(map));
  fetchData(map);
}

document.addEventListener('DOMContentLoaded', prepareMap, false);
