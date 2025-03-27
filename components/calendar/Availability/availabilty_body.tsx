import { useForm, useFieldArray, Control, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { providerAvailabilityRequest } from "@/services/availabilityServices";
import { appointmentDateSchema, FormSchema } from "@/schema/availabilitySchema";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Icon } from "@/components/ui/icon";

const AppointmentForm = () => {
  const router = useRouter();
  const methods = useForm<FormSchema>({
    resolver: zodResolver(appointmentDateSchema),
    defaultValues: {
      appointmentDate: new Date(),
      timeSlot: [
        {
          startTime: "",
          endTime: "",
        },
      ],
    },
  });
  const [isTimeSlotVisible, setIsTimeSlotVisible] = useState(false);
  const [date, setDate] = React.useState<Date>();
  const provider = useSelector((state: RootState) => state.login);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "timeSlot",
  });

  useEffect(() => {
    if (date) {
      setIsTimeSlotVisible(true);
    }
  }, [date]);

  const onSubmit = async (data: FormSchema) => {
    const formValues = methods.getValues();
    const formattedDate = format(formValues.appointmentDate, "yyyy-MM-dd");
    console.log(data);
    const requestData = {
      availabilities: [
        {
          date: formattedDate,
          providerId: provider.providerId,
          slots: formValues.timeSlot,
        },
      ],
    };
    console.log(requestData);
    try {
      const request = await providerAvailabilityRequest({
        requestData: requestData,
      });
      console.log("Success:", request);
      if (request) {
        router.push("/dashboard/provider/calendar");
      }
    } catch (error) {
      console.log("Failed to submit form:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6 py-8 border-b">
        <div className="flex flex-row justify-between">
          <h2 className="font-medium">
            Configure the regular working hours of {provider.firstName} {provider.lastName} at Pomegranate
            Health.
          </h2>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <div
                className={`text-sm font-normal text-[#444444] flex ${
                  isTimeSlotVisible
                    ? "flex-row gap-3 items-center"
                    : "flex-col gap-8"
                } `}
              >
                {!isTimeSlotVisible ? (
                  <CalendarView
                    control={methods.control}
                    selectedDate={date}
                    onDateChange={setDate}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-normal text-[#444444]">Availability Date:</span>
                    <span className="border border-gray-300 rounded-lg">
                    <CalendarField
                      control={methods.control}
                      date={date}
                      setDate={setDate}
                    />
                    </span>
                  </div>
                )}
              </div>
              {isTimeSlotVisible && (
                <div className="flex flex-col gap-3">
                  <div>
                    <div className=" flex flex-col gap-3 text-sm font-normal text-[#444444]">
                      {/* time slots */}
                      <label>Time Slot:</label>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <Input
                            type="time"
                            className="w-fit"
                            {...methods.register(
                              `timeSlot.${index}.startTime` as const
                            )}
                            placeholder="HH:MM"
                          />
                          <Input
                            type="time"
                            className="w-fit"
                            {...methods.register(
                              `timeSlot.${index}.endTime` as const
                            )}
                            placeholder="End Time"
                          />
                          <Button variant="outline" onClick={() => remove(index)} size="icon">
                            <Icon name="remove" className="text-gray-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                    variant="link"
                    className="px-0"
                      onClick={() => append({ startTime: "", endTime: "" })}
                    >
                      <Icon name="add" />
                      Add Time Slot
                    </Button>
                  </div>
                  <SubmitButton label="Submit" />
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

const CalendarView = ({
  selectedDate,
  onDateChange,
  control,
}: {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  control: Control<FormSchema>;
}) => {
  const todayClass = "w-full bg-[#84012A] text-[#84012A] ";
  const selectedClass =
    "w-full bg-[#84012A] text-white rounded-2xl hover:bg-[#84012A] hover:text-white";
  const defaultClass = "w-full bg-white text-black";

  const isToday = (date: Date | undefined) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date | undefined) => {
    return date?.getTime() === (date?.getTime() || 0);
  };

  return (
    <div>
      <FormField
        control={control}
        name="appointmentDate"
        render={({ field }) => (
          <FormItem className="w-fit border border-gray-200 rounded-2xl pt-4">
            <FormControl>
              <Calendar
                className="rounded-2xl"
                mode="single"
                selected={selectedDate}
                onSelect={(newDate) => {
                  field.onChange(newDate);
                  onDateChange(newDate);
                }}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                classNames={{
                  months: "relative pt-10",
                  nav: "absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2",
                  month_caption: "absolute -top-3.5 left-1/2 transform -translate-x-1/2",
                  day_today: isToday(selectedDate) ? todayClass : defaultClass,
                  day_selected: isSelected(selectedDate)
                    ? selectedClass
                    : defaultClass,
                  month: "font-medium text-[#344054]",
                  head_row: "",
                  row: "",
                  day: "",
                  day_button: "w-full h-full p-4 items-center justify-center hover:bg-gray-100 rounded-md",
                  today: "bg-blue-50 p-0 rounded-md",
                  selected: "bg-[#84012A] text-white rounded-2xl",
                  nav_button: "row-reverse",
                  outside: "text-gray-400",
                  disabled: "text-gray-300",
                  day_range_start: "bg-green-200",
                  day_range_end: "bg-red-200",
                  day_range_middle: "bg-yellow-200"
                }}
              />
            </FormControl>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />
    </div>
  );
};

const CalendarField = ({
  control,
  date,
  setDate,
}: {
  control: Control<FormSchema>;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) => (
  <div className="">
    <FormField
      control={control}
      name="appointmentDate"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex flex-row md:gap-2 items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      onClick={() => setDate(field.value)}
                      variant={"ghost"}
                      className={cn(
                        "w-[240px] pl-3 text-left",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {date ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      field.onChange(newDate);
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      date > new Date("2100-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormControl>
          <FormMessage className="text-[10px]" />
        </FormItem>
      )}
    />
  </div>
);

export default AppointmentForm;
