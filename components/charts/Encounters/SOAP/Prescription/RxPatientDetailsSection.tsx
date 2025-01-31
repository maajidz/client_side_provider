import LoadingButton from "@/components/LoadingButton";
import { fetchUserInfo } from "@/services/userServices";
import { RootState } from "@/store/store";
import { PatientDetails } from "@/types/userInterface";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface RxPatientDetailsSectionProps {
  userDetailsId: string;
}

const RxPatientDetailsSection = ({
  userDetailsId,
}: RxPatientDetailsSectionProps) => {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  const [patientDetails, setPatientDetails] = useState<PatientDetails>();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAndSetResponse = async () => {
      setLoading(true);
      setError("");

      try {
        const userData = await fetchUserInfo({ userDetailsId });

        if (isMounted) {
          if (userData?.userDetails?.user) {
            setPatientDetails(userData.userDetails);
          } else {
            setError("Could not fetch details for this user");
          }
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            setError("Failed to load patient details. Please try again.");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAndSetResponse();

    return () => {
      isMounted = false;
    };
  }, [userDetailsId]);

  if (loading) return <LoadingButton />;

  return (
    <div className="flex gap-6 p-4 border rounded-lg bg-white shadow-md">
      {/* Patient Details */}
      <div className="flex flex-col border-r pr-6">
        <div className="text-lg font-semibold mb-2">Patient Information</div>
        {error ? (
          <p className="text-center">{error}</p>
        ) : (
          <>
            <div className="capitalize text-gray-800">
              <span className="font-semibold">Name:</span>{" "}
              {patientDetails?.user.firstName} {patientDetails?.user.lastName}
            </div>
            <div>
              <span className="font-semibold">Patient ID:</span>{" "}
              {patientDetails?.user.id}
            </div>

            <div className="flex gap-4 text-gray-600">
              <div>
                <span className="font-semibold">Gender:</span>{" "}
                {patientDetails?.gender}
              </div>
              <div>
                <span className="font-semibold">DOB: </span>
                {patientDetails?.dob
                  ? new Date(patientDetails.dob).toLocaleDateString("en-UK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>
            <div>
              <span className="font-semibold">Address:</span>{" "}
              {patientDetails?.location}
            </div>
            <div>
              <span className="font-semibold">Phone No:</span>{" "}
              {patientDetails?.user.phoneNumber}
            </div>
            <div>
              <span className="font-semibold">Cell:</span>{" "}
              {patientDetails?.user.phoneNumber}
            </div>
            <div>
              <span className="font-semibold">Vitals:</span>{" "}
              {patientDetails?.weight} lbs
            </div>
          </>
        )}
      </div>

      {/* Provider Details */}
      <div className="flex flex-col">
        <div className="text-lg font-semibold mb-2">Provider Information</div>
        <div className="capitalize text-gray-800">
          <span className="font-semibold">Provider Name:</span>{" "}
          {providerDetails.firstName} {providerDetails.lastName}
        </div>
        <div>
          <span className="font-semibold">Provider ID:</span>{" "}
          {providerDetails.providerId}
        </div>
        <div>
          <span className="font-semibold">Facility:</span> Join Pomegranate
        </div>
        <div>
          <span className="font-semibold">Address:</span> [Provider Address]
        </div>
        <div>
          <span className="font-semibold">Phone No:</span> [Provider Phone No]
        </div>
        <div>
          <span className="font-semibold">Fax:</span> [Provider Fax]
        </div>
      </div>
    </div>
  );
};

export default RxPatientDetailsSection;
