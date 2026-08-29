import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  UserCog, 
  Trash2, 
  Shield, 
  UserCheck, 
  UserMinus, 
  Calendar, 
  Mail, 
  Search,
  Filter,
  ShieldAlert,
  TrendingUp,
  MoreVertical,
  CheckCircle
} from 'lucide-react';
import Container from '../../../components/Shared/Container';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import UpdateUserRoleModal from '../../../components/Modal/UpdateUserRoleModal';
import DeleteModal from '../../../components/Modal/DeleteModal';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('all');
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/admin/users');
      return data.data;
    }
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const response = await axiosSecure.patch(`/users/${id}/role`, { role });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      setUpdateModalOpen(false);
      setSelectedUser(null);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateRoleClick = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete._id);
    }
  };

  const handleUpdateRole = (role) => {
    if (selectedUser) {
      updateRoleMutation.mutate({
        id: selectedUser._id,
        role
      });
    }
  };

  const getRoleStats = () => {
    const stats = {
      admin: users.filter(u => u.role === 'admin').length,
      moderator: users.filter(u => u.role === 'moderator').length,
      student: users.filter(u => u.role === 'student').length,
      total: users.length
    };
    return stats;
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'moderator': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'student': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <ShieldAlert className="w-4 h-4" />;
      case 'moderator': return <UserCog className="w-4 h-4" />;
      case 'student': return <UserCheck className="w-4 h-4" />;
      default: return <UserMinus className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const stats = getRoleStats();

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                  <p className="text-gray-600 mt-1">Total {stats.total} registered users</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="moderator">Moderators</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.student}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Moderators</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.moderator}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <UserCog className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{stats.admin}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid/Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Users ({filteredUsers.length})
              </h2>
              <div className="text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-xl border-2 border-white shadow-sm"
                            src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-4 h-4 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${getRoleColor(user.role)} mr-2`}></div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                          ${user.role === 'admin' ? 'bg-red-50 text-red-700' : 
                            user.role === 'moderator' ? 'bg-amber-50 text-amber-700' : 
                            'bg-blue-50 text-blue-700'}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1.5">{user.role}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateRoleClick(user)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                        >
                          <UserCog className="w-4 h-4 mr-2" />
                          Role
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'No users match your filters'}
              </p>
            </div>
          )}
        </div>

        {/* Role Distribution */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
            <div className="space-y-4">
              {['student', 'moderator', 'admin'].map((role) => {
                const count = stats[role];
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                
                return (
                  <div key={role} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(role)}
                        <span className="text-sm font-medium text-gray-700 capitalize">{role}s</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getRoleColor(role)} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setRoleFilter('student')}
                className="p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors duration-200 text-left"
              >
                <UserCheck className="w-6 h-6 text-blue-600 mb-2" />
                <div className="font-medium text-gray-900">{stats.student} Students</div>
                <div className="text-sm text-gray-600">View all</div>
              </button>
              
              <button 
                onClick={() => setRoleFilter('moderator')}
                className="p-4 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors duration-200 text-left"
              >
                <UserCog className="w-6 h-6 text-amber-600 mb-2" />
                <div className="font-medium text-gray-900">{stats.moderator} Moderators</div>
                <div className="text-sm text-gray-600">Manage team</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Role Modal */}
      <UpdateUserRoleModal
        isOpen={updateModalOpen}
        closeModal={() => setUpdateModalOpen(false)}
        user={selectedUser}
        updateRole={handleUpdateRole}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        closeModal={() => setDeleteModalOpen(false)}
        confirmDelete={confirmDelete}
        itemName={userToDelete?.name || 'User'}
        itemType="user"
      />
    </Container>
  );
};

export default ManageUsers;