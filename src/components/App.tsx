import React, { useEffect, useState } from 'react';

import makeStyles from '@mui/styles/makeStyles';

import {ToolboxPopup} from './ToolboxPopup'
import { CEPanelContent } from './CEPanelContent';
import { Toolbox } from './Toolbox';

import translationEn from '../../public/locales/en/translation.json';
import translationFr from '../../public/locales/fr/translation.json';

import {
  TypeIconButtonProps,
  TypePanelProps,
  TypeWindow,
} from 'geoview-core-types';

import"./style.css"

// get reference to window object
const w = window as TypeWindow;

// get reference to geoview apis
const cgpv = w['cgpv'];

/**
 * main container and map styling
 */
const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
  },
}));



/**
 * Create a container containing a leaflet map using the GeoView viewer
 *
 * @returns {JSX.Elemet} the element that creates the container and the map
 */
const App = (): JSX.Element => {
  const classes = useStyles();

  function logCoordinates(){
    console.log("coordinates");
  } 
  const [visibility, setVisibility] = useState(false);
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  

  var PannelIcon = cgpv.ui.elements.ChevronRightIcon;
  console.log("PannelIcon", PannelIcon);
  const toolButton: TypeIconButtonProps = {
    // set ID to ceButtonPanel so that it can be accessed from the core viewer
    id: 'toolboxButtonPanel',
    tooltip: 'Tool box',
    tooltipPlacement: 'right',
    children: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" className="svg-toolbox">
    <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
  </svg>
  
  
  ,
    visible: true,
    onClick: ()=>popupCloseHandler(true),
  };

  const popupCloseHandler = (e:boolean) => {
    setVisibility(e);
  };
  /**
   * initialize the map after it has been loaded
   */
  useEffect(() => {
    cgpv.init(() => {
      /**
       * translations object to inject to the viewer translations
       */
      const translations = {
        'en': translationEn,
        'fr': translationFr,
      };

      // get map instance
      const mapInstance = cgpv.api.map('mapWM');

      // add custom languages
      mapInstance.i18nInstance.addResourceBundle(
        'en',
        'translation',
        translations['en'],
        true,
        false,
      );
      mapInstance.i18nInstance.addResourceBundle(
        'fr',
        'translation',
        translations['fr'],
        true,
        false,
      );

      const language = 'en';

      const MapIcon = cgpv.ui.elements.MapIcon;
      const LayerIcon = cgpv.ui.elements.LayersIcon;

      
      // button props
      const ceButton: TypeIconButtonProps = {
        // set ID to ceButtonPanel so that it can be accessed from the core viewer
        id: 'ceButtonPanel',
        tooltip: translations[language].custom.cePanelTitle,
        tooltipPlacement: 'right',
        children: <LayerIcon />,
        visible: true,
      };

      // panel props
      const cePanel: TypePanelProps = {
        title: translations[language].custom.cePanelTitle,
        icon: <LayerIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const ceButtonPanel = cgpv.api
        .map('mapWM')
        .appBarButtons.createAppbarPanel(ceButton, cePanel, null);

      
      ceButtonPanel?.panel?.changeContent(
        <CEPanelContent buttonPanel={ceButtonPanel} mapId={'mapWM'} />,
      );

      //ajout du bouton toolbox
      cgpv.api.map('mapWM').navBarButtons.createNavbarButton(toolButton, '');
      
    });
  }, []);

  return (
    <div>
      <ToolboxPopup
        onClose={popupCloseHandler}
        show={visibility}
        title="Tool Box"
        setLat={setLat}
        setLong={setLong}
        lat={lat}
        long={long}
      />
      <div
    onClick={logCoordinates}
    id="mapWM"
    className={`llwp-map ${classes.container}`}
    style={{
      height: '100vh',
      zIndex: 0,
    }}
    data-lang="en"
    data-config="{
      'map': {
        'interaction': 'dynamic',
        'viewSettings': {
          'zoom': 4,
          'center': [-100, 60],
          'projection': 3978
        },
        'basemapOptions': {
          'id': 'transport',
          'shaded': false,
          'labeled': true
        },
        'listOfGeoviewLayerConfig': [
          {
            'layerId': 'wmsLYR4',
            'layerName': { 'en': 'A' },
            'metadataAccessPath': { 'en': 'https://maps.geogratis.gc.ca/wms/hydro_network_en'},
            'geoviewLayerType': 'ogcWms',
            'listOfLayerEntryConfig': [
              {
                'layerId': 'hydro_network'
              }
            ]
          },
          {
            'layerId': 'ogcFeatureLYR7',
            'layerName': {
              'en': 'Large Lakes',
              'fr': 'Large Lakes'
            },
            'metadataAccessPath': {
              'en': 'https://b6ryuvakk5.execute-api.us-east-1.amazonaws.com/dev',
              
              'fr': 'https://b6ryuvakk5.execute-api.us-east-1.amazonaws.com/dev'
            },
            'geoviewLayerType': 'ogcFeature',
            'listOfLayerEntryConfig': [
              {
                'layerId': 'lakes'
              }
            ]
          }
        ]
      },
      'theme': 'dark',
      'suportedLanguages': ['en', 'fr'],
      'corePackages': ['basemap-panel']
      }"
  ></div>
  </div>
    
  );
};

export default App;
