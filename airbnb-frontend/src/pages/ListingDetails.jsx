import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const [booking, setBooking] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1
  });

  useEffect(() => {
    fetchListing();
    fetchReviews();
  }, [id]);

  const fetchListing = async () => {
    const { data } = await api.get(`/accommodations/${id}`);
    setListing(data.accommodation);
  };

  const fetchReviews = async () => {
    const { data } = await api.get(`/reviews/accommodation/${id}`);
    setReviews(data.reviews);
  };

  const handleBookingChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const calculateNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const diff = new Date(booking.checkOut) - new Date(booking.checkIn);
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  const nights = calculateNights();
  const subtotal = listing ? listing.price * nights : 0;
  const discount =
    listing && nights >= 7 ? (subtotal * listing.weeklyDiscount) / 100 : 0;
  const total =
    listing && nights > 0
      ? subtotal - discount + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes
      : 0;

  const reserve = async () => {
    try {
      if (!booking.checkIn || !booking.checkOut) {
        toast.error("Please select dates");
        return;
      }

      await api.post("/reservations", {
        accommodationId: id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: Number(booking.guests)
      });

      toast.success("Reservation created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reservation failed. Please login first.");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await api.post("/reviews", {
        accommodationId: id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment
      });

      toast.success("Review added");
      setReviewForm({ rating: 5, comment: "" });
      fetchReviews();
      fetchListing();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed. Please login first.");
    }
  };

  if (!listing) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  return (
    <div className="details-container">
      <h1>{listing.title}</h1>

      <p className="details-location">
        <FiStar /> {Number(listing.rating || 0).toFixed(1)} · {listing.location}
      </p>

      <div className="gallery">
        <img
          className="main-image"
          src={listing.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80"}
          alt=""
        />

        <div className="small-images">
          {(listing.images?.slice(1, 5) || []).map((img, index) => (
            <img key={index} src={img} alt="" />
          ))}
        </div>
      </div>

      <div className="details-grid">
        <div>
          <h2>{listing.type} hosted by {listing.hostName}</h2>
          <p>{listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms</p>

          <hr />

          <h3>Description</h3>
          <p>{listing.description}</p>

          <hr />

          <h3>Amenities</h3>
          <ul>
            {listing.amenities?.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <hr />

          <h3>Reviews</h3>

          <form className="review-form" onSubmit={submitReview}>
            <select name="rating" value={reviewForm.rating} onChange={handleReviewChange}>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <textarea
              name="comment"
              placeholder="Write your review..."
              value={reviewForm.comment}
              onChange={handleReviewChange}
              required
            />

            <button type="submit">Submit Review</button>
          </form>

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div className="review-card" key={review._id}>
                  <strong>{review.user?.username || "Guest"}</strong>
                  <p>{review.rating}/5 ⭐</p>
                  <p>{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="booking-card">
          <h2>R {listing.price} / night</h2>

          <div className="booking-inputs">
            <label>Check in<input type="date" name="checkIn" value={booking.checkIn} onChange={handleBookingChange} /></label>
            <label>Check out<input type="date" name="checkOut" value={booking.checkOut} onChange={handleBookingChange} /></label>
            <label>Guests<input type="number" name="guests" min="1" value={booking.guests} onChange={handleBookingChange} /></label>
          </div>

          <div className="price-lines">
            <p><span>R {listing.price} x {nights} nights</span><span>R {subtotal}</span></p>
            <p><span>Weekly discount</span><span>- R {discount}</span></p>
            <p><span>Cleaning fee</span><span>R {listing.cleaningFee}</span></p>
            <p><span>Service fee</span><span>R {listing.serviceFee}</span></p>
            <p><span>Taxes</span><span>R {listing.occupancyTaxes}</span></p>
            <hr />
            <p className="total-line"><span>Total</span><span>R {total}</span></p>
          </div>

          <button className="reserve-btn" onClick={reserve}>Reserve</button>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;