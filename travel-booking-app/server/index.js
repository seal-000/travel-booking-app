/* Minimal Express proxy for Amadeus Locations (Airports) */
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Simple in-memory token cache
let accessToken = null;
let tokenExpiry = 0; // epoch ms

async function getAccessToken() {
  const now = Date.now();
  if (accessToken && tokenExpiry - 60000 > now) {
    return accessToken;
  }

  const clientId = process.env.AMADEUS_API_KEY;
  const clientSecret = process.env.AMADEUS_API_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing Amadeus credentials in environment');
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const tokenRes = await axios.post(
    'https://test.api.amadeus.com/v1/security/oauth2/token',
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  accessToken = tokenRes.data.access_token;
  const expiresInSec = tokenRes.data.expires_in || 1800;
  tokenExpiry = now + expiresInSec * 1000;
  return accessToken;
}

app.get('/api/airports', async (req, res) => {
  try {
    const query = (req.query.query || '').toString();
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }

    const token = await getAccessToken();
    const apiRes = await axios.get(
      'https://test.api.amadeus.com/v1/reference-data/locations',
      {
        params: {
          subType: 'AIRPORT',
          keyword: query,
          view: 'LIGHT',
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = Array.isArray(apiRes.data?.data) ? apiRes.data.data : [];
    const airports = data.map((item) => ({
      code: item.iataCode,
      name: item.name,
      city: item.address?.cityName || item.address?.cityCode || '',
      country: item.address?.countryName || '',
    }));

    res.json(airports);
  } catch (err) {
    console.error('Airports endpoint error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to search airports' });
  }
});

app.get('/api/flight-search', async (req, res) => {
  try {
    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      children,
      cabinClass,
      nonStop,
    } = req.query;

    console.log('[Backend] Flight search request:', { originLocationCode, destinationLocationCode, departureDate, returnDate, adults, children, cabinClass, nonStop });

    // Validate required params
    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const token = await getAccessToken();

    const params = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults: adults || '1',
      travelClass: (cabinClass || 'ECONOMY').toUpperCase(),
    };

    if (returnDate) params.returnDate = returnDate;
    if (children) params.children = children;
    if (nonStop === 'true') params.nonStop = true;

    console.log('[Backend] Amadeus API params:', params);

    const flightRes = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/flight-offers',
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const flights = Array.isArray(flightRes.data?.data) ? flightRes.data.data : [];
    console.log('[Backend] Amadeus returned', flights.length, 'flights');
    res.json(flights);
  } catch (err) {
    console.error('Flight search error:', JSON.stringify(err?.response?.data, null, 2) || err.message);
    res.status(500).json({ 
      error: 'Flight search failed',
      details: err?.response?.data || err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
