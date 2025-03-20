import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserChart, UserEncounterData } from "@/types/chartsInterface";
import React from "react";

const ChartNotes = ({
  patientDetails,
}: {
  patientDetails?: UserEncounterData;
  patientChart?: UserChart;
}) => {
  return (
    <ScrollArea className={cn("min-h-0 flex-grow")}>
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-3 border-b">
          <CardTitle className="text-md gap-2 items-center border-b border-gray-100 pb-3 w-full">
            <Icon name="clinical_notes" />
            Subjective
          </CardTitle>
          <div className="flex flex-col gap-2">
            <CardDescription className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <ChartSubLabel label="Chief Complaints" />
                <CardDescription className="flex flex-col gap-2">
                  {patientDetails?.chart?.subjective ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: patientDetails?.chart?.subjective,
                      }}
                    />
                  ) : (
                    "N/A"
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                <ChartSubLabel label="History of Present Illness" />
                <CardDescription className="flex flex-col gap-2">
                  {patientDetails?.userDetails?.history_of_present_illness?.map(
                    (data) => (
                      <div
                        key={data.id}
                        dangerouslySetInnerHTML={{
                          __html: data.content,
                        }}
                      />
                    )
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                <ChartSubLabel label="Past Medical History" />
                <CardDescription className="flex flex-col gap-2">
                  {patientDetails?.userDetails?.medication_history?.map(
                    (data) => (
                      <div
                        key={data.id}
                        dangerouslySetInnerHTML={{
                          __html: data.notes,
                        }}
                      />
                    )
                  )}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                <CardDescription className="flex flex-col gap-2">
                  {patientDetails?.userDetails?.active_medications &&
                  patientDetails.userDetails.active_medications.length > 0 ? (
                    <>
                    <ChartSubLabel label={`Active Medications (${patientDetails?.userDetails?.active_medications?.length})`} />
                      {patientDetails.userDetails.active_medications.map((data) => (
                        <div className="flex flex-col gap-1" key={data.id}>
                          <div>
                            {data.medicationName.productName} {data.medicationName.strength} {data.medicationName.route} {data.medicationName.doseForm}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <ChartSubLabel label="Active Medications" />
                      <p>No active medications available.</p>
                    </>
                  )}
                </CardDescription>
              </div>
            </CardDescription>
          </div>
        </Card>
        <Card className="flex flex-col gap-3 border-b">
          <CardTitle className="text-md gap-2 items-center border-b border-gray-100 pb-3 w-full">
            <Icon name="chart_data" />
            Objective
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <ChartSubLabel label="Health Vitals" />
            <div>
              {patientDetails?.chart?.objective
                ? patientDetails?.chart?.objective
                : "No Objective Available"}
            </div>
          </CardDescription>
        </Card>
        <Card className="flex flex-col gap-3 border-b">
          <CardTitle className="text-md gap-2 items-center border-b border-gray-100 pb-3 w-full">
            <Icon name="conditions" />
            Assessment
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <ChartSubLabel label="Diagnoses" />
            <div>
              {patientDetails?.chart?.assessment
                ? patientDetails?.chart?.assessment
                : "No Assessment Available"}
            </div>
          </CardDescription>
        </Card>
        <Card className="flex flex-col gap-3 border-b">
          <CardTitle className="text-md gap-2 items-center border-b border-gray-100 pb-3 w-full">
            <Icon name="digital_wellbeing" />
            Plan
          </CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <ChartSubLabel label="Diet Recommendations" />
            <ChartSubLabel label="Instructions" />
            <div>
              {patientDetails?.chart?.plan
                ? patientDetails?.chart?.plan
                : "No Plan Available"}
            </div>
          </CardDescription>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default ChartNotes;

// const ChartLabel = ({ label }: { label: string }) => (
//   <div className="font-semibold text-md underline">{label}</div>
// );

const ChartSubLabel = ({ label }: { label: string }) => (
  <div className="font-semibold text-gray-700 text-sm">{label}</div>
);
