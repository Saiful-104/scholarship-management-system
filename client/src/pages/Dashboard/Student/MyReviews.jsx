import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Container from '../../../components/Shared/Container';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import DeleteModal from '../../../components/Modal/DeleteModal';
import EditReviewModal from '../../../components/Modal/EditReviewModal';
import { 
  Star, 
  MessageSquare, 
  Building, 
  Award, 
  Calendar,
  Edit2,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  Quote,
  ThumbsUp,
  TrendingDown,
  ChevronRight
} from 'lucide-react';

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch user's reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/my-reviews`);
      return data.data;
    },
    enabled: !!user?.email,
  });

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.scholarshipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.universityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewComment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (ratingFilter === 'all') return matchesSearch;
    if (ratingFilter === 'high' && review.ratingPoint >= 4) return matchesSearch;
    if (ratingFilter === 'medium' && review.ratingPoint >= 2 && review.ratingPoint <= 3) return matchesSearch;
    if (ratingFilter === 'low' && review.ratingPoint <= 1) return matchesSearch;
    
    return false;
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/reviews/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-reviews']);
      setDeleteModalOpen(false);
    }
  });

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReview) {
      deleteMutation.mutate(selectedReview._id);
    }
  };

  const getRatingStats = () => {
    const stats = {
      total: reviews.length,
      average: reviews.length > 0 
        ? (reviews.reduce((acc, review) => acc + review.ratingPoint, 0) / reviews.length).toFixed(1)
        : 0,
      high: reviews.filter(r => r.ratingPoint >= 4).length,
      medium: reviews.filter(r => r.ratingPoint >= 2 && r.ratingPoint <= 3).length,
      low: reviews.filter(r => r.ratingPoint <= 1).length,
    };
    return stats;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'text-green-600 bg-green-50 border-green-200';
    if (rating >= 2) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = getRatingStats();

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
                  <p className="text-gray-600 mt-1">Manage your scholarship reviews</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="high">High (4-5 stars)</option>
                  <option value="medium">Medium (2-3 stars)</option>
                  <option value="low">Low (1 star)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.average}/5</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Positive Reviews</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.high}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Reviews</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.low}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <div 
              key={review._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 group"
            >
              <div className="p-6">
                {/* Header with Rating */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.ratingPoint 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(review.ratingPoint)} border`}>
                        {review.ratingPoint}/5
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {review.scholarshipName || 'Unnamed Scholarship'}
                    </h3>
                  </div>
                </div>

                {/* University Info */}
                <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {review.universityName || 'Unknown University'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'No date'}
                    </p>
                  </div>
                </div>

                {/* Review Comment */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Quote className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Your Review</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-3 top-0 text-4xl text-gray-200">"</div>
                    <p className="text-gray-700 pl-4 line-clamp-3 leading-relaxed">
                      {review.reviewComment || 'No comment provided'}
                    </p>
                    <div className="absolute -right-3 bottom-0 text-4xl text-gray-200">"</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditClick(review)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Review</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(review)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-red-100 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
              <Star className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {reviews.length === 0 ? 'No Reviews Yet' : 'No Matching Reviews'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {reviews.length === 0 
                ? "You haven't written any reviews yet. Share your experience with scholarships you've completed."
                : "No reviews match your current filters. Try adjusting your search criteria."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow">
                <ThumbsUp className="w-5 h-5" />
                <span>Write First Review</span>
              </button>
              <button className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200">
                <ChevronRight className="w-5 h-5" />
                <span>Browse Completed Scholarships</span>
              </button>
            </div>
          </div>
        )}

        {/* Rating Distribution */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.ratingPoint === star).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center">
                  <div className="flex items-center w-16">
                    <span className="text-sm font-medium text-gray-700 mr-2">{star}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 w-12 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedReview && (
        <>
          <EditReviewModal
            isOpen={editModalOpen}
            setIsOpen={setEditModalOpen}
            review={selectedReview}
          />

          <DeleteModal
            isOpen={deleteModalOpen}
            closeModal={() => setDeleteModalOpen(false)}
            confirmDelete={confirmDelete}
            itemName={`review for ${selectedReview?.scholarshipName}`}
            itemType="review"
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </Container>
  );
};

export default MyReviews;