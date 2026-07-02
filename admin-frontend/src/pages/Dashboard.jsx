import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    totalListings: 0,
    totalReservations: 0,
    totalRevenue: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/host");
        setStats(data.stats);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <section className="page-section">
      <h1>Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Listings</h3>
          <p>{loading ? "..." : stats.totalListings}</p>
        </div>

        <div className="stat-card">
          <h3>Total Reservations</h3>
          <p>{loading ? "..." : stats.totalReservations}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>{loading ? "..." : `R ${stats.totalRevenue.toLocaleString()}`}</p>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;