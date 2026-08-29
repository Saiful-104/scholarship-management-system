import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

import Container from '../../../components/Shared/Container';
import Heading from '../../../components/Shared/Heading';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import DeleteModal from '../../../components/Modal/DeleteModal';

const AllReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch all reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['moderator-reviews'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/moderator/review');
      return data.data;
    },
    enabled: !!user,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/moderator/reviews/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['moderator-reviews'],
      });
      setDeleteModalOpen(false);
    },
  });

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReview) {
      deleteMutation.mutate(selectedReview._id);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + (review.ratingPoint || 0),
      0
    );

    return (total / reviews.length).toFixed(1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 transition-colors duration-300">
      <Container>

        {/* Heading */}
        <div className="mb-8">
          <Heading
            title="All Reviews"
            subtitle="Manage and moderate scholarship reviews"
          />
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-black/30 border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">

          {/* Stats Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div className="flex items-center justify-between text-white">

              <div>
                <p className="text-sm font-medium opacity-90">
                  Total Reviews
                </p>

                <p className="text-3xl font-bold">
                  {reviews.length}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium opacity-90">
                  Average Rating
                </p>

                <div className="flex items-center justify-end gap-2">
                  <p className="text-3xl font-bold">
                    {calculateAverageRating()}
                  </p>

                  <span className="text-2xl">★</span>
                </div>
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">

              {/* Table Head */}
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 border-b-2 border-gray-200 dark:border-gray-700">

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Student Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Scholarship Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    University Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Review Comment
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Rating
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Review Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>

                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

                {reviews.map((review) => (
                  <tr
                    key={review._id}
                    className="
                      bg-white
                      dark:bg-gray-900
                      hover:bg-gradient-to-r
                      hover:from-purple-50
                      hover:to-pink-50
                      dark:hover:from-purple-950/30
                      dark:hover:to-pink-950/30
                      transition-all
                      duration-200
                    "
                  >

                    {/* Student */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">

                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold mr-3">
                          {review.userName?.charAt(0).toUpperCase() || 'N'}
                        </div>

                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {review.userName || 'N/A'}
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {review.userEmail || ''}
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* Scholarship */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {review.scholarshipName || 'N/A'}
                      </div>
                    </td>

                    {/* University */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {review.universityName || 'N/A'}
                      </div>
                    </td>

                    {/* Comment */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs line-clamp-2">
                        {review.reviewComment || 'No comment'}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xl ${
                                i < review.ratingPoint
                                  ? 'text-amber-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded-full inline-block w-fit">
                          {review.ratingPoint}/5
                        </span>

                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {review.reviewDate
                          ? new Date(
                              review.reviewDate
                            ).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </td>

                    {/* Delete */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteClick(review)}
                        className="
                          px-4
                          py-2
                          bg-gradient-to-r
                          from-red-500
                          to-rose-500
                          hover:from-red-600
                          hover:to-rose-600
                          dark:from-red-600
                          dark:to-rose-600
                          dark:hover:from-red-700
                          dark:hover:to-rose-700
                          text-white
                          rounded-lg
                          text-sm
                          font-medium
                          shadow-sm
                          hover:shadow-md
                          transition-all
                          duration-200
                        "
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* No Reviews */}
        {reviews.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-black/30 border border-gray-100 dark:border-gray-800 mt-8 transition-colors duration-300">

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-4">

              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>

            </div>

            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No reviews found
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Reviews will appear here once students submit them
            </p>

          </div>
        )}

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          confirmDelete={confirmDelete}
          itemName={`review by ${selectedReview?.userName}`}
          itemType="review"
          isLoading={deleteMutation.isPending}
        />

      </Container>
    </div>
  );
};

export default AllReviews;