
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Container from '../../../components/Shared/Container';
import Heading from '../../../components/Shared/Heading';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import ApplicationDetailsModal from '../../../components/Modal/ApplicationDetailsModal';
import FeedbackModal from '../../../components/Modal/FeedbackModal';

const ManageApplications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['moderator-applications'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/moderator/applications');
      return data.data;
    },
    enabled: !!user,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axiosSecure.put(
        `/moderator/applications/${id}/status`,
        {
          applicationStatus: status,
        }
      );
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['moderator-applications'],
      }),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.put(
        `/moderator/applications/${id}/reject`
      );
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['moderator-applications'],
      }),
  });

  const handleDetailsClick = (app) => {
    setSelectedApplication(app);
    setDetailsModalOpen(true);
  };

  const handleFeedbackClick = (app) => {
    setSelectedApplication(app);
    setFeedbackModalOpen(true);
  };

  const handleStatusChange = (app, newStatus) => {
    statusMutation.mutate({
      id: app._id,
      status: newStatus,
    });
  };

  const handleRejectClick = (app) => {
    if (
      window.confirm(
        `Reject application from ${app.userName || 'this user'}?`
      )
    ) {
      rejectMutation.mutate(app._id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Container>
      <div className="py-8">

        <Heading
          title="Manage Applications"
          subtitle="Review and update scholarship applications"
        />

        {/* Main Card */}
        <div
          className="
            mt-6
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-2xl
            shadow-xl
            dark:shadow-black/30
            overflow-hidden
            transition-colors
            duration-300
          "
        >

          {applications.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                No applications found
              </p>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                New applications will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">

                {/* ================= TABLE HEADER ================= */}
                <thead className="bg-gray-50 dark:bg-gray-800/80">
                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Applicant
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      University
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>

                  </tr>
                </thead>

                {/* ================= TABLE BODY ================= */}
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="
                        bg-white
                        dark:bg-gray-900
                        hover:bg-gray-50
                        dark:hover:bg-gray-800/70
                        transition-colors
                        duration-150
                      "
                    >

                      {/* Applicant */}
                      <td className="px-6 py-5">

                        <div className="font-medium text-gray-900 dark:text-white">
                          {app.userName || '—'}
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {app.userEmail}
                        </div>

                      </td>

                      {/* University */}
                      <td className="px-6 py-5 text-sm text-gray-700 dark:text-gray-300">
                        {app.universityName || '—'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">

                        <span
                          className={`
                            inline-flex
                            px-3
                            py-1
                            text-xs
                            font-medium
                            rounded-full
                            border

                            ${
                              app.applicationStatus === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                                : app.applicationStatus === 'rejected'
                                ? 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                                : app.applicationStatus === 'completed'
                                ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                                : app.applicationStatus === 'processing'
                                ? 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800'
                                : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                            }
                          `}
                        >
                          {app.applicationStatus || 'pending'}
                        </span>

                      </td>

                      {/* Payment */}
                      <td className="px-6 py-5">

                        <span
                          className={`
                            inline-flex
                            px-3
                            py-1
                            text-xs
                            font-medium
                            rounded-full
                            border

                            ${
                              app.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                            }
                          `}
                        >
                          {app.paymentStatus || 'unpaid'}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">

                        <div className="flex flex-wrap gap-2">

                          {/* Details */}
                          <button
                            onClick={() => handleDetailsClick(app)}
                            className="
                              px-3.5
                              py-1.5
                              bg-indigo-600
                              hover:bg-indigo-700
                              dark:bg-indigo-500
                              dark:hover:bg-indigo-600
                              text-white
                              text-sm
                              rounded-lg
                              transition-all
                              shadow-sm
                              hover:shadow
                            "
                          >
                            Details
                          </button>

                          {/* Feedback */}
                          <button
                            onClick={() => handleFeedbackClick(app)}
                            className="
                              px-3.5
                              py-1.5
                              bg-amber-600
                              hover:bg-amber-700
                              dark:bg-amber-500
                              dark:hover:bg-amber-600
                              text-white
                              text-sm
                              rounded-lg
                              transition-all
                              shadow-sm
                              hover:shadow
                            "
                          >
                            Feedback
                          </button>

                          <div className="flex gap-1.5">

                            {/* Process */}
                            <button
                              onClick={() =>
                                handleStatusChange(app, 'processing')
                              }
                              disabled={
                                app.applicationStatus === 'processing'
                              }
                              className={`
                                px-3
                                py-1.5
                                text-sm
                                rounded-lg
                                font-medium
                                transition-all

                                ${
                                  app.applicationStatus === 'processing'
                                    ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white shadow-sm hover:shadow'
                                }
                              `}
                            >
                              Process
                            </button>

                            {/* Complete */}
                            <button
                              onClick={() =>
                                handleStatusChange(app, 'completed')
                              }
                              disabled={
                                app.applicationStatus === 'completed'
                              }
                              className={`
                                px-3
                                py-1.5
                                text-sm
                                rounded-lg
                                font-medium
                                transition-all

                                ${
                                  app.applicationStatus === 'completed'
                                    ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm hover:shadow'
                                }
                              `}
                            >
                              Complete
                            </button>

                            {/* Reject */}
                            <button
                              onClick={() => handleRejectClick(app)}
                              disabled={
                                app.applicationStatus === 'rejected'
                              }
                              className={`
                                px-3
                                py-1.5
                                text-sm
                                rounded-lg
                                font-medium
                                transition-all

                                ${
                                  app.applicationStatus === 'rejected'
                                    ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white shadow-sm hover:shadow'
                                }
                              `}
                            >
                              Reject
                            </button>

                          </div>
                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {selectedApplication && (
        <>
          <ApplicationDetailsModal
            isOpen={detailsModalOpen}
            setIsOpen={setDetailsModalOpen}
            application={selectedApplication}
          />

          <FeedbackModal
            isOpen={feedbackModalOpen}
            setIsOpen={setFeedbackModalOpen}
            application={selectedApplication}
          />
        </>
      )}
    </Container>
  );
};

export default ManageApplications;

