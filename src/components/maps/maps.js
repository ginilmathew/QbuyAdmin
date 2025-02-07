import React, { useEffect, useMemo, useState } from "react";
import { LoadScript, GoogleMap, useLoadScript } from "@react-google-maps/api";
import Drawing from "./Drawing";
import Polygon from "./Polygon";

const GMAPS_API_KEY = "AIzaSyDDFfawHZ7MhMPe2K62Vy2xrmRZ0lT6X0I";

const LIBRARIES = ["drawing"];

const Maps = ({ onPolygonComplete }) => {

	const [center, setCenter] = useState(null)

	const libraries = useMemo(() => ['drawing'], []);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEKEY,
		libraries,
		region: 'in'
	});

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
				setCenter(pos)
			},
			() => {
				//handleLocationError(true, infoWindow, map.getCenter()!);
			}
		);
	}, [])


	if(!isLoaded){
		return <div style={{ width: 800, height: 400, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>Loading...</div>
	}


	return (

		<div style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<GoogleMap
				mapContainerClassName="App-map"
				center={center}
				zoom={12}
				mapContainerStyle={{ width: '800px', height: '400px' }}
				version="weekly"
				on
			>
				<Drawing onComplete={onPolygonComplete} />
			</GoogleMap>
		</div>
	);
};

export default Maps;
