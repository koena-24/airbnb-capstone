import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const listingsResponse = await api.get("/accommodations");
      const listings = listingsResponse.data.accommodations;

      const reviewRequests = listings.map((listing) =>
        api.get(`/reviews/accommodation/${listing._id}`)
      );

      const responses = await Promise.all(reviewRequests);

      const allReviews = responses.flatMap((response, index) =>
        response.data.reviews.map((review) => ({
          ...review,
          propertyTitle: listings[index].title
        }))
      );

      setReviews(allReviews);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <h1>Reviews</h1>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <table className="listing-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{review.propertyTitle}</td>
                <td>{review.user?.username}</td>
                <td>{review.rating}/5</td>
                <td>{review.comment}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default Reviews;