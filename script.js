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
}).on('error', function (e) {
    console.error(e);  // For other errors, log them to the console
});



map.on('load', function () {
    map.loadImage('green.png', function(error, image) {
        if (error) throw error;
        map.addImage('green-marker', image);

        map.addSource('myGeoJSON', {
            type: 'geojson',
            data: geojson
        });

        map.addLayer({
            id: 'imageMarkers',
            type: 'symbol',
            source: 'myGeoJSON',
            layout: {
                'icon-image': 'green-marker',
                'icon-size': 0.5 // You can adjust the size here
            }
        });

        map.addLayer({
            id: 'myGeoJSONLayer',
            type: 'circle',
            source: 'myGeoJSON',
            paint: {
                'circle-radius': 10,
                'circle-color': '#ff00ff'
            }
        });
    });

    map.addSource('w3w-grid', {
      type: 'geojson',
      data: {
          type: 'FeatureCollection',
          features: []
      }
  });

  map.addLayer({
      id: 'w3w-grid',
      type: 'line',
      source: 'w3w-grid',
      layout: {},
      paint: {
          'line-color': '#777777',
          'line-width': 1
      }
  });


        // This is the new part
        map.on('click', 'myGeoJSONLayer', function () {
          navigator.clipboard.writeText('Hello World')
          .then(() => {
              console.log('Text successfully copied to clipboard');
          })
          .catch(err => {
              console.error('Unable to copy text to clipboard', err);
          });
      });

    map.on('mouseenter', 'myGeoJSONLayer', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'myGeoJSONLayer', function () {
        map.getCanvas().style.cursor = '';
    });
});


map.on('moveend', async function () {
  if (map.getZoom() < 18) { // Add this check
    return; // If the zoom level is less than 18, exit the function early
  }

  var bounds = map.getBounds();
  var sw = bounds.getSouthWest();
  var ne = bounds.getNorthEast();

  console.log(sw, ne);  // Log the bounding box coordinates for verification

  var url = `https://api.what3words.com/v3/grid-section?bounding-box=${sw.lat},${sw.lng},${ne.lat},${ne.lng}&key=7BCLI9JJ`;

  console.log(url);  // Log the full request URL for verification

  try {
      let response = await fetch(url);

      if (!response.ok) {
          let errorMsg = await response.text();
          console.error('Error response', response.status, errorMsg);
          return;
      }

      let data = await response.json();
      console.log(data);

      // Correcting the structure of the data
      if (data.lines) {
          map.getSource('w3w-grid').setData({
              type: 'FeatureCollection',
              features: data.lines.map(line => ({
                  type: 'Feature',
                  geometry: {
                      type: 'LineString',
                      coordinates: [
                          [line.start.lng, line.start.lat],
                          [line.end.lng, line.end.lat]
                      ]
                  }
              }))
          });
      }
  } catch (error) {
      console.error('Fetch error', error);
  }
});
