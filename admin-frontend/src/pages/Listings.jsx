import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";

const emptyForm = {
  title: "",
  location: "",
  description: "",
  bedrooms: 1,
  bathrooms: 1,
  guests: 1,
  type: "",
  price: "",
  amenities: "",
  images: "",
  weeklyDiscount: 0,
  cleaningFee: 0,
  serviceFee: 0,
  occupancyTaxes: 0
};

function Listings() {
  const [listings, setListings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data } = await api.get("/accommodations");
      setListings(data.accommodations);
    } catch {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildPayload = () => ({
    ...form,
    amenities: form.amenities.split(",").map((item) => item.trim()).filter(Boolean),
    images: form.images.split(",").map((item) => item.trim()).filter(Boolean),
    price: Number(form.price),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    guests: Number(form.guests),
    weeklyDiscount: Number(form.weeklyDiscount),
    cleaningFee: Number(form.cleaningFee),
    serviceFee: Number(form.serviceFee),
    occupancyTaxes: Number(form.occupancyTaxes)
  });

  const saveListing = async (e) => {
    e.preventDefault();

    try {
      const payload = buildPayload();

      if (editingId) {
        const { data } = await api.put(`/accommodations/${editingId}`, payload);

        setListings((prev) =>
          prev.map((item) =>
            item._id === editingId ? data.accommodation : item
          )
        );

        toast.success("Listing updated");
      } else {
        const { data } = await api.post("/accommodations", payload);

        setListings([data.accommodation, ...listings]);
        toast.success("Listing created");
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    }
  };

  const startEdit = (listing) => {
    setEditingId(listing._id);

    setForm({
      title: listing.title || "",
      location: listing.location || "",
      description: listing.description || "",
      bedrooms: listing.bedrooms || 1,
      bathrooms: listing.bathrooms || 1,
      guests: listing.guests || 1,
      type: listing.type || "",
      price: listing.price || "",
      amenities: listing.amenities?.join(", ") || "",
      images: listing.images?.join(", ") || "",
      weeklyDiscount: listing.weeklyDiscount || 0,
      cleaningFee: listing.cleaningFee || 0,
      serviceFee: listing.serviceFee || 0,
      occupancyTaxes: listing.occupancyTaxes || 0
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      await api.delete(`/accommodations/${id}`);
      setListings((prev) => prev.filter((item) => item._id !== id));
      toast.success("Listing deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <h1>{editingId ? "Update Listing" : "Create Listing"}</h1>
          <p>
            {editingId
              ? "Edit the selected property listing."
              : "Add a new Airbnb property listing."}
          </p>
        </div>

        {editingId && (
          <button className="cancel-btn" onClick={cancelEdit}>
            <FiX /> Cancel Edit
          </button>
        )}
      </div>

      <form className="listing-form" onSubmit={saveListing}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="type" placeholder="Type e.g. Entire Apartment" value={form.type} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />

        <input name="bedrooms" type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={handleChange} />
        <input name="bathrooms" type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={handleChange} />
        <input name="guests" type="number" placeholder="Guests" value={form.guests} onChange={handleChange} />

        <input name="weeklyDiscount" type="number" placeholder="Weekly Discount %" value={form.weeklyDiscount} onChange={handleChange} />
        <input name="cleaningFee" type="number" placeholder="Cleaning Fee" value={form.cleaningFee} onChange={handleChange} />
        <input name="serviceFee" type="number" placeholder="Service Fee" value={form.serviceFee} onChange={handleChange} />
        <input name="occupancyTaxes" type="number" placeholder="Occupancy Taxes" value={form.occupancyTaxes} onChange={handleChange} />

        <input name="amenities" placeholder="Amenities separated by commas" value={form.amenities} onChange={handleChange} />
        <input name="images" placeholder="Image URLs separated by commas" value={form.images} onChange={handleChange} />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

        <button type="submit">
          {editingId ? "Update Listing" : "Create Listing"}
        </button>
      </form>

      <h1 style={{ marginTop: "32px" }}>Accommodation Listings</h1>

      {loading ? (
        <p>Loading listings...</p>
      ) : (
        <table className="listing-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Guests</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id}>
                <td>{listing.title}</td>
                <td>{listing.location}</td>
                <td>R {listing.price}</td>
                <td>{listing.guests}</td>
                <td>{Number(listing.rating || 0).toFixed(1)}</td>
                <td>
                  <button className="edit-btn" onClick={() => startEdit(listing)}>
                    <FiEdit />
                  </button>

                  <button className="delete-btn" onClick={() => deleteListing(listing._id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Listings;