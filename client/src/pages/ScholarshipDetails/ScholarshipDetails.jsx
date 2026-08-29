import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import Button from "../../components/Shared/Button/Button";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ScholarshipRecommendations from "./ScholarshipRecommendations";
import WishlistButton from "../../components/Shared/Button/WishlistButton";

const ScholarshipDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch scholarship details
  const { data: scholarship = {}, isLoading: scholarshipLoading } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/scholarships/${id}`);
      console.log("Scholarship data:", data.data);
      return data.data;
    },
  });

  // Fetch reviews for this scholarship
  const { data: reviewsData = {}, isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      console.log("Fetching reviews for scholarship ID:", id);
      const { data } = await axiosSecure.get(`/reviews/${id}`);
      console.log("Reviews data:", data.data);
      return data;
    },
    enabled: !!id,
  });

  const handleApply = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/payment/checkout/${id}`);
  };

  if (scholarshipLoading) {
    return <LoadingSpinner />;
  }

  const {
    universityImage,
    scholarshipName,
    universityWorldRank,
    applicationDeadline,
    universityCountry,
    applicationFees,
    scholarshipDescription,
    stipend,
    coverageDetails,
    universityName,
    universityCity,
    scholarshipCategory,
  } = scholarship || {};

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Extract reviews from response
  const reviews = reviewsData?.data || [];

  return (
    <Container>
      <div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-8">
        {/* Left Section */}
        <div className="flex flex-col gap-6 flex-1">
          {/* University Image with Wishlist Button */}
          <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
            <img
              className="object-cover w-full h-64 md:h-80"
              src={universityImage || "https://via.placeholder.com/400x300"}
              alt={universityName}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x300";
              }}
            />
            <div className="absolute top-4 right-4">
              <WishlistButton scholarship={scholarship} size="medium" />
            </div>
          </div>

          {/* University Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">University Details</h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                {scholarshipCategory || "General"}
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold text-sm">
                  World Rank: #{universityWorldRank || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <span>
                  📍 {universityCity ? `${universityCity}, ` : ""}
                  {universityCountry || "Location not specified"}
                </span>
              </div>

              {/* Application Deadline */}
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600 font-semibold">
                  ⏰ Application Deadline: {formatDate(applicationDeadline)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          {/* Scholarship Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <Heading
                title={scholarshipName || "Scholarship"}
                subtitle={`University: ${universityName || "University"}`}
              />
            </div>
            <hr className="my-6" />
          </div>

          {/* Scholarship Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Scholarship Description
            </h3>
            <div className="text-gray-600 leading-relaxed">
              {scholarshipDescription || "No description available."}
            </div>
          </div>
          <hr className="my-6" />

          {/* Stipend & Coverage */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Financial Benefits</h3>
            {stipend && (
              <div className="mb-4">
                <div className="text-lg font-semibold text-green-600">
                  Stipend: {stipend}
                </div>
              </div>
            )}

            {coverageDetails && (
              <div>
                <h4 className="font-semibold mb-2">Coverage Includes:</h4>
                <div className="text-gray-600">{coverageDetails}</div>
              </div>
            )}
          </div>
          <hr className="my-6" />

          {/* Application Section */}
          <div className="mb-10 p-6 bg-gray-50 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  Application Fee
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${applicationFees || 0}
                </p>
              </div>
              <Button
                onClick={handleApply}
                label={user ? "Apply for Scholarship" : "Login to Apply"}
                className={`px-8 py-3 text-lg ${
                  user
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              />
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-6">
              Student Reviews ({reviews.length})
            </h3>

            {reviewsLoading ? (
              <LoadingSpinner />
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this scholarship!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white border rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        className="rounded-full w-12 h-12 object-cover"
                        src={
                          review.userImage ||
                          `https://ui-avatars.com/api/?name=${review.userName}&background=random`
                        }
                        alt={review.userName}
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.userName || "Anonymous"}
                            </h4>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, index) => (
                                <span
                                  key={index}
                                  className={`text-lg ${
                                    index < (review.ratingPoint || 0)
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="ml-2 text-gray-600 text-sm">
                                ({review.ratingPoint || 0}/5)
                              </span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {review.reviewDate
                              ? formatDate(review.reviewDate)
                              : "Recent"}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-3">
                          {review.reviewComment || "No comment provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scholarship Recommendations */}
          {scholarshipCategory && (
            <ScholarshipRecommendations
              currentScholarshipId={id}
            scholarshipCategory={scholarshipCategory}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default ScholarshipDetails;