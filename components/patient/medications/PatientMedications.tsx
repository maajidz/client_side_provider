import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import PatientMedication from "./PatientMedications/PatientMedication";
import PatientSupplements from "./PatientSupplements/PatientSupplements";
import QuickRx from "./PatientMedications/rx/QuickRx";
import { X } from "lucide-react";
import { useState } from "react";

const patientMedicationsTabs = [
  {
    value: "medications",
    label: "Medications",
    component: PatientMedication,
  },
  {
    value: "supplements",
    label: "Supplements",
    component: PatientSupplements,
  },
];

const PatientMedications = ({ userDetailsId }: { userDetailsId: string }) => {
  // Quick Rx Tab State
  const [quickRxVisible, setQuickRxVisible] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("medications");

  const tabs = quickRxVisible
    ? [
        ...patientMedicationsTabs,
        {
          value: "quickRx",
          label: (
            <div className="flex items-center gap-2">
              <X
                height={16}
                onClick={() => {
                  setActiveTab("medications");
                  setQuickRxVisible(false);
                }}
              />
              Quick Rx
            </div>
          ),
          component: QuickRx,
        },
      ]
    : patientMedicationsTabs;

  return (
    <>
      <Tabs
        defaultValue="medications"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <CustomTabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </CustomTabsTrigger>
          ))}
        </TabsList>
        {tabs.map(({ value, component: Component }) => (
          <TabsContent value={value} key={value}>
            <Component
              userDetailsId={userDetailsId}
              onSetQuickRxVisible={() => {
                setQuickRxVisible(true);
                setActiveTab("quickRx");
              }}
            />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default PatientMedications;
