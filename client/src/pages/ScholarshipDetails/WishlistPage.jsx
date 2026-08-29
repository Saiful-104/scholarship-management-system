import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";

import { Link } from "react-router";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { useWishlist } from "../../hooks/useWishlist";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";

const WishlistPage = () => {
  const { wishlist, wishlistLoading, removeFromWishlist } = useWishlist();

  if (wishlistLoading) {
    return <LoadingSpinner />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Container>
      <div className="py-8">
        <Heading
          title="My Wishlist"
          subtitle={`${wishlist.length} saved scholarships`}
        />
        
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <FaRegHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-8">
              Save scholarships you're interested in by clicking the heart icon
            </p>
            <Link
              to="/scholarships"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Browse Scholarships
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {wishlist.map((scholarship) => (
              <div
                key={scholarship._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={
                      scholarship.universityImage ||
                      "https://via.placeholder.com/400x300"
                    }
                    alt={scholarship.universityName}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(scholarship._id)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full text-red-500 hover:text-red-600 shadow-md"
                    title="Remove from wishlist"
                  >
                    <FaHeart />
                  </button>
                </div>
                
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {scholarship.scholarshipName}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {scholarship.universityName}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-green-600 font-bold">
                      ${scholarship.applicationFees || 0}
                    </span>
                    <span className="text-sm text-gray-500">
                      {scholarship.universityCountry}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link
                      to={`/scholarship/${scholarship._id}`}
                      className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/payment/checkout/${scholarship._id}`}
                      className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default WishlistPage;