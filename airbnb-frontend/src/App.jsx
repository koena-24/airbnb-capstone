import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ListingDetails from "./pages/ListingDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyReservations from "./pages/MyReservations";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listings/:id" element={<ListingDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-reservations" element={<MyReservations />} />
    </Routes>
  );
}

export default App;