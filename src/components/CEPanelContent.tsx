
import { TypeButtonPanel, TypeWindow, TypeLayerConfig, TypeLangString } from 'geoview-core-types';
import { API } from '../utils/api';
import './style.css'
<script src="https://code.jquery.com/jquery-1.6.4.js"></script>

const w = window as TypeWindow;

const cgpv = w['cgpv'];

const { react } = cgpv;

const { createContext } = react;

/**
 * Panel Content Properties
 */
interface CEPanelContentProps {
  mapId: string;
  buttonPanel: TypeButtonPanel;
}

/**
 * Create a new panel content
 *
 * @param {CEPanelContentProps} props panel content properties
 * @returns {JSX.Element} the new create panel content
 */
export const CEPanelContent = (props: CEPanelContentProps): JSX.Element => {
  const { buttonPanel, mapId } = props;

  const { ui, react } = cgpv;

  const { useState, useEffect, useMemo } = react;
  

  useEffect(() => {

  }, []);


  var wmsLayerActive = true;

  function fetchAndDraw(){
    var rand = Math.floor(Math.random() * 4);
    var json =['07QD001', '07QD002', '10CE0X0', '05gc000'];
    //get a random bassin

    fetch('http://geogratis.gc.ca/services/delimitation/en/drainage-gen/'+json[rand]+'.json')
    .then(response => response.json())
    .then((jsonData) => {
      cgpv.api.map(mapId).layer.vector?.createGeometryGroup('myGometryGroup');
      const defaultId = cgpv.api.map(mapId).layer.vector?.defaultGeometryGroupId;
      for (const element of jsonData.geometry.coordinates){
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
    })
    .catch((error) => {
      console.error(error)
    });
  }
  
  
  function updateWmsLayer(){
    if (wmsLayerActive) {
      wmsLayerActive = false;
      fetchAndDraw();
    }
    else {
      wmsLayerActive = true;
      cgpv.api.map(mapId).layer.vector?.deleteGeometryGroup('myGometryGroup');


      console.log(cgpv.api);

      //const layerId = cgpv.api.map(mapId).layer.addLayer(config);
      //cgpv.api.maps.mapId.layer.layers.wmsLYR4.setVisible(false);

      //cgpv.api.maps.wmsLYR4.layer.layers.EsriFeaturewmsLYR4.setVisible(false);
    }
  }
  //cgpv.api.event.on(cgpv.api.eventNames.MAP.EVENT_MAP_SINGLE_CLICK, (payload) => { console.log(payload.coordinates.lnglat) }, 'ogcFeatureLYR7');
  //cgpv.api.event.on(cgpv.api.eventNames.MAP.
  return (
  <div>
    <button type="button" className='button-4' onClick={updateWmsLayer}>Activer/désactiver une layer GeoJson</button>
  </div>
    
  );
}
