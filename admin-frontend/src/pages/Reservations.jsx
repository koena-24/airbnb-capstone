import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get("/reservations/host");
      setReservations(data.reservations);
    } catch {
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <h1>Reservations</h1>

      {loading ? (
        <p>Loading reservations...</p>
      ) : (
        <table className="listing-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Guest</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Nights</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((item) => (
              <tr key={item._id}>
                <td>{item.accommodation?.title}</td>
                <td>{item.user?.username}</td>
                <td>{new Date(item.checkIn).toLocaleDateString()}</td>
                <td>{new Date(item.checkOut).toLocaleDateString()}</td>
                <td>{item.nights}</td>
                <td>R {item.totalPrice.toLocaleString()}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Reservations;