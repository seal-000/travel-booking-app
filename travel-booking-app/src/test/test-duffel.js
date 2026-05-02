// Test Duffel API credentials
import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root (2 levels up from src/test)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DUFFEL_ACCESS_TOKEN = process.env.DUFFEL_ACCESS_TOKEN;
const DUFFEL_BASE_URL = 'https://api.duffel.com';

async function testDuffelAPI() {
  console.log('🔍 Testing Duffel API credentials...\n');

  try {
    if (!DUFFEL_ACCESS_TOKEN) {
      throw new Error('DUFFEL_ACCESS_TOKEN is not set in environment variables.');
    }

    // Step 1: Test Places (airport) search
    console.log('Step 1: Testing Places search for "New York"...');
    const airportResponse = await axios.get(
      `${DUFFEL_BASE_URL}/places/suggestions`,
      {
        headers: {
          'Authorization': `Bearer ${DUFFEL_ACCESS_TOKEN}`,
          'Duffel-Version': 'v2',
          'Content-Type': 'application/json'
        },
        params: {
          query: 'New York'
        },
      }
    );

    console.log('✅ Places search successful!\n');
    console.log('📍 Found places:');
    
    // Filter to airport/city and show
    const places = airportResponse.data.data || [];
    places.slice(0, 3).forEach((place) => {
      console.log(`   - ${place.iata_code}: ${place.name} (${place.city_name || place.name})`);
    });

    console.log('\n🎉 API test completed successfully!');
    console.log('Your Duffel API credentials are working correctly.');
    
  } catch (error) {
    console.error('❌ API test failed:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(error.message);
    }
  }
}

testDuffelAPI();