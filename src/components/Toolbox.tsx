
import { TypeButtonPanel, TypeWindow, TypeLayerConfig, TypeLangString } from 'geoview-core-types';
import { API } from '../utils/api';

<script src="https://code.jquery.com/jquery-1.6.4.js"></script>

const w = window as TypeWindow;

const cgpv = w['cgpv'];

const { react } = cgpv;

const { createContext } = react;

/**
 * Panel Content Properties
 */
interface ToolboxContentProps {
  mapId: string;
  title: string;
}

/**
 * Create a new panel content
 *
 * @param {ToolboxContentProps} props toolbox content properties
 * @returns {JSX.Element} the new create panel content
 */
export const Toolbox = (props: ToolboxContentProps): JSX.Element => {
  const { title, mapId } = props;

  const { ui, react } = cgpv;
   
  return (
  <div>
    <h1>{title}</h1>
  </div>
    
  );
}
