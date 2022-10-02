import React, {useState} from 'react';
import {render} from 'react-dom';
import DeckGL from '@deck.gl/react';
import {
  COORDINATE_SYSTEM,
  _GlobeView as GlobeView,
  MapView,
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight,
} from '@deck.gl/core';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {SphereGeometry} from '@luma.gl/core';
import { green } from '@material-ui/core/colors';

const DATA_URL = 'http://localhost:8000/seismic/?format=json'
const seismicDataRaw = collectData();

console.log(typeof(seismicDataRaw));

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 0
};

const MOON_RADIUS_METERS = 1.7374e6;
const SEISMIC_RADIUS = 5e4;

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 0.6
});
const sunLight = new SunLight({
  color: [255, 255, 255],
  intensity: 2.0,
  timestamp: 0
});
// create lighting effect with light sources
const lightingEffect = new LightingEffect({ambientLight, sunLight});

async function collectData() {
  var data;
  const res = await fetch(DATA_URL);

  data = await res.json();
  return data;
}

function renderTooltip(data) {
  if(data.picked == true)
    return data.coordinate;
  return false;
}

export default function App({data}) {
  const [hoverInfo, setHoverInfo] = useState([]);
  const [seismicData, setSeismicData] = useState([]);

  let renderData = function(data) {
    let layers = [];

    for(let idx = 0;idx < data.length;idx++) {
      let element = new SimpleMeshLayer({
        id: 'seismic-sphere-' + idx,
        data,
        mesh: new SphereGeometry({radius: SEISMIC_RADIUS}),
        opacity: data[idx]['depth'] / 50,
        sizeScale: 1.8,
        getPosition: [data[idx]['lat'], data[idx]['long'], MOON_RADIUS_METERS*1.3],
        getColor: [255, 0, 0],
        getData: data[idx],
        wireframe: false,
        pickable: true,
        onHover: info => setHoverInfo(info)
      });
      layers.push(element);
    }
    return layers;
  }

  const backgroundLayers = [
    new SimpleMeshLayer({
      id: 'moon-sphere',
      data: [0],
      mesh: new SphereGeometry({radius: MOON_RADIUS_METERS, nlat: 18, nlong: 36}),
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      texture: './terrain/lroc_color_poles_8k.png',
      sizeScale: 5,
      getPosition: [0, 0, 0],
      getOrientation: [0, 0, -90],
      getColor: [255, 255, 255],
      wireframe: false,
    }),
  ];

  seismicDataRaw.then((data) => setSeismicData(data));
  const dataLayers = renderData(seismicData);

  return (
    <div className='moon-container' style={{ height: '100vh', width: '80vw', position: 'relative', left: '7.8%'}}>
      <DeckGL
        views={new GlobeView()}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        //effects={[lightingEffect]}
        layers={[backgroundLayers, dataLayers]}>
        {hoverInfo.object && (
          <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y, 
          fontSize: '36px', padding: '10px', display: 'box', boxSizing: 'content-box', backgroundColor: green}}>
            { 'latitude: ' + hoverInfo.layer.props.getData['lat'] }
            <br></br>
            { 'longtitude: ' + hoverInfo.layer.props.getData['long'] }
            <br></br>
            { 'depth: ' + hoverInfo.layer.props.getData['depth'] }
            <br></br>
            { 'date: ' + hoverInfo.layer.props.getData['date'].slice(0, 10) }
          </div>
        )}
      </DeckGL>
    </div>
  );
}

export function renderToDOM(container) {
  render(<App />, container);
}
