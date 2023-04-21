/* global google */
import React, { useRef, useState } from "react";
import { DrawingManagerF } from "@react-google-maps/api";

const Drawing = ({onComplete}) => {
  const onLoad = (drawingManager) => {
    console.log("drawing", drawingManager);
  };

  const [drawingControl, setDrawingControl] = useState(true)

  const [drawingMode, setDrawingMode] = useState("polygon")

  const drawingManager = useRef(null)

  const onPolygonComplete = (polygon) => {

    let latlongs = []

    let coords = polygon.getPath().getArray();
    coords.map(latlng => {
      latlongs.push([latlng.lat().toFixed(6), latlng.lng().toFixed(6)])
    })
    
    //polygon.setMap(null);
    onComplete(latlongs)
    setDrawingMode('marker')
    setDrawingControl(false)
  };



  

  return (
    <DrawingManagerF
      ref={drawingManager}
      onLoad={onLoad}
      onPolygonComplete={onPolygonComplete}
      drawingMode={drawingMode}
      options={{
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [drawingMode]
        },
        polygonOptions: { editable: true }
      }}
    />
  );
};

export default Drawing;