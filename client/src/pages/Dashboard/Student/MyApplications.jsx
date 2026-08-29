import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Container from '../../../components/Shared/Container';
import Heading from '../../../components/Shared/Heading';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import DeleteModal from '../../../components/Modal/DeleteModal';
import ApplicationDetailsModal from '../../../components/Modal/ApplicationDetailsModal';
import EditApplicationModal from '../../../components/Modal/EditApplicationModal';
import AddReviewModal from '../../../components/Modal/AddReviewModal';

const MyApplications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch student's applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['my-applications', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/my-applications/${user?.email}`);
      return data.data;
    },
    enabled: !!user?.email,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/applications/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-applications', user?.email]);
      setDeleteModalOpen(false);
    }
  });

  const handleDetailsClick = (application) => {
    setSelectedApplication(application);
    setDetailsModalOpen(true);
  };

  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (application) => {
    setSelectedApplication(application);
    setDeleteModalOpen(true);
  };

  const handleReviewClick = (application) => {
    setSelectedApplication(application);
    setReviewModalOpen(true);
  };

  const handlePayClick = (application) => {
    // Navigate to payment page with correct scholarship ID
    window.location.href = `/payment/checkout/${application.scholarshipId}`;
  };

  const confirmDelete = () => {
    if (selectedApplication) {
      deleteMutation.mutate(selectedApplication._id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <Heading title="My Applications" />
      
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Fees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.universityName}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {application.universityAddress || 'Not specified'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.subjectCategory}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${application.applicationFees || 0}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${application.applicationStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                          application.applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                          application.applicationStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {application.applicationStatus?.charAt(0).toUpperCase() + application.applicationStatus?.slice(1) || 'Pending'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {application.feedback || 'No feedback yet'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {/* Details Button - Always visible */}
                        <button
                          onClick={() => handleDetailsClick(application)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs transition-colors"
                        >
                          Details
                        </button>
                        
                        {/* Edit Button - Only if pending */}
                        {application.applicationStatus === 'pending' && (
                          <button
                            onClick={() => handleEditClick(application)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        
                        {/* Pay Button - Only if pending AND paymentStatus is unpaid */}
                        {application.applicationStatus === 'pending' && 
                         application.paymentStatus === 'unpaid' && (
                          <button
                            onClick={() => handlePayClick(application)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs transition-colors"
                          >
                            Pay
                          </button>
                        )}
                        
                        {/* Delete Button - Only if pending */}
                        {application.applicationStatus === 'pending' && (
                          <button
                            onClick={() => handleDeleteClick(application)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs transition-colors"
                          >
                            Delete
                          </button>
                        )}
                        
                        {/* Add Review Button - Only if completed */}
                        {application.applicationStatus === 'completed' && (
                          <button
                            onClick={() => handleReviewClick(application)}
                            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-xs transition-colors"
                          >
                            Add Review
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {applications.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-lg font-medium">No applications found</p>
            <p className="mt-2">You haven't applied for any scholarships yet.</p>
            <a href="/scholarships" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Browse Scholarships
            </a>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedApplication && (
        <>
          <ApplicationDetailsModal
            isOpen={detailsModalOpen}
            setIsOpen={setDetailsModalOpen}
            application={selectedApplication}
          />

          <EditApplicationModal
            isOpen={editModalOpen}
            setIsOpen={setEditModalOpen}
            application={selectedApplication}
          />

          <AddReviewModal
            isOpen={reviewModalOpen}
            setIsOpen={setReviewModalOpen}
            application={selectedApplication}
            user={user}
          />

          <DeleteModal
            isOpen={deleteModalOpen}
            closeModal={() => setDeleteModalOpen(false)}
            confirmDelete={confirmDelete}
            itemName={`application for ${selectedApplication?.universityName}`}
            itemType="application"
            isLoading={deleteMutation.isPending}
          />
        </>
      )}
    </Container>
  );
};

export default MyApplications;