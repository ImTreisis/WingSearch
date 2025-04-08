import { useState } from 'react';
import axios from 'axios';

export default function FlightTracker() {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrackFlight = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://wingsearch.onrender.com/api/flights/track', {
        params: { flightNumber }
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        // Find the live flight result
        const liveFlight = response.data.results.find(result => result.type === 'live');
        if (liveFlight) {
          const detail = liveFlight.detail;
          setFlightData({
            flightNumber: detail.flight || flightNumber,
            status: 'In Flight',
            departure: {
              airport: detail.schd_from || 'Unknown',
              iata: detail.schd_from || 'Unknown',
              scheduled: 'Unknown'
            },
            arrival: {
              airport: detail.schd_to || 'Unknown',
              iata: detail.schd_to || 'Unknown',
              scheduled: 'Unknown'
            },
            aircraft: {
              model: detail.ac_type || 'Unknown',
              registration: detail.reg || 'Unknown'
            },
            airline: {
              name: 'Swiss',
              logo: detail.logo
            },
            position: {
              latitude: detail.lat,
              longitude: detail.lon
            }
          });
        } else {
          setError('No active flight found');
        }
      } else {
        setError('No flight data found');
      }
    } catch (err) {
      console.error('Error tracking flight:', err);
      setError('Failed to track flight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-tracker-page">
      <div className="tracker-container">
        <h1>Flight Tracker</h1>
        <form onSubmit={handleTrackFlight} className="tracker-form">
          <div className="form-group">
            <label>Flight Number</label>
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
              placeholder="e.g., FD3210"
              required
            />
          </div>

          <button type="submit" className="track-button" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Flight'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {flightData && (
          <div className="flight-details">
            <h2>Flight Information</h2>
            <div className="flight-info-card">
              <div className="info-row">
                <span className="label">Flight Number:</span>
                <span className="value">{flightData.flightNumber}</span>
              </div>
              <div className="info-row">
                <span className="label">Status:</span>
                <span className="value">{flightData.status}</span>
              </div>
              <div className="info-row">
                <span className="label">Departure:</span>
                <span className="value">
                  {flightData.departure.airport} ({flightData.departure.iata})
                </span>
              </div>
              <div className="info-row">
                <span className="label">Arrival:</span>
                <span className="value">
                  {flightData.arrival.airport} ({flightData.arrival.iata})
                </span>
              </div>
              <div className="info-row">
                <span className="label">Aircraft:</span>
                <span className="value">
                  {flightData.aircraft.model} ({flightData.aircraft.registration})
                </span>
              </div>
              <div className="info-row">
                <span className="label">Airline:</span>
                <span className="value">
                  {flightData.airline.name}
                  {flightData.airline.logo && (
                    <img src={flightData.airline.logo} alt={flightData.airline.name} className="airline-logo" />
                  )}
                </span>
              </div>
              {flightData.position && (
                <div className="info-row">
                  <span className="label">Current Position:</span>
                  <span className="value">
                    {flightData.position.latitude.toFixed(2)}°N, {flightData.position.longitude.toFixed(2)}°E
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 