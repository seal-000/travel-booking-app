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

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
