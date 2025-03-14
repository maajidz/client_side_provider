import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserChart } from "@/types/chartsInterface";
import React from "react";

const ChartNotes = ({ patientChart }: { patientChart: UserChart }) => {
  return (
    <ScrollArea className={cn("h-[calc(80dvh-52px)]")}>
      <div className="flex flex-col gap-5 p-5">
        Chart Notes
        <div className="flex flex-col gap-3 border-b">
          <ChartLabel label="Subjective" />
          <div className="flex flex-col gap-2">
            <ChartSubLabel label="Chief Complaints" />
            {patientChart?.subjective ? (
              <div
                dangerouslySetInnerHTML={{ __html: patientChart?.subjective }}
              />
            ) : (
              <div> N/A </div>
            )}
            <ChartSubLabel label="History of Present Illness" />
            <ChartSubLabel label="Past Medical History" />
            <ChartSubLabel label="Active Medications:  " />
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b">
          <ChartLabel label="Objective" />
          <div className="flex flex-col gap-2">
            <ChartSubLabel label="Health Vitals" />
            <div>
              {patientChart?.objective ? patientChart?.objective : "N/A"}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b">
          <ChartLabel label="Assessment" />
          <div className="flex flex-col gap-2">
            <ChartSubLabel label="Diagnoses" />
            <div>
              {patientChart?.assessment ? patientChart?.assessment : "N/A"}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b">
          <ChartLabel label="Plan" />
          <div className="flex flex-col gap-2">
            <ChartSubLabel label="Diet Recommendations" />
            <ChartSubLabel label="Instructions" />
            {patientChart?.plan ? patientChart?.plan : "N/A"}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ChartNotes;

const ChartLabel = ({ label }: { label: string }) => (
  <div className="font-semibold text-xl underline">{label}</div>
);

const ChartSubLabel = ({ label }: { label: string }) => (
  <div className="font-medium text-lg">{label}</div>
);
