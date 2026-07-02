import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiStar } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [allListings, setAllListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ search: "", guests: "", minPrice: "", maxPrice: "" });
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await api.get("/accommodations");
      setAllListings(data.accommodations);
      setListings(data.accommodations);
    };
    fetchListings();
  }, []);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();

    let results = [...allListings];

    if (filters.search) {
      results = results.filter((item) =>
        item.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.guests) results = results.filter((item) => item.guests >= Number(filters.guests));
    if (filters.minPrice) results = results.filter((item) => item.price >= Number(filters.minPrice));
    if (filters.maxPrice) results = results.filter((item) => item.price <= Number(filters.maxPrice));

    setListings(results);
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="brand">airbnb</Link>

        <form className="search-pill" onSubmit={handleSearch}>
          <input name="search" placeholder="Search location" value={filters.search} onChange={handleChange} />
          <input name="guests" type="number" placeholder="Guests" value={filters.guests} onChange={handleChange} />
          <input name="minPrice" type="number" placeholder="Min price" value={filters.minPrice} onChange={handleChange} />
          <input name="maxPrice" type="number" placeholder="Max price" value={filters.maxPrice} onChange={handleChange} />
          <button><FiSearch /></button>
        </form>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/my-reservations" className="host-btn">My Reservations</Link>
              <span>Hello, {user.username}</span>
              <button className="host-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="host-btn">Login</Link>
              <Link to="/register" className="host-btn">Register</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>Find your next unforgettable stay</h1>
        <p>Book unique homes, apartments, and experiences across South Africa.</p>
      </section>

      <section className="listings-section">
        <h2>{listings.length} places to stay</h2>

        <div className="property-grid">
          {listings.map((item) => (
            <Link to={`/listings/${item._id}`} className="property-card" key={item._id}>
              <img src={item.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80"} />
              <div className="property-info">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.location}</p>
                </div>
                <span><FiStar /> {Number(item.rating || 0).toFixed(1)}</span>
              </div>
              <p className="price">R {item.price} night</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>Inspiration for your next trip</h2>
        <div className="inspiration-grid">
          <div className="inspiration-card pink"><h3>Cape Town</h3><p>Coastal stays and mountain views</p></div>
          <div className="inspiration-card orange"><h3>Johannesburg</h3><p>City apartments and nightlife</p></div>
          <div className="inspiration-card purple"><h3>Durban</h3><p>Beach escapes and warm weather</p></div>
          <div className="inspiration-card dark"><h3>Polokwane</h3><p>Quiet stays and weekend breaks</p></div>
        </div>
      </section>

      <section className="experience-grid">
        <div className="experience-card">
          <h2>Things to do on your trip</h2>
          <button>Experiences</button>
        </div>
        <div className="experience-card second">
          <h2>Things to do from home</h2>
          <button>Online Experiences</button>
        </div>
      </section>

      <section className="shop-section">
        <div>
          <h2>Shop Airbnb gift cards</h2>
          <button>Learn more</button>
        </div>
        <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=900&q=80" />
      </section>

      <section className="home-section">
        <h2>Inspiration for future getaways</h2>
        <div className="getaway-links">
          <span>Beach stays</span>
          <span>Cabins</span>
          <span>City apartments</span>
          <span>Luxury homes</span>
          <span>Family stays</span>
          <span>Weekend breaks</span>
        </div>
      </section>

      <footer className="footer">
        <div>
          <h4>Support</h4>
          <p>Help Centre</p>
          <p>Safety information</p>
          <p>Cancellation options</p>
        </div>
        <div>
          <h4>Community</h4>
          <p>Airbnb.org</p>
          <p>Guest referrals</p>
          <p>Gift cards</p>
        </div>
        <div>
          <h4>Hosting</h4>
          <p>Become a host</p>
          <p>Host resources</p>
          <p>Responsible hosting</p>
        </div>
        <div>
          <h4>About</h4>
          <p>Newsroom</p>
          <p>Careers</p>
          <p>Investors</p>
        </div>
      </footer>

      <div className="copyright">
        © 2026 Airbnb Clone · Privacy · Terms · Sitemap
      </div>
    </div>
  );
}

export default Home;