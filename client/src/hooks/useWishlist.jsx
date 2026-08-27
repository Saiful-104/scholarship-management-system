import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

export const useWishlist = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch user's wishlist
  const {
    data: wishlist = [],
    isLoading: wishlistLoading,
    refetch: refetchWishlist,
  } = useQuery({
    queryKey: ["wishlist", user?.email],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await axiosSecure.get(`/wishlist/${user.email}`);
      return data.data || [];
    },
    enabled: !!user,
  });

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (scholarship) => {
      if (!user) throw new Error("Please login to save scholarships");
      const { data } = await axiosSecure.post("/wishlist", {
        userEmail: user.email,
        scholarshipId: scholarship._id,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist", user?.email]);
      toast.success("Added to wishlist!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: async (scholarshipId) => {
      const { data } = await axiosSecure.delete(
        `/wishlist/${user.email}/${scholarshipId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist", user?.email]);
      toast.success("Removed from wishlist!");
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });

  // Check if a scholarship is in wishlist
  const isInWishlist = (scholarshipId) => {
    return wishlist.some((item) => item._id === scholarshipId);
  };

  // Toggle wishlist status
  const toggleWishlist = (scholarship) => {
    if (!user) {
      toast.error("Please login to save scholarships");
      return;
    }

    if (isInWishlist(scholarship._id)) {
      removeFromWishlistMutation.mutate(scholarship._id);
    } else {
      addToWishlistMutation.mutate(scholarship);
    }
  };

  return {
    wishlist,
    wishlistLoading,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    refetchWishlist,
  };
};