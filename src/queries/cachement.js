// const axios = require('axios').default;

import axios from 'axios';
export async function getCachement(long, lat, projection){
  //activate loader icon
  document.getElementById('loader').style.visibility = "visible";;

  console.log(long + " " + lat + " " + projection)
  axios.get('http://localhost:3000/users/neo2/'+long+'/'+lat+'/'+projection)   
  .then(function (response) {
    console.log(response);
    const mapId = 'mapWM';
    cgpv.api.map(mapId).layer.vector?.deleteGeometryGroup('myGometryGroup');
    cgpv.api.map(mapId).layer.vector?.createGeometryGroup('myGometryGroup');
    const defaultId = cgpv.api.map(mapId).layer.vector?.defaultGeometryGroupId;
    if (response.data[0].row_to_json.features[0].geometry.type=='Polygon'){
        const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
          response.data[0].row_to_json.features[0].geometry.coordinates,{
            style: {
              strokeColor: '#3d85c6',
              strokeWidth: 5,
              strokeOpacity: 1,
            },
          }
        );
        cgpv.api.map(mapId).layer.vector?.addToGeometryGroup(
          geom, 'myGometryGroup'
        );
        cgpv.api.map(mapId).layer.vector?.deleteGeometriesFromGroup(defaultId);
    }
    else{
    for (const element of response.data[0].row_to_json.features[0].geometry.coordinates){
      const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
        element,{
          style: {
            strokeColor: '#3d85c6',
            strokeWidth: 5,
            strokeOpacity: 1,
          },
        }
      );
      cgpv.api.map(mapId).layer.vector?.addToGeometryGroup(
        geom, 'myGometryGroup'
      );
      cgpv.api.map(mapId).layer.vector?.deleteGeometriesFromGroup(defaultId);
    };
    }
    document.getElementById('loader').style.visibility = "hidden";;
  })
  .catch(function (error) { 
    document.getElementById('loader').style.visibility = "hidden";;    
    console.log(error);   })   
}
