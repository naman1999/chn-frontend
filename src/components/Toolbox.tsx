import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import "./style.css"
import { TypeIconButtonProps, TypeWindow } from "geoview-core-types";
import { ToolboxPopup } from "./ToolboxPopup";
import { getCachement, testGetCachement } from "../queries/cachement";

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
    if(readyToOpen){
      props.setLat(lnglat[1]);
      props.setLong(lnglat[0]);
      if(popupToOpen == "drainage") {setPopUpVisibility(true);}
      else if(popupToOpen == "downstream") {setDownstreamPopUpVisibility(true);}
      readyToOpen = false;
    }
  }

  //call openPopupOption on map click
  cgpv.api.event.on((cgpv.api.eventNames.MAP as any).EVENT_MAP_SINGLE_CLICK, (payload) => { openPopupOption((payload as any).coordinates.lnglat) }, 'mapWM');

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
        setLat={props.setLat}
        setLong={props.setLong}
        lat={props.lat}
        long={props.long}
        setVisibility={setPopupToOpen}
      />
      <ToolboxPopup
        id="downstream"
        onClose={downstreamPopupCloseHandler}
        mainFunction={testGetCachement}
        show={downstreamPopupVisibility}
        title="Tool Box - downstream flow path"
        setLat={props.setLat}
        setLong={props.setLong}
        lat={props.lat}
        long={props.long}
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
            <h3 className="line">{props.title}</h3>
            <div className={'close'} onClick={closeToolboxHandler}>
              &times;
            </div>
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
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), console.log('option 3') }}>
              <i className="fa fa-mountain"></i>
              Upstream
            </button>
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), console.log('option 4') }}>
              <i className="fa fa-arrows-h"></i>
              Distance
            </button>
          </div>
          <div className="">
            <button type="button" className="toolbox-options margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), console.log('option 5') }}>
              <i className="fa fa-arrows-h"></i>
              Network path
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