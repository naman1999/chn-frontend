
import Checkbox from '@mui/material/Checkbox';
import { AbstractGeoViewLayer, TypeButtonPanel, TypeWindow } from 'geoview-core-types';
import { API } from '../utils/api';
import './style.css'


const w = window as TypeWindow;

const cgpv = w['cgpv'];

const { react } = cgpv;

const { createContext } = react;

/**
 * Panel Content Properties
 */
interface LayerPanelContentProps {
  mapId: string;
  buttonPanel: TypeButtonPanel;
}

/**
 * Create a new panel content
 *
 * @param {CEPanelContentProps} props panel content properties
 * @returns {JSX.Element} the new create panel content
 */
export const LayerPanelContent = (props: LayerPanelContentProps): JSX.Element => {
  const { buttonPanel, mapId } = props;

  const { ui, react } = cgpv;

  const { useState, useEffect, useMemo } = react;
  

  useEffect(() => {

  }, []);

  
  var layersArray = (cgpv.api.map(mapId).layer as any).geoviewLayers;
  let layerList=[];
  console.log(layersArray);
  
  for (let key in layersArray) {
    (cgpv.api.map(mapId).layer as any).geoviewLayers[key]?.setVisible(false)
    layerList.push(
      <div key={key}>
        <input className='pannelCheckboxInput' type="checkbox" key={key} onChange={e=>updateLayer(e, key)} defaultChecked={(cgpv.api.map(mapId).layer as any).geoviewLayers[key]?.getVisible()} /><label key={key} className='pannelLabel'>Couche {key}</label>
      </div>
    );
  }
  console.log(cgpv.api.map(mapId));
  var geoJsonLayerActive = true;

  function fetchAndDraw(){
    var rand = Math.floor(Math.random() * 4);
    var json =['07QD001', '07QD002', '10CE0X0', '05gc000'];
    //get a random bassin

    fetch('http://geogratis.gc.ca/services/delimitation/en/drainage-gen/'+json[rand]+'.json')
    .then(response => response.json())
    .then((jsonData) => {
      for (const element of jsonData.geometry.coordinates){
        console.log(element);
        const geom = cgpv.api.map(mapId).layer.vector?.addPolygon(
          element,{
            style: {
              strokeColor: '#3d85c6',
              strokeWidth: 5,
              strokeOpacity: 1,
            },
          }
        );
        
      };
    })
    .catch((error) => {
      console.error(error)
    });
  }
  
  function addPolygon() {
    //cgpv.api.map(mapId).layer.vector?.setActiveGeometryGroup(document.getElementById('groupname').value);
    // call an api function to draw a polygon
    const polygon = cgpv.api.map(mapId).layer.vector?.addPolygon(
      [
        [
          [-109.05, 50],
          [-109.03, 54],
          [-102.05, 54],
          [-102.04, 50],
        ],
      ],
      {
        style: {
          strokeColor: '#000',
          strokeWidth: 5,
          strokeOpacity: 0.8,
        },
      }
    );
  }
  
  function updateGeoJsonLayer(){
    if (geoJsonLayerActive) {
      geoJsonLayerActive = false;
      fetchAndDraw();
    }
    else {
      const defaultId = cgpv.api.map(mapId).layer.vector?.defaultGeometryGroupId;
      geoJsonLayerActive = true;
      cgpv.api.map(mapId).layer.vector?.deleteGeometriesFromGroup(defaultId);
    }
  }

  function updateLayer(e:any, layerToUpdate:string){
    (cgpv.api.map(mapId).layer as any).geoviewLayers[layerToUpdate]?.setVisible(e.target.checked);
  }
  
  return (
  <div>
    { <button type="button" className='button-4' onClick={addPolygon}>Ajouter un polygon</button> }
     {layerList}
  </div>
    
  );
}
