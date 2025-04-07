import { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function TicketSearch() {
  const [searchParams, setSearchParams] = useState({
    fromId: '',
    toId: '',
    departDate: new Date(),
    returnDate: null,
    stops: 'none',
    pageNo: 1,
    adults: 1,
    children: '0',
    sort: 'BEST',
    cabinClass: 'ECONOMY',
    currency: 'USD'
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formattedDepartDate = searchParams.departDate.toISOString().split('T')[0];
    const formattedReturnDate = searchParams.returnDate ? searchParams.returnDate.toISOString().split('T')[0] : null;
  
    try {
      const response = await axios.get('http://localhost:3001/api/flights/search', {
        params: {
          fromId: searchParams.fromId,
          toId: searchParams.toId,
          departDate: formattedDepartDate,
          returnDate: formattedReturnDate,
          stops: searchParams.stops,
          pageNo: searchParams.pageNo,
          adults: searchParams.adults,
          children: searchParams.children,
          sort: searchParams.sort,
          cabinClass: searchParams.cabinClass,
          currency: searchParams.currency
        }
      });
  
      console.log("API Response: ", response.data);
      
      if (response.data && response.data.data && response.data.data.flightOffers) {
        setFlights(response.data.data.flightOffers);
      } else {
        console.error("Unexpected API response structure:", response.data);
        setError('No flights found. Please try different search parameters.');
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
      setError('Failed to fetch flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `${price.units}.${price.nanos.toString().padStart(9, '0').slice(0, 2)} ${price.currencyCode}`;
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderFlightCard = (flight) => {
    const formatTime = (timeString) => {
      return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    return (
      <div key={flight.token} className="flight-card">
        <div className="flight-header">
          <div className="airline-info">
            <img src={flight.segments[0].legs[0].carriersData[0].logo} alt={flight.segments[0].legs[0].carriersData[0].name} />
            <span>{flight.segments[0].legs[0].carriersData[0].name}</span>
          </div>
          <div className="flight-price">
            <span className="price">{flight.priceBreakdown.total.units}.{flight.priceBreakdown.total.nanos.toString().padStart(9, '0').slice(0, 2)}</span>
            <span className="currency">{flight.priceBreakdown.total.currencyCode}</span>
          </div>
        </div>

        <div className="flight-details">
          {flight.segments.map((segment, index) => (
            <div key={index} className="segment">
              <div className="segment-header">
                <span className="segment-type">{index === 0 ? 'Outbound' : 'Return'}</span>
                <span className="flight-number">{segment.legs[0].flightInfo.flightNumber}</span>
              </div>
              
              <div className="route">
                <div className="departure">
                  <span className="time">{formatTime(segment.departureTime)}</span>
                  <span className="date">{formatDate(segment.departureTime)}</span>
                  <span className="airport">{segment.departureAirport.code}</span>
                  <span className="city">{segment.departureAirport.cityName}</span>
                </div>
                
                <div className="duration">
                  <span>Times are local times</span>
                </div>
                
                <div className="arrival">
                  <span className="time">{formatTime(segment.arrivalTime)}</span>
                  <span className="date">{formatDate(segment.arrivalTime)}</span>
                  <span className="airport">{segment.arrivalAirport.code}</span>
                  <span className="city">{segment.arrivalAirport.cityName}</span>
                </div>
              </div>

              <div className="airport-details">
                <div className="departure-airport">
                  <h4>Departure Airport</h4>
                  <p>Name: {segment.departureAirport.name}</p>
                  <p>City: {segment.departureAirport.cityName}</p>
                  <p>Country: {segment.departureAirport.countryName}</p>
                </div>
                <div className="arrival-airport">
                  <h4>Arrival Airport</h4>
                  <p>Name: {segment.arrivalAirport.name}</p>
                  <p>City: {segment.arrivalAirport.cityName}</p>
                  <p>Country: {segment.arrivalAirport.countryName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="price-details">
          <h4>Price Breakdown</h4>
          <div className="breakdown">
            <div className="price-item">
              <span>Base Fare</span>
              <span>{flight.priceBreakdown.baseFare.units}.{flight.priceBreakdown.baseFare.nanos.toString().padStart(9, '0').slice(0, 2)} {flight.priceBreakdown.baseFare.currencyCode}</span>
            </div>
            <div className="price-item">
              <span>Taxes</span>
              <span>{flight.priceBreakdown.tax.units}.{flight.priceBreakdown.tax.nanos.toString().padStart(9, '0').slice(0, 2)} {flight.priceBreakdown.tax.currencyCode}</span>
            </div>
            <div className="price-item">
              <span>Fees</span>
              <span>{flight.priceBreakdown.fee.units}.{flight.priceBreakdown.fee.nanos.toString().padStart(9, '0').slice(0, 2)} {flight.priceBreakdown.fee.currencyCode}</span>
            </div>
            <div className="price-item total">
              <span>Total</span>
              <span>{flight.priceBreakdown.total.units}.{flight.priceBreakdown.total.nanos.toString().padStart(9, '0').slice(0, 2)} {flight.priceBreakdown.total.currencyCode}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ticket-search-page">
      <div className="search-container">
        <h1>Search Flights</h1>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label>From</label>
            <input
              type="text"
              value={searchParams.fromId}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setSearchParams({ ...searchParams, fromId: value });
                if (value.length >= 3) {
                  // Auto-format to CODE.AIRPORT if it's a valid airport code
                  const airportCode = value.replace(/[^A-Z]/g, '');
                  if (airportCode.length === 3) {
                    setSearchParams({ ...searchParams, fromId: `${airportCode}.AIRPORT` });
                  }
                }
              }}
              placeholder="e.g., KUN.AIRPORT"
              required
            />
          </div>

          <div className="form-group">
            <label>To</label>
            <input
              type="text"
              value={searchParams.toId}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setSearchParams({ ...searchParams, toId: value });
                if (value.length >= 3) {
                  // Auto-format to CODE.AIRPORT if it's a valid airport code
                  const airportCode = value.replace(/[^A-Z]/g, '');
                  if (airportCode.length === 3) {
                    setSearchParams({ ...searchParams, toId: `${airportCode}.AIRPORT` });
                  }
                }
              }}
              placeholder="e.g., LHR.AIRPORT"
              required
            />
          </div>

          <div className="form-group">
            <label>Departure Date</label>
            <DatePicker
              selected={searchParams.departDate}
              onChange={(date) => setSearchParams({ ...searchParams, departDate: date })}
              minDate={new Date()}
              className="date-picker"
            />
          </div>

          <div className="form-group">
            <label>Return Date (Optional)</label>
            <DatePicker
              selected={searchParams.returnDate}
              onChange={(date) => setSearchParams({ ...searchParams, returnDate: date })}
              minDate={searchParams.departDate}
              className="date-picker"
              isClearable
            />
          </div>

          <div className="form-group">
            <label>Stops</label>
            <select
              value={searchParams.stops}
              onChange={(e) => setSearchParams({ ...searchParams, stops: e.target.value })}
            >
              <option value="none">No Preference</option>
              <option value="0">Non-stop</option>
              <option value="1">One Stop</option>
              <option value="2">Two Stops</option>
            </select>
          </div>

          <div className="form-group">
            <label>Passengers</label>
            <div className="passenger-inputs">
              <input
                type="number"
                value={searchParams.adults}
                onChange={(e) => setSearchParams({ ...searchParams, adults: parseInt(e.target.value) })}
                min="1"
                max="9"
              />
              <span>Adults</span>
              <input
                type="text"
                value={searchParams.children}
                onChange={(e) => setSearchParams({ ...searchParams, children: e.target.value })}
                placeholder="e.g., 0,1,17"
              />
              <span>Children Ages</span>
            </div>
          </div>

          <div className="form-group">
            <label>Sort By</label>
            <select
              value={searchParams.sort}
              onChange={(e) => setSearchParams({ ...searchParams, sort: e.target.value })}
            >
              <option value="BEST">Best</option>
              <option value="CHEAPEST">Cheapest</option>
              <option value="FASTEST">Fastest</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cabin Class</label>
            <select
              value={searchParams.cabinClass}
              onChange={(e) => setSearchParams({ ...searchParams, cabinClass: e.target.value })}
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select
              value={searchParams.currency}
              onChange={(e) => setSearchParams({ ...searchParams, currency: e.target.value })}
            >
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {flights.length > 0 && (
          <div className="flights-results">
            <h2>Available Flights</h2>
            <div className="flights-grid">
              {flights.map((flight) => renderFlightCard(flight))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


