import './Home.css'
import FlightSearchBox from '../components/flight-search/FlightSearchBox'

const Home = () => {
  return (
    <div>
      <section className="top-section">
         <div className="top-overlay">
          <h1 className="top-text">Plan your next travel with us</h1>
        </div>
      </section>

      <section className="middle-section">
          <h2 className='middle-text top'>Discover your next flight with us</h2>
          <h2 className='middle-text bottom'>Find your Dream Destination</h2>
          <FlightSearchBox />
          
      </section>

    </div>
  )
}

export default Home