import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import DetailsComponent from "@/components/charts/Encounters/SOAP/DetailsComponent";
import TabMenu from "@/components/charts/Encounters/SOAP/TabMenu";
import ChartNotesTabBody from "@/components/charts/Encounters/SOAP/ChartNotesTabBody";
import MUBody from "@/components/charts/Encounters/MU/MUBody";
import {
  PatientPhysicalStats,
  UserEncounterData,
} from "@/types/chartsInterface";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useState } from "react";

const SOAPSection = ({
  encounterId,
  patientDetails,
  onClose,
  onRefresh,
}: {
  encounterId: string;
  patientDetails: UserEncounterData;
  onClose: () => void;
  onRefresh: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [signed, setSigned] = useState<boolean>(false);
  const [subjectiveContent, setSubjectiveContent] = useState<string>("");
  const [objectiveContent, setObjectiveContent] = useState<string>("");
  const [physicalStatsContent, setPhysicalStatsContent] =
    useState<PatientPhysicalStats>({
      height: 0,
      weight: 0,
    });

  return (
    <div className="flex flex-col gap-3 ml-2 bg-white w-full shadow-lg">
      <Button
        variant={"outline"}
        onClick={onClose}
        className="absolute top-2 right-2 px-2"
      >
        <Icon name="close" />
      </Button>
      <DetailsComponent patientDetails={patientDetails} />
      <Tabs defaultValue="chartNotes" className="w-full px-4 py-1">
        <div className="flex flex-row justify-between">
          <TabsList>
            <CustomTabsTrigger value="chartNotes">
              Chart Notes
            </CustomTabsTrigger>
            <CustomTabsTrigger value="mu">MU</CustomTabsTrigger>
          </TabsList>
          <TabMenu
            patientDetails={patientDetails}
            encounterId={encounterId}
            subjectiveContent={subjectiveContent}
            objectiveContent={objectiveContent}
            physicalStatsContent={physicalStatsContent}
            onRefresh={onRefresh}
            setSigned={setSigned}
          />
        </div>
        <TabsContent value="chartNotes">
          <ChartNotesTabBody
            encounterId={encounterId}
            patientDetails={patientDetails}
            setSubjectiveContent={setSubjectiveContent}
            setObjectiveContent={setObjectiveContent}
            setPhysicalStatsContent={setPhysicalStatsContent}
            signed={signed}
          />
        </TabsContent>
        <TabsContent value="mu">
          <MUBody />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SOAPSection;
