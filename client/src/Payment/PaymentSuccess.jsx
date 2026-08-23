import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import Container from "../components/Shared/Container";
import Heading from "../components/Shared/Heading";
import Button from "../components/Shared/Button/Button";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [applicationData, setApplicationData] = useState(null);
  const [scholarshipData, setScholarshipData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    const isFree = params.get("free") === "true";
    const scholarshipId = params.get("scholarshipId");

    if (isFree && scholarshipId) {
      // Handle free scholarship application
      // First fetch scholarship details
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/scholarships/${scholarshipId}`,
        )
        .then((res) => {
          setScholarshipData(res.data.data);
          setMessage(
            "Application submitted successfully! No payment required.",
          );
          setApplicationData({
            scholarshipName: res.data.data.scholarshipName,
            universityName: res.data.data.universityName,
            amount: 0,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching scholarship:", err);
          setMessage("Application submitted successfully!");
          setLoading(false);
        });
      return;
    }

    if (!sessionId) {
      setMessage("No payment session found");
      setLoading(false);
      return;
    }

    // Call backend to verify payment and get application data
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/payments/payment-success`, {
        sessionId,
      })
      .then((res) => {
        if (res.data.success) {
          setMessage("Payment successful! Your application has been saved.");

          // If backend returns scholarshipId, fetch scholarship details
          if (res.data.scholarshipId) {
            axios
              .get(
                `${import.meta.env.VITE_API_URL}/api/scholarships/${res.data.scholarshipId}`,
              )
              .then((scholarshipRes) => {
                setScholarshipData(scholarshipRes.data.data);
                setApplicationData({
                  scholarshipName: scholarshipRes.data.data.scholarshipName,
                  universityName: scholarshipRes.data.data.universityName,
                  amount: scholarshipRes.data.data.applicationFees || 0,
                });
              })
              .catch((err) => {
                console.error("Error fetching scholarship details:", err);
                setApplicationData({
                  scholarshipName: "Scholarship",
                  universityName: "University",
                  amount: "Unknown",
                });
              });
          }
        } else {
          setMessage("Payment not completed.");
        }
      })
      .catch((err) => {
        console.error("Payment verification error:", err);
        setMessage("Error verifying payment.");
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1000); // Give some time for data to load
      });
  }, [location]);

  if (loading) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <p className="text-lg">Verifying payment...</p>
          <div className="mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Container>
    );
  }

  // Determine which data to display
  const displayData =
    applicationData ||
    (scholarshipData
      ? {
          scholarshipName: scholarshipData.scholarshipName,
          universityName: scholarshipData.universityName,
          amount: scholarshipData.applicationFees || 0,
        }
      : null);

  return (
    <Container>
      <div className="max-w-2xl mx-auto mt-10 md:mt-20 text-center">
        <div className="mb-8">
          {message.includes("successful") ? (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          )}

          <Heading
            title={
              message.includes("successful")
                ? "Payment Successful!"
                : "Payment Status"
            }
            subtitle={message}
          />
        </div>

        {displayData && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 text-left">
            <h3 className="text-xl font-bold mb-4">Application Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Scholarship:</span>
                <span className="font-medium">
                  {displayData.scholarshipName}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-semibold">University:</span>
                <span className="font-medium">
                  {displayData.universityName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t pt-3 mt-3">
                <span className="font-bold">Amount Paid:</span>
                <span className="text-xl font-bold text-green-600">
                  ${displayData.amount}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 space-y-3">
          <Button
            label="Go to My Applications"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold"
            onClick={() => navigate("/dashboard/my-applications")}
          />
          <Button
            label="Browse More Scholarships"
            className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold"
            onClick={() => navigate("/scholarships")}
          />
          <div className="pt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PaymentSuccess;