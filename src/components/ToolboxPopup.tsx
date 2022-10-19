import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import "./style.css"
import { TypeIconButtonProps, TypeWindow } from "geoview-core-types";

const w = window as TypeWindow;
const cgpv = w['cgpv'];
const { react } = cgpv;


interface ToolboxPopupProps {
  onClose: (close: boolean) => void;
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
  //on map.click(waterDropBtnClick)
  document.getElementById('map-mapWM')?.addEventListener("click", function(){
    if(waitForMapClick){
      setShow(true);
      waterDropBtnClick();
    }
  })


  function waterDropBtnClick() {
    if (waitForMapClick) {
      props.setLat(Math.floor(Math.random() * 100).toString());
      props.setLong(Math.floor(Math.random() * 100).toString());
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
        <h2>{props.title}</h2>
        <span className={'close'} onClick={closeHandler}>
          &times;
        </span>
        <div className={'content'}>Veuillez cliquer à un endroit sur la carte pour afficher le trajet de l'eau</div>
        <button type="button" className='button-4' onClick={waterDropBtnClick}>Sélectionner un point sur la carte</button>
        <div>
          <label>Longitude</label>
          <input type="number" id="long" value={props.long} onChange={(e) => props.setLong(e.target.value)}></input>
        </div>
        <div>
          <label>Latitude</label>
          <input type="number" id="lat" value={props.lat} onChange={(e) => props.setLat(e.target.value)}></input>
        </div>
        <button type="button" className="button-4">Go</button>
      </div>
    </div>
  );
};

ToolboxPopup.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};