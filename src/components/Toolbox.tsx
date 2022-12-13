import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import "./style.css"
import { TypeIconButtonProps, TypeWindow } from "geoview-core-types";
import { ToolboxPopup } from "./ToolboxPopup";
import { getCachement, testGetCachement, getDownstream } from "../queries/cachement";

const w = window as TypeWindow;
const cgpv = w['cgpv'];
const { react } = cgpv;


interface ToolboxProps {
  onClose: (close: boolean) => void;
  show: boolean;
  title: string;
  setLat: React.Dispatch<React.SetStateAction<string>>;
  setLong: React.Dispatch<React.SetStateAction<string>>;
  long: string;
  lat: string;
  setEndLat: React.Dispatch<React.SetStateAction<string>>;
  setEndLong: React.Dispatch<React.SetStateAction<string>>;
  endLong: string;
  endLat: string;
}

export const Toolbox = (props: ToolboxProps): JSX.Element => {
  const [showToolbox, setShowToolbox] = useState(false);
  const [popupVisibility, setPopUpVisibility] = useState(false);
  const [downstreamPopupVisibility, setDownstreamPopUpVisibility] = useState(false);

  //function to close the toolbox
  const closeToolboxHandler = (e: any) => {
    setShowToolbox(false);
    props.onClose(false);
  };

  //function to close the drainage popup
  const drainagePopupCloseHandler = (e:boolean) => {
    setPopUpVisibility(e);
  };

  //function to close the downstream popup
  const downstreamPopupCloseHandler = (e:boolean) => {
    setDownstreamPopUpVisibility(e);
  };

  //const to remember the popup option to open after map click and if you need to open it on map clicked
  var popupToOpen: string;
  var readyToOpen: boolean = false;

  //the popup that was just closed is going to open on next map click
  const setPopupToOpen = (id:string) => {
    popupToOpen = id;
    readyToOpen =true;
  }

  //function to open or close the different popup options
  const openPopupOption = (lnglat:string[]) => {
    console.log("openPopupOption: ready to open -> "+ readyToOpen+" id -> "+ popupToOpen);
    if(readyToOpen){
      //set long lat of begining or endpoint
      if(popupToOpen.indexOf('endPoint')!= -1){
        console.log("set end");
        props.setEndLat(lnglat[1]);
        props.setEndLong(lnglat[0]);
      }
      else{
        console.log("set begining");
        props.setLat(lnglat[1]);
        props.setLong(lnglat[0]);
      }
      //re-open the popup
      if(popupToOpen.indexOf('drainage') != -1) {setPopUpVisibility(true);}
      else if(popupToOpen.indexOf('downstream') != -1) {setDownstreamPopUpVisibility(true);}
      readyToOpen = false;
    }
  }

  //call openPopupOption on map click
  cgpv.api.event.on((cgpv.api.eventNames.MAP as any).EVENT_MAP_SINGLE_CLICK, (payload) => { openPopupOption((payload as any).coordinates.lnglat) }, 'mapWM');

  // set up the long lat props
  var longLat = {
    setLat: props.setLat,
    setLong: props.setLong,
    long: props.long,
    lat: props.lat,
    setEndLat: props.setEndLat,
    setEndLong: props.setEndLong,
    endLong: props.endLong,
    endLat: props.endLat,
  }

  useEffect(() => {
    setShowToolbox(props.show);
  }, [props.show]);
  
  return (
    <div>
      <ToolboxPopup
        id="drainage"
        onClose={drainagePopupCloseHandler}
        mainFunction={getCachement}
        show={popupVisibility}
        title="Tool Box - drainage area"
        distanceOption={false}
        endPointOption={false}
        longLat={longLat}
        setVisibility={setPopupToOpen}
      />
      <ToolboxPopup
        id="downstream"
        onClose={downstreamPopupCloseHandler}
        mainFunction={getDownstream}
        show={downstreamPopupVisibility}
        title="Tool Box - downstream flow path"
        distanceOption={false}
        endPointOption={false}
        longLat={longLat}
        setVisibility={setPopupToOpen}
      />
      <div
        style={{
          visibility: showToolbox ? "visible" : "hidden",
          opacity: showToolbox ? "1" : "0"
        }}
        className={'overlay'}
      >
        <div className={'popup'}>
          <div className="toolbox-title margin-left-10">
            <h3 className="line"><img src="/assets/ToolBoxLogo.svg" className="svg-toolbox margin-right-5 margin-bot-5"/>{props.title}</h3>
            <div className={'close'} onClick={closeToolboxHandler}>
              &times;
            </div>
          </div>
          <div className="toolbox-group margin-left-10">
            General
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), drainagePopupCloseHandler(true) }}>
              <i className="fa fa-tint" aria-hidden="true"></i>
              Drainage Area
            </button>
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), downstreamPopupCloseHandler(true) }}>
              <i className="fa fa-faucet-drip"></i>
              Downstream flow path</button>
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this)}}>
              <i className="fa fa-line-chart"></i>
              Elevation Profile Tool
            </button>
          </div>
          <div className="toolbox-group margin-left-10">
            Network Navigation
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this) }}>
              <i className="fa fa-tint"></i>
              Flow (Raindrop) Tool
            </button>
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this) }}>
              <i className="fa fa-share-alt"></i>
              Network Path
            </button>
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this) }}>
              <i className="fa fa-sitemap"></i>
              Network Trace
            </button>
          </div>
          <div className="toolbox-group margin-left-10">
            Others
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this) }}>
              PROSPER Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Toolbox.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};