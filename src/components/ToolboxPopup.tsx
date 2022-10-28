import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import "./style.css"
import { TypeIconButtonProps, TypeWindow } from "geoview-core-types";

const w = window as TypeWindow;
const cgpv = w['cgpv'];
const { react } = cgpv;


interface ToolboxPopupProps {
  onClose: (close: boolean) => void;
  mainFunction: Function;
  show: boolean;
  title: string;
  setLat: React.Dispatch<React.SetStateAction<string>>;
  setLong: React.Dispatch<React.SetStateAction<string>>;
  long:string;
  lat:string;
}


var waitForMapClick = false;

export const ToolboxPopup = (props: ToolboxPopupProps): JSX.Element => {
  const [show, setShow] = useState(false);

  const closeHandler = (e: any) => {
    setShow(false);
    props.onClose(false);
  };


  useEffect(() => {
    setShow(props.show);
  }, [props.show]);

  //quand on clique sur la carte, si on attend un clique (on doit être passé par le popup), ouvre le popup et appel la fonction waterdrop
  cgpv.api.event.on((cgpv.api.eventNames.MAP as any).EVENT_MAP_SINGLE_CLICK, (payload) => { popupMapClick((payload as any).coordinates.lnglat) }, 'mapWM');

  function popupMapClick(lnglat:string[]){
    if(waitForMapClick){
      setShow(true);
      waterDropBtnClick(lnglat);
    }
  }
  function waterDropBtnClick(lnglat:any) {
    if (waitForMapClick) {
      props.setLat(lnglat[1]);
      props.setLong(lnglat[0]);
      waitForMapClick = false;
    } else {
      setShow(false);
      waitForMapClick = true;
    }
  }

  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        opacity: show ? "1" : "0"
      }}
      className={'overlay'}
    >
      <div className={'popup'}>
        <h3 className="line">{props.title}</h3>
        <div className={'close'} onClick={closeHandler}>
          &times;
        </div>
        <div className={'content margin-bot-20'}>Position de départ:</div>
        <div>
          <label className="width-80">Longitude:</label>
          <input type="number" className="margin-bot-5" id="long" value={props.long} onChange={(e) => props.setLong(e.target.value)}></input>
        </div>
        <div className="margin-bot-20">
          <label className="width-80">Latitude:</label>
          <input type="number" id="lat" value={props.lat} onChange={(e) => props.setLat(e.target.value)}></input>
        </div>
        <div className="">
          <button type="button" className='button-4' onClick={waterDropBtnClick}>Sélectionner un point sur la carte</button>
          <button type="button" className="button-3 margin-left-10" onClick={()=>props.mainFunction("main function")}>Go</button>
        </div>
      </div>
    </div>
  );
};

ToolboxPopup.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};