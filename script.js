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
