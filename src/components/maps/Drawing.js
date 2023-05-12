/* global google */
import React, { useRef, useState } from "react";
import { DrawingManagerF, PolygonF } from "@react-google-maps/api";

const Drawing = ({ onComplete }) => {

	const [polygons, setPolygon] = useState(null)
	const onLoad = (drawingManager) => {
		console.log("drawing", drawingManager);
	};

	const [path, setPath] = useState(null)

	const options = {
        //fillColor: "lightblue",
        //fillOpacity: 1,
        strokeColor: "black",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: true,
        draggable: true,
        editable: true,
        geodesic: false,
        zIndex: 1
    }

	const [drawingControl, setDrawingControl] = useState(true)

	const [drawingMode, setDrawingMode] = useState("polygon")

	const drawingManager = useRef(null)

	const onPolygonComplete = (polygon) => {
		console.log({polygon})

		let latlongs = []
		let paths = []

		let coords = polygon.getPath().getArray();
		coords.map(latlng => {
			paths.push({ lat: latlng.lat(), lng: latlng.lng() })
			latlongs.push([parseFloat(latlng.lat().toFixed(6)), parseFloat(latlng.lng().toFixed(6))])
		})
		setPath(paths)
		if(polygons){
			polygons.setMap(null)
		}
		setPolygon(polygon)
		console.log({latlongs})
		//polygon.setMap(null);
		onComplete(latlongs)
		//setDrawingMode('marker')
		//setDrawingControl(false)
	};


	const endPolygon = () => {

		onPolygonComplete(polygons)
	}





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
				polygonOptions: { editable: false, draggable: false }
			}}
		/>
	);
};

export default Drawing;