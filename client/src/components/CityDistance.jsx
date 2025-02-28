// import { useState } from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const CityDistance = () => {
//   const [source, setSource] = useState("");
//   const [destination, setDestination] = useState("");
//   const [distance, setDistance] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [route, setRoute] = useState([]);

//   const calculateDistance = async () => {
//     setError("");
//     setDistance(null);
//     setRoute([]);

//     if (!source.trim() || !destination.trim()) {
//       setError("Both city names are required.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:5000/calculate-distance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ source, destination }),
//       });

//       if (!response.ok) throw new Error("Failed to fetch distance");

//       const data = await response.json();
//       if (data.distance && data.route?.length) {
//         setDistance(data.distance);
//         setRoute(data.route);
//       } else {
//         throw new Error("Invalid data received");
//       }
//     } catch (error) {
//       setError("Error fetching distance. Please try again.");
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const switchCities = () => {
//     setSource(destination);
//     setDestination(source);
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "20px", color: "black" }}>
//       <h2>🌍 City Distance Calculator</h2>
//       <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
//         <input
//           type="text"
//           placeholder="Enter Source City"
//           value={source}
//           onChange={(e) => setSource(e.target.value)}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", color: "black" }}
//         />
//         <input
//           type="text"
//           placeholder="Enter Destination City"
//           value={destination}
//           onChange={(e) => setDestination(e.target.value)}
//           style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", color: "black" }}
//         />
//       </div>
//       <button onClick={switchCities} style={{ margin: "5px", padding: "10px", cursor: "pointer", backgroundColor: "white", color: "black", border: "1px solid black" }}>🔄 Switch Cities</button>
//       <button onClick={calculateDistance} disabled={loading} style={{ margin: "5px", padding: "10px", cursor: "pointer", backgroundColor: "white", color: "black", border: "1px solid black" }}>
//         {loading ? "Calculating..." : "Get Distance"}
//       </button>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {distance !== null && <h3 style={{ color: "black" }}>📍 Distance: {distance} km</h3>}

//       {route.length > 0 && (
//         <MapContainer
//           center={route[0] || { lat: 20.5937, lng: 78.9629 }}
//           zoom={6}
//           style={{ height: "400px", width: "100%", marginTop: "20px" }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           {route.map((point, index) => (
//             <Marker key={index} position={point}>
//               <Popup>{index === 0 ? "Source" : "Destination"}</Popup>
//             </Marker>
//           ))}
//           <Polyline positions={route} color="blue" />
//         </MapContainer>
//       )}
//     </div>
//   );
// };

// export default CityDistance;
import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CityDistance = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  const calculateDistance = async () => {
    setError("");
    setDistance(null);
    setRoute([]);

    if (!source.trim() || !destination.trim()) {
      setError("Both city names are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/calculate-distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, destination }),
      });

      if (!response.ok) throw new Error("Failed to fetch distance");

      const data = await response.json();
      if (data.distance && data.route?.length) {
        setDistance(data.distance);
        setRoute(data.route);
      } else {
        throw new Error("Invalid data received");
      }
    } catch (error) {
      setError("Error fetching distance. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchCities = () => {
    setSource(destination);
    setDestination(source);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      () => setError("Unable to retrieve your location."),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", color: "black" }}>
      <h2>🌍 City Distance Calculator</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter Source City"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", color: "black" }}
        />
        <input
          type="text"
          placeholder="Enter Destination City"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid black", color: "black" }}
        />
      </div>
      <button onClick={switchCities} style={{ margin: "5px", padding: "10px", cursor: "pointer", backgroundColor: "white", color: "black", border: "1px solid black" }}>🔄 Switch Cities</button>
      <button onClick={calculateDistance} disabled={loading} style={{ margin: "5px", padding: "10px", cursor: "pointer", backgroundColor: "white", color: "black", border: "1px solid black" }}>
        {loading ? "Calculating..." : "Get Distance"}
      </button>
      <button onClick={getCurrentLocation} style={{ margin: "5px", padding: "10px", cursor: "pointer", backgroundColor: "white", color: "black", border: "1px solid black" }}>📍 Use Current Location</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {distance !== null && <h3 style={{ color: "black" }}>📍 Distance: {distance} km</h3>}

      <MapContainer
        center={currentLocation || { lat: 20.5937, lng: 78.9629 }}
        zoom={6}
        style={{ height: "400px", width: "100%", marginTop: "20px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentLocation && (
          <Marker position={currentLocation}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}
        {route.length > 0 && (
          <>
            {route.map((point, index) => (
              <Marker key={index} position={point}>
                <Popup>{index === 0 ? "Source" : "Destination"}</Popup>
              </Marker>
            ))}
            <Polyline positions={route} color="blue" />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default CityDistance;
