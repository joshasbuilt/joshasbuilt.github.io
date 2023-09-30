var geojson = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "properties": {
        "message": "Foo",
        "iconSize": [30, 30]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [35.529260, 27.571190]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "message": "Bar",
        "iconSize": [30, 30]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-61.2158203125, -15.97189158092897]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "message": "Baz",
        "iconSize": [30, 30]
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-63.29223632812499, -18.28151823530889]
      }
    }
  ]
};
console.error = (function(oldFunction) { 
  return function(error) {
      if (typeof error.message === 'string') {
          if(error.message.includes('high-color') || 
             error.message.includes('space-color') || 
             error.message.includes('star-intensity')) {
              // Ignore or handle this error
              console.warn('Ignoring error: ' + error.message);
          } else {
              oldFunction(error);
          }
      } else {
          oldFunction(error);
      }
  };
}(console.error.bind(console)));



mapboxgl.accessToken = 'pk.eyJ1IjoiYWJtYXBzLW94YWdvbiIsImEiOiJjbG1zazJrNGcwNThlMnFvYndvZnFhdHk3In0.dnC_jPlnMcm-N9miVX_98w';

var map = new mapboxgl.Map({
  container: 'map',
  attributionControl: false,
  style: 'mapbox://styles/abmaps-oxagon/clmu25s9u01zw01r80r1ogozg',
  center: [35.529260, 27.571190],
  zoom: 13,
  preserveDrawingBuffer: true,
  projection: 'mercator'
}).on('error', function(e) { 
      console.error(e);  // For other errors, log them to the console
  
});



//add markers to map
geojson.features.forEach(function(marker) {
  // create a DOM element for the marker
  var el = document.createElement('div');
  el.className = 'marker';
  el.style.backgroundImage =
    //'url(https://placekitten.com/g/' + marker.properties.iconSize.join('/') + '/)';
    "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gNjUK/9sAQwALCAgKCAcLCgkKDQwLDREcEhEPDxEiGRoUHCkkKyooJCcnLTJANy0wPTAnJzhMOT1DRUhJSCs2T1VORlRAR0hF/9sAQwEMDQ0RDxEhEhIhRS4nLkVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVF/8AAEQgAHgAeAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8ArrdWtqgbmUEA/KpB59OxqpL4uiifYLcjju3IqhDqYbR4g7oE2gLtGST6cViSWRvYWuxOFzIyyD+7wOfpQB28etx3MBeSKTsAid8+pPSr5tOBlSPYmvPdLvLkyGGNpYpN3OPT3rRbx/PBI0X2VHWM7Qd3JxQBqaRoNrldLDE/aDtZmXO1vTp+H1rb1H4c3cNrCkEfnKpHm7ZCS6DtjGev9a0vDvhgPPHfzT5jVyyRjnackZ/rXofQUAeFxaNFa3RgjtZLZ2wpaRSMj15rYX4Nq43m5zu54NerbY7hD5sauMkYYZp5GzABIHpQB//Z')";
  el.style.width = marker.properties.iconSize[0] + 'px';
  el.style.height = marker.properties.iconSize[1] + 'px';

  el.addEventListener('click', function() {
    window.alert(marker.properties.message);
  });

  // add marker to map
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
});

