import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Trash2, 
  Edit2, 
  Calendar, 
  MapPin, 
  Building2, 
  DollarSign,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Container from '../../../components/Shared/Container';
import Heading from '../../../components/Shared/Heading';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import DeleteModal from '../../../components/Modal/DeleteModal';
import UpdateScholarshipModal from '../../../components/Modal/UpdateScholarshipModal';

const ManageScholarships = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [scholarshipToDelete, setScholarshipToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch all scholarships
  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['admin-scholarships'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/admin/scholarships');
      return data.data;
    }
  });

  // Filter scholarships
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.universityCountry.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    
    const now = new Date();
    const deadline = new Date(scholarship.applicationDeadline);
    const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (filter === 'upcoming' && daysUntilDeadline > 7) return matchesSearch;
    if (filter === 'urgent' && daysUntilDeadline <= 7 && daysUntilDeadline > 0) return matchesSearch;
    if (filter === 'expired' && daysUntilDeadline <= 0) return matchesSearch;
    
    return false;
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/scholarships/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-scholarships']);
      setDeleteModalOpen(false);
      setScholarshipToDelete(null);
    }
  });

  const handleDeleteClick = (scholarship) => {
    setScholarshipToDelete(scholarship);
    setDeleteModalOpen(true);
  };

  const handleUpdateClick = (scholarship) => {
    setSelectedScholarship(scholarship);
    setUpdateModalOpen(true);
  };

  const confirmDelete = () => {
    if (scholarshipToDelete) {
      deleteMutation.mutate(scholarshipToDelete._id);
    }
  };

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline <= 0) {
      return { text: 'Expired', color: 'bg-red-100 text-red-700' };
    } else if (daysUntilDeadline <= 7) {
      return { text: `${daysUntilDeadline} days left`, color: 'bg-amber-100 text-amber-700' };
    } else {
      return { text: 'Active', color: 'bg-green-100 text-green-700' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Scholarships</h1>
              <p className="text-gray-600 mt-2">
                Total scholarships: <span className="font-semibold">{scholarships.length}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search scholarships..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Scholarships</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="urgent">Urgent</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => {
            const status = getDeadlineStatus(scholarship.applicationDeadline);
            
            return (
              <div 
                key={scholarship._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
              >
                {/* Header with Status */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {scholarship.scholarshipName}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Scholarship Details */}
                <div className="px-6 py-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">University</p>
                      <p className="font-medium text-gray-900">{scholarship.universityName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Country</p>
                      <p className="font-medium text-gray-900">{scholarship.universityCountry}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Application Fees</p>
                      <p className="font-medium text-gray-900">${scholarship.applicationFees}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Application Deadline</p>
                      <p className="font-medium text-gray-900">
                        {new Date(scholarship.applicationDeadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleUpdateClick(scholarship)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Update</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(scholarship)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredScholarships.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search' : 'No scholarships have been added yet'}
            </p>
          </div>
        )}

        {/* Stats Bar */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total Scholarships</p>
            <p className="text-2xl font-bold text-gray-900">{scholarships.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {scholarships.filter(s => getDeadlineStatus(s.applicationDeadline).text === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Urgent</p>
            <p className="text-2xl font-bold text-amber-600">
              {scholarships.filter(s => getDeadlineStatus(s.applicationDeadline).text.includes('days left')).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Expired</p>
            <p className="text-2xl font-bold text-red-600">
              {scholarships.filter(s => getDeadlineStatus(s.applicationDeadline).text === 'Expired').length}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        closeModal={() => setDeleteModalOpen(false)}
        confirmDelete={confirmDelete}
        itemName={scholarshipToDelete?.scholarshipName}
      />

      {/* Update Modal */}
      <UpdateScholarshipModal
        isOpen={updateModalOpen}
        setIsOpen={setUpdateModalOpen}
        scholarship={selectedScholarship}
      />
    </Container>
  );
};

export default ManageScholarships;