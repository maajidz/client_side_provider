import React from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import FaceSheet from "./PatientDashboard/FaceSheet";
// import FlowSheet from "@/components/charts/Encounters/Preview/FlowSheet";
// import TreatmentPlan from "./PatientDashboard/TreatmentPlan";
// import HealthScreening from "./PatientDashboard/HealthScreening";
// import TimeLine from "./PatientDashboard/TimeLine";
// import TagCloud from "./PatientDashboard/TagCloud";

const patientDashboardTab = [
  {
    value: "facesheet",
    label: "Face Sheet",
    component: FaceSheet,
  },
  // {
  //   value: "flowsheet",
  //   label: "Flow Sheet",
  //   component: FlowSheet,
  // },
  // {
  //   value: "treatmentPlan",
  //   label: "Treatment Plan",
  //   component: TreatmentPlan,
  // },
  // {
  //   value: "health_screening",
  //   label: "Health Screening",
  //   component: HealthScreening,
  // },
  // { value: "timeline", label: "Timeline", component: TimeLine },
  // { value: "tag_cloud", label: "Tag Cloud", component: TagCloud },
];

const PatientDashboard = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <Tabs defaultValue="facesheet" className="">
      <TabsList className="flex gap-3 w-full">
        {patientDashboardTab.map((tab) => (
          <CustomTabsTrigger value={tab.value} key={tab.value}>
            {tab.label}
          </CustomTabsTrigger>
        ))}
      </TabsList>
      {patientDashboardTab.map(({ value, component: Component }) => (
        <TabsContent value={value} key={value}>
          {Component ? <Component userDetailsId={userDetailsId} /> : value}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PatientDashboard;
