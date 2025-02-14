import LoadingButton from "@/components/LoadingButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  getAllergiesData,
  getSupplements,
} from "@/services/chartDetailsServices";
import { getUserPrescriptionsData } from "@/services/prescriptionsServices";
import { AllergenResponseInterfae } from "@/types/allergyInterface";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { SupplementInterface } from "@/types/supplementsInterface";
import { useCallback, useEffect, useState } from "react";

interface AllergiesAndMedicationsProps {
  userDetailsId: string;
}

function AllergiesAndMedications({
  userDetailsId,
}: AllergiesAndMedicationsProps) {
  // Allergies State
  const [allergies, setAllergies] = useState<AllergenResponseInterfae[]>([]);

  // Prescriptions State
  const [userPrescriptions, setUserPrescriptions] = useState<
    PrescriptionDataInterface[]
  >([]);

  const [supplementsData, setSupplementsData] = useState<SupplementInterface[]>(
    []
  );

  // Loading State
  const [loading, setLoading] = useState(false);

  // Error State
  const [error, setError] = useState("");

  // Fetch Allergies
  const fetchAllergies = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllergiesData({
        limit: 10,
        page: 1,
        userDetailsId,
      });
      if (response) {
        setAllergies(response);
      }
    } catch (e) {
      if (e instanceof Error)
        setError("Something went wrong when fetching allergies");
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  // Fetch Prescriptions
  const fetchUserPrescriptions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getUserPrescriptionsData({
        limit: 10,
        page: 1,
        userDetailsId,
      });
      if (response) {
        setUserPrescriptions(response.data);
      }
    } catch (e) {
      if (e instanceof Error)
        setError("Something went wrong when fetching prescriptions");
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  // GET Supplements
  const fetchSupplements = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSupplements({ userDetailsId });

      if (response) {
        setSupplementsData(response.data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError("Something went wrong");
      } else {
        setError("Something went wrong. Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchAllergies();
    fetchUserPrescriptions();
    fetchSupplements();
  }, [fetchAllergies, fetchUserPrescriptions, fetchSupplements]);

  if (loading) {
    return <LoadingButton />;
  }

  if (error) {
    return <div className="flex justify-center items-center">{error}</div>;
  }

  return (
    <ScrollArea className="h-[18rem] min-h-10">
      <div className="flex flex-col gap-5 p-2">
        <div className="text-lg font-semibold">
          Allergies & Active Medications
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-md font-semibold">Allergies</div>
          {allergies?.length > 0 ? (
            allergies.map((allergy) => (
              <div
                key={allergy.id}
                className="flex gap-2 border p-2 rounded-lg capitalize"
              >
                <p>{allergy.Allergen}</p>
                {" / "}
                <p>{allergy.type}</p>
                {" / "}
                <p>{allergy.serverity}</p>
                {" / "}
                <p>{allergy.status}</p>
              </div>
            ))
          ) : (
            <p className="text-center">No recorded allergies</p>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="text-md font-semibold">Prescriptions</div>
          {userPrescriptions && userPrescriptions.length > 0 ? (
            userPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="flex flex-col border p-2 rounded-lg"
              >
                <div className="font-semibold">{prescription.drug_name}</div>
                <>
                  {prescription?.dosages?.map((dosage) => (
                    <div key={dosage?.id}>
                      Dosage: {dosage?.duration_quantity} {dosage.dosage_unit}{" "}
                      {dosage.route}
                    </div>
                  ))}
                </>
                <p>
                  Frequency:{" "}
                  {prescription?.dosages?.map((dosage) => dosage.frequency)}
                </p>
                <p>Days of Supply: {prescription.days_of_supply}</p>
              </div>
            ))
          ) : (
            <p className="text-center">No active prescriptions</p>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
          <div className="text-md font-semibold">Supplements</div>
          {supplementsData && supplementsData.length > 0 ? (
            supplementsData?.map((supplement) => (
              <div
                key={supplement.id}
                className="flex flex-col border p-2 rounded-lg"
              >
                <div className="font-semibold">{supplement.supplement}</div>
                <div>
                  Dosage: {supplement.dosage} {supplement.unit}
                </div>
                <div>Intake type: {supplement.intake_type}</div>
                <div>Frequency: {supplement.frequency}</div>
              </div>
            ))
          ) : (
            <p className="text-center">No active supplements</p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

export default AllergiesAndMedications;


