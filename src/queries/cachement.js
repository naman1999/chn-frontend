import axios from 'axios';
const mapId = 'mapWM';

export async function getCachement(long, lat, projection) {
  //activate loader icon
  document.getElementById('loader').style.visibility = "visible";;

  const defaultId = cgpv.api.map(mapId).layer.vector?.defaultGeometryGroupId;
  console.log(long + " " + lat + " " + projection)
  axios.get('http://localhost:3000/users/neo2/' + long + '/' + lat + '/' + projection)
    .then(function (response) {
      console.log(response);
      //cgpv.api.map(mapId).layer.vector?.deleteGeometriesFromGroup(defaultId);
      if (response.data[0].row_to_json.features[0].geometry.type == 'Polygon') {
        cgpv.api.map(mapId).layer.vector?.deleteGeometry(geom);
        const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
          response.data[0].row_to_json.features[0].geometry.coordinates, {
          style: {
            strokeColor: '#3d85c6',
            strokeWidth: 5,
            strokeOpacity: 1,
          },
        }
        );
      }
      else {
        for (const element of response.data[0].row_to_json.features[0].geometry.coordinates) {
          const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
            element, {
            style: {
              strokeColor: '#3d85c6',
              strokeWidth: 5,
              strokeOpacity: 1,
            },
          }
          );
        };
      }
      document.getElementById('loader').style.visibility = "hidden";
    })
    .catch(function (error) {
      document.getElementById('loader').style.visibility = "hidden";
      console.log(error);
    })
}

export async function testGetCachement(long, lat, projection) {
  console.log('testGetCachement');
  const mapId = 'mapWM';
  const defaultId = cgpv.api.map(mapId).layer.vector?.defaultGeometryGroupId;
  //activate loader icon
  document.getElementById('loader').style.visibility = "visible";

  const data = await fetch("./exampleSmall.json");
  const response = await data.json();
  
  //clear geometries from default group
  //----------------------------------- Ligne qui ne foncitonne pas ----------------------------------------------------
  //cgpv.api.map(mapId).layer.vector?.deleteGeometriesFromGroup(defaultId);

  //add the geometries to the default group
  if (response.data[0].row_to_json.features[0].geometry.type == 'Polygon') {
    //addLayer(response.data[0].row_to_json);
    //addLayer('exampleSmall.js');
    const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
      response.data[0].row_to_json.features[0].geometry.coordinates, {
        style: {
          strokeColor: '#3d85c6',
          strokeWidth: 5,
          strokeOpacity: 1,
        },
      }
    );
  }
  else {
    for (const element of response.data[0].row_to_json.features[0].geometry.coordinates) {
      const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
        element, {
        style: {
          strokeColor: '#3d85c6',
          strokeWidth: 5,
          strokeOpacity: 1,
        },
      }
      );
    };
  }
  document.getElementById('loader').style.visibility = "hidden";
}

export async function getDownstream(long, lat, projection) {
  const mapId = 'mapWM';
  console.log(long + " " + lat + " " + projection)
  axios.get('http://localhost:3000/users/downstream/' + long + '/' + lat + '/' + projection)
    .then(function (response) {
      console.log(response);
      const defaultId = cgpv.api.map(mapId).layer.vector?.defaultGeometryGroupId;
      cgpv.api.map(mapId).layer.vector?.deleteGeometriesFromGroup(defaultId);
      if (response.data[0].row_to_json.features[0].geometry.type == 'Polygon') {
        const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
          response.data[0].row_to_json.features[0].geometry.coordinates, {
          style: {
            strokeColor: '#3d85c6',
            strokeWidth: 5,
            strokeOpacity: 1,
          },
        }
        );
      }
      else {
        for (const element of response.data[0].row_to_json.features[0].geometry.coordinates) {
          const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
            element, {
            style: {
              strokeColor: '#3d85c6',
              strokeWidth: 5,
              strokeOpacity: 1,
            },
          }
          );
        };
      }
    })
    .catch(function (error) {
      document.getElementById('loader').style.visibility = "hidden";
      console.log(error);
    })
}

function addLayer(geoJson){
  console.log(geoJson);
  const layerID = cgpv.api.map(mapId).layer.addGeoviewLayer(
    {
      'geoviewLayerId': 'geoJsonSample',
      'geoviewLayerName': {
        'en': 'geojson sample',
        'fr': 'exemple geojson'
      },
      'geoviewLayerType': 'GeoJSON',
      'metadataAccessPath': './geojson/metadata.json',
      'listOfLayerEntryConfig': [
        {
          'layerId': 'exampleSmall.json'
        }
      ]
    },
    ['en', 'fr']
  );
}