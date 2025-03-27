import FormLabels from "@/components/custom_buttons/FormLabels";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { updateEncounterRequest } from "@/services/chartsServices";
import { getVisitTypes } from "@/services/enumServices";
import { RootState } from "@/store/store";
import { UserEncounterData } from "@/types/chartsInterface";
import { showToast } from "@/utils/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DetailsComponent = ({
  patientDetails,
  onRefresh,
}: {
  patientDetails: UserEncounterData;
  onRefresh: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    patientDetails?.date ? new Date(patientDetails.date) : undefined
  );
  const [selectedVisitType, setSelectedVisitType] = useState<string>("");
  const [visitTypes, setVisitTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const providerDetails = useSelector((state: RootState) => state.login);

  const { toast } = useToast();

  const fetchVisitTypes = useCallback(async () => {
    try {
      setLoading(true);
      const types = await getVisitTypes();

      if (types) {
        setVisitTypes(types);
      }
    } catch (err) {
      console.log("An error occurred", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitTypes();
  }, [fetchVisitTypes]);

  const handleUpdateVisitType = useCallback(async (visit_type: string) => {
    if (!patientDetails.id) return;
    try {
      const response = await updateEncounterRequest({
        encounterId: patientDetails.id,
        requestData: {
          visit_type: visit_type,
        },
      });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: `Visit type updated successfully!`,
        });
      }
    } catch (err) {
      showToast({
        toast,
        type: "error",
        message: `Error updating visit type: ${err}`,
      });
    } finally {
      onRefresh((prev) => prev + 1);
    }
  }, [onRefresh, patientDetails.id, toast]);

  useEffect(() => {
    if (selectedVisitType) {
      handleUpdateVisitType(selectedVisitType);
    }
  }, [selectedVisitType, handleUpdateVisitType]);

  return (
    <div className="flex flex-row flex-wrap gap-6 p-5 border-b [&>div]:flex-col [&>div]:items-start">
      <FormLabels
        label="Provider"
        value={`${providerDetails.firstName} ${providerDetails.lastName}`}
      />
      <FormLabels label="Facility" value="Pomegranate" />
      <FormLabels
        label="Mode"
        value={patientDetails?.mode ? patientDetails?.mode : ""}
      />
      <div className="flex !flex-row gap-2 flex-1s [&>div]:flex-col [&>div]:items-start">
        <FormLabels
          label="Date"
          value={
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    " justify-start text-left text-xs font-semibold",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          }
        />
        <div className="flex flex-col gap-1">
          <Label>Visit Type</Label>
          <Select
            value={patientDetails?.visit_type}
            onValueChange={(value: string) => {
              setSelectedVisitType(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <>Loading...</>
              ) : (
                visitTypes.map((visit) => (
                  <SelectItem key={visit} value={visit}>
                    {visit}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DetailsComponent;
