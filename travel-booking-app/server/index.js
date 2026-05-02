/* Minimal Express proxy for Duffel */
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

function getDuffelHeaders() {
  const token = process.env.DUFFEL_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Missing DUFFEL_ACCESS_TOKEN in environment');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Duffel-Version': 'v2',
    'Content-Type': 'application/json'
  };
}

app.get('/api/airports', async (req, res) => {
  try {
    const query = (req.query.query || '').toString();
    if (!query || query.trim().length < 2) {
      return res.json([]);
    }

    const apiRes = await axios.get(
      'https://api.duffel.com/places/suggestions',
      {
        params: {
          query: query
        },
        headers: getDuffelHeaders()
      }
    );

    // translates standard country codes into full country names (node.js built-in)
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

    const data = Array.isArray(apiRes.data?.data) ? apiRes.data.data : [];
    const airports = data
      .filter(item => item.type === 'airport' || item.type === 'city')
      .map((item) => {
        let countryName = item.iata_country_code || '';
        try {
          if (item.iata_country_code) {
            countryName = regionNames.of(item.iata_country_code) || countryName;
          }
        } catch (e) {
          // ignore, fallback to the code itself
        }
        return {
          code: item.iata_code,
          name: item.name,
          city: item.city_name || item.name || '',
          country: countryName,
        };
      });

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

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const slices = [
      {
        origin: originLocationCode,
        destination: destinationLocationCode,
        departure_date: departureDate,
      }
    ];

    if (returnDate) {
      slices.push({
        origin: destinationLocationCode,
        destination: originLocationCode,
        departure_date: returnDate,
      });
    }

    let passengers = [];
    const numAdults = parseInt(adults) || 1;
    for (let i = 0; i < numAdults; i++) {
        passengers.push({ type: 'adult' });
    }
    const numChildren = parseInt(children) || 0;
    for (let i = 0; i < numChildren; i++) {
        passengers.push({ type: 'child' });
    }

    const requestPayload = {
      data: {
        slices,
        passengers,
        cabin_class: (cabinClass || 'economy').toLowerCase(),
        return_offers: true
      }
    };
    
    // Duffel does not have a direct exact non-stop filter in the request creation, 
    // but max_connections could be used if it was supported in the future or via filtering.
    // For now we'll pass standard params.

    console.log('[Backend] Duffel API params:', JSON.stringify(requestPayload, null, 2));

    const flightRes = await axios.post(
      'https://api.duffel.com/air/offer_requests',
      requestPayload,
      {
        headers: getDuffelHeaders()
      }
    );

    let flights = Array.isArray(flightRes.data?.data?.offers) ? flightRes.data.data.offers : [];
    
    // Manual non-stop filter if requested
    if (nonStop === 'true') {
        flights = flights.filter(offer => {
            return offer.slices.every(slice => slice.segments.length === 1);
        });
    }

    console.log('[Backend] Duffel returned', flights.length, 'flights');
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
