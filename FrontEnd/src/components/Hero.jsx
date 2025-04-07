
const popularPlaces = [
  {
    title: "France",
    image: "/france.jpeg",
    rating: 5,
  },
  {
    title: "Spain",
    image: "/spain.jpeg",
    rating: 5,
  },
  {
    title: "USA",
    image: "/usa.jpeg",
    rating: 5,
  },
];

export default function Hero() {
  return (

    <div className="main-container">
      {}
      <div className="hero-container">
        <div className="hero-background">
          <img src="/bg.jpg" alt="Hero background" />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Search For Tickets And Track<br />Flights
          </h1>
          <p className="hero-subtitle">You can also set up your own wishlist!</p>

          <div className="popular-places">
            <div className="popular-places-label">
              <span>Popular Place</span>
            </div>

            <div className="popular-places-grid">
              {popularPlaces.map((place, index) => (
                <div key={index} className="place-card">
                  <div className="place-image-container">
                    <img 
                      src={place.image} 
                      alt={place.title}
                      className="place-image"
                    />
                  </div>
                  <div className="place-info">
                    <div className="place-details">
                      <h3>{place.title}</h3>
                      <div className="place-rating">
                        {"★".repeat(place.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}