import { Heading } from "@/components/ui/heading";
import { UserEncounterData } from "@/types/chartsInterface";
import ViewOrdersList from "../../../app/dashboard/labs/lab-results/ViewOrdersList";

function LabResults({ patientDetails }: { patientDetails: UserEncounterData }) {

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Lab Results"
          description="A list of lab results of the patients"
        />
      </div>
      <ViewOrdersList patientDetails={patientDetails} />
    </>
  );
}

export default LabResults;
