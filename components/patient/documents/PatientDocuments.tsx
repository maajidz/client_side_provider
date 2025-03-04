import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import ViewPatientDocuments from "./ViewPatientDocuments";
import PageContainer from "@/components/layout/page-container";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";

const PatientDocuments = ({ userDetailsId }: { userDetailsId: string }) => {
  const patientDocumentsTab = [
    // {
    //   value: "lastvisit",
    //   label: "Since Last Visit",
    //   component: ViewPatientDocuments,
    // },
    // {
    //   value: "unsigned",
    //   label: "Unsigned",
    //   component: ViewPatientDocuments,
    // },
    // {
    //   value: "6months",
    //   label: "Past 6 Months",
    //   component: ViewPatientDocuments,
    // },
    // {
    //   value: "1year",
    //   label: "Past 1 Year",
    //   component: ViewPatientDocuments,
    // },
    {
      value: "all",
      label: "All",
      component: ViewPatientDocuments,
    },
    // {
    //   value: "images",
    //   label: "Images",
    //   component: ViewPatientDocuments,
    // },
    // {
    //   value: "patient",
    //   label: "Shared by Patient",
    //   component: ViewPatientDocuments,
    // },
  ];
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-3 rounded-lg">
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2">
            {patientDocumentsTab.map((tab) => (
              <CustomTabsTrigger value={tab.value} key={tab.value}>
                {tab.label}
              </CustomTabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 p-4 rounded-lg border border-gray-300">
            {patientDocumentsTab.map(({ value, component: Component }) => (
              <TabsContent value={value} key={value}>
                {Component ? (
                  <Component userDetailsId={userDetailsId} />
                ) : (
                  value
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default PatientDocuments;
