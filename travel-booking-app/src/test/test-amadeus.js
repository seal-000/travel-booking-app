// Test Amadeus API credentials
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com';

async function testAmadeusAPI() {
  console.log('🔍 Testing Amadeus API credentials...\n');

  try {
    // Step 1: Get access token
    console.log('Step 1: Requesting access token...');
    const tokenResponse = await axios.post(
      `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_API_KEY,
        client_secret: AMADEUS_API_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log('✅ Access token obtained successfully!\n');

    // Step 2: Test airport search
    console.log('Step 2: Testing airport search for "New York"...');
    const airportResponse = await axios.get(
      `${AMADEUS_BASE_URL}/v1/reference-data/locations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          keyword: 'New York',
          subType: 'AIRPORT',
        },
      }
    );

    console.log('✅ Airport search successful!\n');
    console.log('📍 Found airports:');
    airportResponse.data.data.slice(0, 3).forEach((airport) => {
      console.log(`   - ${airport.iataCode}: ${airport.name} (${airport.address.cityName})`);
    });

    console.log('\n🎉 API test completed successfully!');
    console.log('Your Amadeus API credentials are working correctly.');
    
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

testAmadeusAPI();
