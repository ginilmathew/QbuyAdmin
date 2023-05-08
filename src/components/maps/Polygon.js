/* global google */
import React, { useRef, useState, useEffect } from "react";
import { PolygonF, GoogleMap } from "@react-google-maps/api";

const Polygons = ({ onComplete:any, path }) => {

    const [polygonRef, setPolygonRef] = useState(null)

    //console.log({path})

    const [center, setCenter] = useState(null)

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

    const onPolygonComplete = (polygon, destroy=false) => {
        let latlongs = []
        let coords = polygon.getPath().getArray()
        coords.map(latlng => {
            latlongs.push([parseFloat(latlng.lat().toFixed(6)), parseFloat(latlng.lng().toFixed(6))])
        })
        onComplete(latlongs)

        //console.log({latlongs})
       //setPolygon(createPolygon(polygon.getPath()));
    
        // Destroys the polygon that has been drawn by the manager.
        // if(destroy) {
        //   polygon.setMap(null);
        // }
    };

    const endPolygon = (e) => {
        onPolygonComplete(polygonRef)
    }

    

    //console.log({ polygon: "poly" })


    const onLoad = (polygon) => {
        console.log({polygon})
        setPolygonRef(polygon)
    };





        return (
            <div style={{ padding: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <GoogleMap
                    mapContainerClassName="App-map"
                    center={center}
                    zoom={12}
                    mapContainerStyle={{ width: 800, height: 400 }}
                    version="weekly"
                    on
                >
        
                    <PolygonF
                        onLoad={onLoad}
                        paths={path}
                        options={options}
                        onMouseUp={endPolygon}
                    />
                </GoogleMap>
            </div>
        );
};

export default Polygons;