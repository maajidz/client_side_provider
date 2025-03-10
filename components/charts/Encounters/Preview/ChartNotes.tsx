import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserChart } from "@/types/chartsInterface";
import React from "react";

const ChartNotes = ({ patientChart }: { patientChart: UserChart }) => {
  return (
    <ScrollArea className={cn("min-h-0 flex-grow")}>
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-3 border-b">
          <CardTitle className="text-md gap-2 items-center border-b border-gray-100 pb-3 w-full"><Icon name="clinical_notes"/>Subjective</CardTitle>
          <div className="flex flex-col gap-2">
            <CardDescription className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <ChartSubLabel label="Chief Complaints" />
                <CardDescription className="flex flex-col gap-2">
                  Weight is 123.75 lbs 0 ozs. Height is 61 ft 0 inches. BMI is 0. The starting weight is 65 and the goal Weight is 56
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                <ChartSubLabel label="History of Present Illness" />
                <CardDescription className="flex flex-col gap-2">
                  Weight is 123.75 lbs 0 ozs. Height is 61 ft 0 inches. BMI is 0. The starting weight is 65 and the goal Weight is 56
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                <ChartSubLabel label="Past Medical History" />
                <CardDescription className="flex flex-col gap-2">
                  Weight is 123.75 lbs 0 ozs. Height is 61 ft 0 inches. BMI is 0. The starting weight is 65 and the goal Weight is 56
                </CardDescription>
              </div>
              <div className="flex flex-col gap-1">
                <ChartSubLabel label="Active Medications" />
                <CardDescription className="flex flex-col gap-2">
                  Weight is 123.75 lbs 0 ozs. Height is 61 ft 0 inches. BMI is 0. The starting weight is 65 and the goal Weight is 56
                </CardDescription>
              </div>
            </CardDescription>
            <div
              dangerouslySetInnerHTML={{ __html: patientChart?.subjective }}
            />
          </div>
        </Card>
        <Card className="flex flex-col gap-3 border-b">
          <CardTitle className="text-md gap-2 items-center border-b border-gray-100 pb-3 w-full"><Icon name="chart_data" />Objective</CardTitle>
            <CardDescription className="flex flex-col gap-2">
              <ChartSubLabel label="Health Vitals" />
                <div>{patientChart?.objective}</div>
            </CardDescription>
        </Card>
        <Card className="flex flex-col gap-3 border-b">
          <CardTitle className="text-md gap-2 items-center border-b border-gray-100 pb-3 w-full"><Icon name="conditions"/>Assessment</CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <ChartSubLabel label="Diagnoses" />
            <div>{patientChart?.assessment}</div>
          </CardDescription>
        </Card>
        <Card className="flex flex-col gap-3 border-b">
          <CardTitle className="text-md gap-2 items-center border-b border-gray-100 pb-3 w-full"><Icon name="digital_wellbeing" />Plan</CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <ChartSubLabel label="Diet Recommendations" />
            <ChartSubLabel label="Instructions" />
            <div>{patientChart?.plan}</div>
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
