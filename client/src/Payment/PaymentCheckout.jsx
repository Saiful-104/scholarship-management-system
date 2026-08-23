import Container from "../components/Shared/Container";
import Heading from "../components/Shared/Heading";
import Button from "../components/Shared/Button/Button";
import { useParams, useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import useAuth from '../hooks/useAuth';
import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

const PaymentCheckout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // This is the scholarshipId
  const axiosSecure = useAxiosSecure();
  const [processing, setProcessing] = useState(false);

  console.log("PaymentCheckout - Scholarship ID:", id);
  console.log("PaymentCheckout - User:", user);

  // Fetch scholarship info using the ID from params
  const { data: scholarship = {}, isLoading, error } = useQuery({
    queryKey: ["payment-scholarship", id],
    queryFn: async () => {
      console.log("Fetching scholarship with ID:", id);
      const { data } = await axiosSecure.get(`/scholarships/${id}`);
      console.log("Scholarship data received:", data);
      return data.data;
    },
    enabled: !!id && !!user, // Only fetch if we have an ID and user
    retry: 2,
  });

  // If loading or error states
  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    console.error("Error fetching scholarship:", error);
    return (
      <Container>
        <div className="text-center py-12">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Scholarship</h2>
          <p className="text-gray-600 mb-6">Failed to load scholarship information. Please try again.</p>
          <Button
            label="Go Back"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 text-white rounded-lg"
            onClick={() => navigate(-1)}
          />
        </div>
      </Container>
    );
  }

  if (!scholarship || Object.keys(scholarship).length === 0) {
    return (
      <Container>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Scholarship Not Found</h2>
          <p className="text-gray-600 mb-6">The scholarship you're trying to apply for doesn't exist or has been removed.</p>
          <Button
            label="Browse Scholarships"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 text-white rounded-lg"
            onClick={() => navigate("/scholarships")}
          />
        </div>
      </Container>
    );
  }

  // Extract scholarship data with defaults
  const { 
    scholarshipName = "Unknown Scholarship", 
    universityName = "Unknown University", 
    applicationFees = 0, 
    degree = "Not specified",
    universityImage = "",
    subjectCategory = "General"
  } = scholarship;

  const handlePayment = async () => {
    if (!user) {
      alert("You must be logged in to apply!");
      return;
    }

    setProcessing(true);

    try {
      // First, check if user already applied
      const checkResponse = await axiosSecure.get(`/my-applications/${user.email}`);
      const existingApplications = checkResponse.data.data || [];
      
      const alreadyApplied = existingApplications.find(
        app => app.scholarshipId === id || app.scholarshipId?._id === id
      );

      if (alreadyApplied) {
        const shouldProceed = window.confirm(
          "You have already applied for this scholarship. Do you want to proceed to payment?"
        );
        
        if (!shouldProceed) {
          setProcessing(false);
          return;
        }
      }

      // Prepare application data
      const applicationData = {
        scholarshipId: id,
        scholarshipName,
        universityName,
        degree,
        applicationFees: Number(applicationFees),
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        paymentStatus: "unpaid"
      };

      console.log("Saving application:", applicationData);

      // Save application to database
      const saveResponse = await axiosSecure.post("/save-application", applicationData);
      console.log("Save application response:", saveResponse.data);

      if (!saveResponse.data.success) {
        throw new Error(saveResponse.data.message || "Failed to save application");
      }

      // If fees are 0, update to paid and redirect
      if (Number(applicationFees) === 0) {
        console.log("Processing free application...");
        
        const updateResponse = await axiosSecure.post("/update-free-application", {
          scholarshipId: id,
          userEmail: user.email,
        });

        console.log("Update free application response:", updateResponse.data);

        if (updateResponse.data.success) {
          alert("Application submitted successfully! Your application is now pending review.");
          navigate(`/payment-success?free=true&scholarshipId=${id}`);
        } else {
          throw new Error(updateResponse.data.message || "Failed to update application");
        }
        return;
      }

      // For paid scholarships, proceed with Stripe
      console.log("Processing paid application...");
      
      const paymentInfo = {
        scholarshipId: id,
        scholarshipName,
        universityName,
        degree,
        applicationFees: Number(applicationFees),
        customer: {
          name: user.displayName || "User",
          email: user.email,
          id: user.uid,
          photoURL: user.photoURL || ""
        }
      };

      console.log("Creating payment session:", paymentInfo);
      
      const paymentResponse = await axiosSecure.post("/create-checkout-session", paymentInfo);
      console.log("Payment session response:", paymentResponse.data);

      if (paymentResponse.data.url) {
        window.location.href = paymentResponse.data.url;
      } else {
        throw new Error("No payment URL received");
      }

    } catch (err) {
      console.error("Payment error:", err);
      
      let errorMessage = "Failed to process payment. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Error: ${errorMessage}`);
      setProcessing(false);
    }
  };

  return (
    <Container>
      <div className="max-w-3xl mx-auto">
        <Heading 
          title="Complete Your Application" 
          subtitle="Secure payment gateway" 
        />

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          {/* Scholarship Summary */}
          <div className="flex items-center gap-6 mb-8">
            {universityImage ? (
              <img 
                className="w-20 h-20 rounded-lg object-cover" 
                src={universityImage} 
                alt={universityName} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/80x80?text=University";
                }}
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold">{scholarshipName}</h3>
              <p className="text-gray-600">{universityName}</p>
              <p className="text-gray-600">Degree: {degree}</p>
              <p className="text-gray-600">Category: {subjectCategory}</p>
            </div>
          </div>

          <hr className="my-6" />

          {/* Order Summary */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Application Fee</span>
                <span className="font-semibold">${applicationFees}</span>
              </div>
              {Number(applicationFees) > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Payment Processing</span>
                  <span>Stripe Secure</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Total Amount</span>
                <span className="text-xl font-bold">${applicationFees}</span>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Applicant Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{user?.displayName || "Not provided"}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{user?.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Application ID:</span>
                <span className="ml-2 font-medium">{id?.substring(0, 8)}...</span>
              </div>
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              label={processing ? "Processing..." : (Number(applicationFees) === 0 ? "Apply Now (Free)" : `Pay $${applicationFees}`)}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-white font-semibold rounded-lg flex-1 max-w-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePayment}
              disabled={processing}
            />
            <Button
              label="Cancel"
              className="bg-gray-500 hover:bg-gray-600 px-8 py-3 text-white font-semibold rounded-lg"
              onClick={() => navigate(-1)}
              disabled={processing}
            />
          </div>

          {/* Help Text */}
          {Number(applicationFees) === 0 ? (
            <p className="text-center text-green-600 mt-4">
              This scholarship has no application fee. Click "Apply Now" to submit your application.
            </p>
          ) : (
            <p className="text-center text-gray-500 text-sm mt-4">
              You will be redirected to Stripe for secure payment processing.
            </p>
          )}

          {/* Important Notes */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your application will be reviewed after payment confirmation</li>
              <li>• You can track your application status in "My Applications"</li>
              <li>• Application fees are non-refundable once processed</li>
              {Number(applicationFees) === 0 && (
                <li>• Free applications are automatically submitted for review</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PaymentCheckout;