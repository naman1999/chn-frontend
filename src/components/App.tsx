import React, { useEffect, useState } from 'react';

import makeStyles from '@mui/styles/makeStyles';

import { LayerPanelContent } from './LayerPanelContent';

import translationEn from '../../public/locales/en/translation.json';
import translationFr from '../../public/locales/fr/translation.json';

import {
  TypeIconButtonProps,
  TypePanelProps,
  TypeWindow,
} from 'geoview-core-types';

import"./style.css"
import { Toolbox } from './Toolbox';

// get reference to window object
const w = window as TypeWindow;

// get reference to geoview apis
const cgpv = w['cgpv'];

/**
 * main container and map styling
 */
const useStyles = makeStyles(() => ({
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

  const [toolboxVisibility, setToolboxVisibility] = useState(false);
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");

  const toolboxButton: TypeIconButtonProps = {
    // set ID to toolboxButtonPanel so that it can be accessed from the core viewer
    id: 'toolboxButtonPanel',
    tooltip: 'Tool box',
    tooltipPlacement: 'right',
    children:
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="svg-toolbox">
      <path fill-rule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clip-rule="evenodd" />
      <path d="M10.076 8.64l-2.201-2.2V4.874a.75.75 0 00-.364-.643l-3.75-2.25a.75.75 0 00-.916.113l-.75.75a.75.75 0 00-.113.916l2.25 3.75a.75.75 0 00.643.364h1.564l2.062 2.062 1.575-1.297z" />
      <path fill-rule="evenodd" d="M12.556 17.329l4.183 4.182a3.375 3.375 0 004.773-4.773l-3.306-3.305a6.803 6.803 0 01-1.53.043c-.394-.034-.682-.006-.867.042a.589.589 0 00-.167.063l-3.086 3.748zm3.414-1.36a.75.75 0 011.06 0l1.875 1.876a.75.75 0 11-1.06 1.06L15.97 17.03a.75.75 0 010-1.06z" clip-rule="evenodd" />
    </svg>,
    visible: true,
    onClick: ()=>toolboxCloseHandler(true),
  };

  const toolboxCloseHandler = (e:boolean) => {
    setToolboxVisibility(e);
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

      const LayerIcon = cgpv.ui.elements.LayersIcon;

      
      // pannel - layer button props
      const layerButton: TypeIconButtonProps = {
        // set ID to layerButtonPanel so that it can be accessed from the core viewer
        id: 'layerButtonPanel',
        tooltip: translations[language].custom.cePanelTitle,
        tooltipPlacement: 'right',
        children: <LayerIcon />,
        visible: true,
      };

      // layer panel props
      const layerPanel: TypePanelProps = {
        title: translations[language].custom.cePanelTitle,
        icon: <LayerIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const layerButtonPanel = cgpv.api
        .map('mapWM')
        .appBarButtons.createAppbarPanel(layerButton, layerPanel, null);
      
        layerButtonPanel?.panel?.changeContent(
        <LayerPanelContent buttonPanel={layerButtonPanel} mapId={'mapWM'} />,
      );


      //add toolbox button in the navbar
      cgpv.api.map('mapWM').navBarButtons.createNavbarButtonGroup('mygroup');
      cgpv.api.map('mapWM').navBarButtons.createNavbarButton(toolboxButton, 'mygroup');
      
      //add logo next to sidebar
      var nhn_icon = document.createElement('img');
      nhn_icon.src = './nhn-logo.png';
      nhn_icon.classList.add('nhn-icon');
      document.getElementById("map-mapWM")?.appendChild(nhn_icon);
    });
  }, []);

  return (
    <div>
    <div id="loader"></div>
      <Toolbox
        onClose={toolboxCloseHandler}
        show={toolboxVisibility}
        title="Tool Box"
        setLat={setLat}
        setLong={setLong}
        lat={lat}
        long={long}
      />
      <div
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
          'basemapId': 'transport',
          'shaded': false,
          'labeled': true
        },
        'listOfGeoviewLayerConfig': [
          {
            'geoviewLayerId': 'wmsLYR4',
            'geoviewLayerName': {
              'en': 'hydro network',
              'fr': 'hydro network'
            },
            'metadataAccessPath': {
              'en': 'https://maps.geogratis.gc.ca/wms/hydro_network_en',
              
              'fr': 'https://maps.geogratis.gc.ca/wms/hydro_network_en'
            },
            'geoviewLayerType': 'ogcWms',
            'listOfLayerEntryConfig': [
              {
                'layerId': 'hydro_network'
              }
            ]
          },
          {
            'geoviewLayerId': 'ogcFeatureLYR7',
            'geoviewLayerName': {
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
          },
          {
            'geoviewLayerId': 'wmsLYR1-msi',
            'geoviewLayerName': {
              'en': 'MSI'
            },
            'metadataAccessPath': {
              'en': 'https://datacube.services.geo.ca/ows/msi'
            },
            'geoviewLayerType': 'ogcWms',
            'listOfLayerEntryConfig': [
              {
                'layerId': 'msi-94-or-more'
              }
            ]
          }
        ]
      },
      'theme': 'dark',
      'suportedLanguages': ['en', 'fr'],
      'corePackages': ['basemap-panel']
      }"
  >
    
  </div>
  
  </div>
    
  );
};

export default App;
