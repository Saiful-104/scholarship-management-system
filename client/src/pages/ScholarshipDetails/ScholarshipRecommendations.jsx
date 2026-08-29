import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router";

import WishlistButton from "../../components/Shared/Button/WishlistButton";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";

const ScholarshipRecommendations = ({ currentScholarshipId, scholarshipCategory }) => {
  const axiosSecure = useAxiosSecure();

  const {
    data: recommendations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recommendations", scholarshipCategory, currentScholarshipId],
    queryFn: async () => {
      if (!scholarshipCategory) return [];
      const { data } = await axiosSecure.get(
        `/recommendations/${scholarshipCategory}?exclude=${currentScholarshipId}`
      );
      return data.data || [];
    },
    enabled: !!scholarshipCategory && !!currentScholarshipId,
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="small" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load recommendations
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        You May Also Like
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.slice(0, 3).map((scholarship) => (
          <div
            key={scholarship._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Scholarship Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={
                  scholarship.universityImage ||
                  "https://via.placeholder.com/400x300"
                }
                alt={scholarship.universityName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <WishlistButton scholarship={scholarship} size="small" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="text-white font-semibold text-sm">
                  {scholarship.scholarshipCategory || "Scholarship"}
                </span>
              </div>
            </div>

            {/* Scholarship Info */}
            <div className="p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                {scholarship.scholarshipName}
              </h4>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {scholarship.universityName}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  #{scholarship.universityWorldRank || "N/A"}
                </span>
                <span className="text-green-600 font-bold">
                  ${scholarship.applicationFees || 0}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  📍 {scholarship.universityCountry}
                </span>
                <span className="flex items-center gap-1">
                  ⏰ {formatDate(scholarship.applicationDeadline)}
                </span>
              </div>

              <Link
                to={`/scholarship/${scholarship._id}`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipRecommendations;