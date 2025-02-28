const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Function to get latitude and longitude from a city name
const getCoordinates = async (city) => {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: city,
        format: "json",
        limit: 1,
      },
    });

    if (!response.data.length) {
      throw new Error(`Location not found for: ${city}`);
    }

    return {
      lat: parseFloat(response.data[0].lat),
      lng: parseFloat(response.data[0].lon),
    };
  } catch (error) {
    console.error(`❌ Error fetching coordinates for ${city}:`, error.message);
    throw error;
  }
};

// Function to calculate distance using the Haversine formula
const haversineDistance = (coord1, coord2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// API to calculate distance and return route
app.post("/calculate-distance", async (req, res) => {
  try {
    const { source, destination } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ error: "Both source and destination are required." });
    }

    // Get coordinates for both locations
    const sourceCoords = await getCoordinates(source);
    const destinationCoords = await getCoordinates(destination);

    // Calculate distance
    const distance = haversineDistance(sourceCoords, destinationCoords);

    res.json({
      distance: distance.toFixed(2),
      sourceCoords,
      destinationCoords,
      route: [sourceCoords, destinationCoords], // Ensure route is included
    });
  } catch (error) {
    console.error("Error calculating distance:", error);
    res.status(500).json({ error: "Error calculating distance" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
