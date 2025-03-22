import FormLabels from "@/components/custom_buttons/FormLabels";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { UserEncounterData } from "@/types/chartsInterface";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const DetailsComponent = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    patientDetails?.date ? new Date(patientDetails.date) : undefined
  );
  const providerDetails = useSelector((state: RootState) => state.login);
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant={"outline"}
                className="[&>span>button>span]:text-xs [&>span>button>span]:font-semibold"
              >
                {patientDetails?.visit_type}
                <Icon name="keyboard_arrow_down" className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DetailsComponent;
