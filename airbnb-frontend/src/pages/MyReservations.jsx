import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get("/reservations/user");
      setReservations(data.reservations);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <a href="/" className="brand">airbnb</a>
        <a href="/" className="host-btn">Back Home</a>
      </nav>

      <section className="listings-section">
        <h1>My Reservations</h1>

        {loading ? (
          <p>Loading reservations...</p>
        ) : reservations.length === 0 ? (
          <p>You do not have any reservations yet.</p>
        ) : (
          <div className="reservation-list">
            {reservations.map((item) => (
              <div className="reservation-card" key={item._id}>
                <img
                  src={item.accommodation?.images?.[0] || "https://picsum.photos/600/400"}
                  alt=""
                />

                <div>
                  <h3>{item.accommodation?.title}</h3>
                  <p>{item.accommodation?.location}</p>
                  <p>
                    {new Date(item.checkIn).toLocaleDateString()} -{" "}
                    {new Date(item.checkOut).toLocaleDateString()}
                  </p>
                  <p>{item.nights} nights · {item.guests} guests</p>
                  <strong>R {item.totalPrice.toLocaleString()}</strong>
                  <p>Status: {item.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyReservations;