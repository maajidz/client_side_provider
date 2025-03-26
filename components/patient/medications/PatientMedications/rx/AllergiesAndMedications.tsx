import LoadingButton from "@/components/LoadingButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getAllergiesData,
  getSupplements,
} from "@/services/chartDetailsServices";
import { format } from "date-fns"; // Import format from date-fns
import { getUserPrescriptionsData } from "@/services/prescriptionsServices";
import { AllergenResponseInterfae } from "@/types/allergyInterface";
import { PrescriptionDataInterface } from "@/types/prescriptionInterface";
import { SupplementInterfaceResponse } from "@/types/supplementsInterface";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

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

  const [supplementsData, setSupplementsData] = useState<SupplementInterfaceResponse[]>(
    []
  );

  // Loading State
  const [loading, setLoading] = useState<boolean>(false);

  // Error State
  const [error, setError] = useState<string>("");

  // Severity to Badge Variant Mapping
  const severityBadgeMap: Record<string, string> = {
    mild: "text-gray-900/70",
    moderate: "text-yellow-900/70",
    severe: "text-red-900/70",
  };

  // Status to Badge Variant Mapping
  const statusBadgeMap: Record<string, "success" | "default"> = {
    active: "success",
    inactive: "default",
  };

  // Fetch Allergies
  const fetchAllergies = useCallback(async () => {
    try {
      setLoading(true);
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
    try {
      setLoading(true);
      const response = await getUserPrescriptionsData({
        limit: 10,
        page: 1,
        userDetailsId,
      });
      if (response) {
        const filteredData = response.data.filter(
          (prescription: PrescriptionDataInterface | null) =>
            prescription !== null
        );
        setUserPrescriptions(filteredData);
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
    try {
      setLoading(true);
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

  // Sort allergies, prescriptions, and supplements by active status
  const sortedAllergies = allergies.sort((a, b) => 
    a.status.toLowerCase() === "active" ? -1 : b.status.toLowerCase() === "active" ? 1 : 0
  );

  const sortedPrescriptions = userPrescriptions.sort((a, b) => 
    a.status.toLowerCase() === "completed" ? -1 : b.status.toLowerCase() === "completed" ? 1 : 0
  );

  const sortedSupplements = supplementsData.sort((a, b) => 
    a.status.toLowerCase() === "active" ? -1 : b.status.toLowerCase() === "active" ? 1 : 0
  );

  return (
    <ScrollArea className="flex min-h-0">
      <div className="flex flex-col gap-6 p-2">
        <div className="flex flex-col gap-3">
          <div className="text-md font-semibold">Allergies</div>
          <div className="flex gap-2 flex-wrap">
            {sortedAllergies.length > 0 ? (
              sortedAllergies.map((allergy) => (
                <Card
                  key={allergy.id}
                  className={`${allergy.status.toLowerCase() === "inactive" ? "opacity-60" : ""} w-full sm:w-1/2 md:w-1/3 lg:w-1/4`}
                >
                  <CardTitle className="font-medium gap-2 justify-between w-full">
                    {allergy.allergen}
                    <Badge variant={statusBadgeMap[allergy.status.toLowerCase() as keyof typeof statusBadgeMap]} showIndicator>
                      {allergy.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-1">
                    <div className={`${severityBadgeMap[allergy.severity.toLowerCase() as keyof typeof severityBadgeMap]} font-bold uppercase tracking-wider text-xs`}>
                      {allergy.severity}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{allergy.reactions.map((reaction) => reaction.name).join(", ")}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">{format(new Date(allergy.observedOn), "do MMMM, yyyy")}</span>
                    </div>
                  </CardDescription>
                </Card>
              ))
            ) : (
              <p className="text-center text-xs text-gray-500">No recorded allergies</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-md font-semibold">Prescriptions</div>
          <div className="flex flex-row gap-3 flex-wrap">
            {sortedPrescriptions.length > 0 ? (
              sortedPrescriptions.map((prescription) => (
                <Card
                  key={prescription.id}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                >
                  <CardTitle className="font-medium gap-2 justify-between w-full">
                    {prescription.drug_name}
                    <Badge variant={statusBadgeMap[prescription.status.toLowerCase() as keyof typeof statusBadgeMap]}>
                      {prescription.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-1 font-medium">
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
                  </CardDescription>
                </Card>
              ))
            ) : (
              <p className="text-center">No active prescriptions</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-md font-semibold">Supplements</div>
          <div className="flex flex-row gap-3">
            {sortedSupplements.length > 0 ? (
              sortedSupplements.map((supplement) => (
                <Card
                  key={supplement.id}
                  className="flex-1"
                >
                  <CardTitle className="font-medium gap-2 justify-between w-full">
                    {supplement.type.supplement_name || "Supplement 1"}
                    <Badge variant={statusBadgeMap[supplement.status.toLowerCase() as keyof typeof statusBadgeMap]} showIndicator>
                      {supplement.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-1 font-medium">
                    <div>
                      Dosage: {supplement.dosage} {supplement.unit}
                    </div>
                    <div>Intake type: {supplement.intake_type}</div>
                    <div>Frequency: {supplement.frequency}</div>
                  </CardDescription>
                </Card>
              ))
            ) : (
              <p className="text-center">No active supplements</p>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AllergiesAndMedications;
