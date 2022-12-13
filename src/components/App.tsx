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

import "./style.css"
import { Toolbox } from './Toolbox';
import react from 'react';

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
  const [endLong, setEndLong] = useState("");
  const [endLat, setEndLat] = useState("");

  const toolboxButton: TypeIconButtonProps = {
    // set ID to toolboxButtonPanel so that it can be accessed from the core viewer
    id: 'toolboxButtonPanel',
    tooltip: 'Tool box',
    tooltipPlacement: 'right',
    children: <img src="/assets/ToolBoxLogo.svg" className="svg-toolbox" />,
    visible: true,
    onClick: () => toolboxCloseHandler(true),
  };

  const toolboxCloseHandler = (e: boolean) => {
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

      const language = 'fr';

      const LayerIcon = cgpv.ui.elements.LayersIcon;

      /*
      // pannel - layer button props
      const layerButton: TypeIconButtonProps = {
        // set ID to layerButtonPanel so that it can be accessed from the core viewer
        id: 'layerButtonPanel',
        tooltip: translations[language].custom.layerPanelTitle,
        tooltipPlacement: 'right',
        children: <LayerIcon />,
        visible: true,
      };

      // layer panel props
      const layerPanel: TypePanelProps = {
        title: translations[language].custom.layerPanelTitle,
        icon: <LayerIcon />,
        width: 500,
      };

      // create a new button panel on the appbar
      const layerButtonPanel = cgpv.api
        .map('mapWM')
        .appBarButtons.createAppbarPanel(layerButton, layerPanel, null);

      layerButtonPanel?.panel?.changeContent(
        <LayerPanelContent buttonPanel={layerButtonPanel} mapId={'mapWM'} />,
      );*/

      //set up the Legend in a panel
      const legend = (cgpv.api.map('mapWM') as any).legend.createLegend();
      const button: TypeIconButtonProps = {
        id: 'AppbarPanelButtonId',
        tooltip: 'Legend',
        tooltipPlacement: 'right',
        children: <LayerIcon />,
      };

      const panel: TypePanelProps = {
        title: 'Legend',
        icon: <LayerIcon />,
        content: react.createElement(legend),
        width: 200,
      };

      // call an api function to add a panel with a button in the default group
      cgpv.api.map('mapWM').appBarButtons.createAppbarPanel(button, panel, null);

      //add toolbox button in the navbar
      cgpv.api.map('mapWM').navBarButtons.createNavbarButtonGroup('mygroup');
      cgpv.api.map('mapWM').navBarButtons.createNavbarButton(toolboxButton, 'mygroup');

      //add logo next to sidebar
      var nhn_icon = document.createElement('img');
      nhn_icon.src = './nhn-logo.png';
      nhn_icon.classList.add('nhn-icon');
      document.getElementById("map-mapWM")?.appendChild(nhn_icon);

      /*window.onclick = e => {
        console.log(e.target);  // to get the element
      }*/
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
        setEndLat={setEndLat}
        setEndLong={setEndLong}
        endLat={endLat}
        endLong={endLong}
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
      'components': [
        'app-bar',
        'nav-bar'
      ],
      'corePackages': ['basemap-panel']
      }"
      >

      </div>

    </div>

  );
};

export default App;
