import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import "./style.css"
import { TypeIconButtonProps, TypeWindow } from "geoview-core-types";
import { ToolboxPopup } from "./ToolboxPopup";

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

  //function to close the toolbox
  const closeToolboxHandler = (e: any) => {
    setShowToolbox(false);
    props.onClose(false);
  };

  //function to close the popup
  const popupCloseHandler = (e:boolean) => {
    console.log("pop up visible should be "+e);
    setPopUpVisibility(e);
  };

  useEffect(() => {
    setShowToolbox(props.show);
  }, [props.show]);

  const logFuntion = (e:string) => {
    console.log(e);
  }

  
  return (
    <div>
      <ToolboxPopup
        onClose={popupCloseHandler}
        mainFunction={logFuntion}
        show={popupVisibility}
        title="Tool Box - cachement"
        setLat={props.setLat}
        setLong={props.setLong}
        lat={props.lat}
        long={props.long}
      />
      <div
        style={{
          visibility: showToolbox ? "visible" : "hidden",
          opacity: showToolbox ? "1" : "0"
        }}
        className={'overlay'}
      >
        <div className={'popup'}>
          <h3 className="line">{props.title}</h3>
          <div className={'close'} onClick={closeToolboxHandler}>
            &times;
          </div>

          <div className="">
            <button type="button" className="button-3 margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), popupCloseHandler(true), console.log('cachement button click') }}>Cachement tool</button>
          </div>
          <div className="">
            <button type="button" className="button-3 margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), console.log('2') }}>Raindrop tool</button>
          </div>
          <div className="">
            <button type="button" className="button-3 margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), console.log('3') }}>Other tool</button>
          </div>
          <div className="">
            <button type="button" className="button-3 margin-left-10 margin-bot-5" onClick={() => { closeToolboxHandler(this), console.log('4') }}>Last tool</button>
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