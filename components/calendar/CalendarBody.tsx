"use client";

import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import React from "react";
import { PlusIcon } from "lucide-react";
import CalendarComponent from "@/components/calendar/CalendarComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListViewBody from "@/components/calendar/ListViewBody";
import { fetchProviderAppointments } from "@/services/providerAppointments";
import { ProviderAppointmentsInterface } from "@/types/appointments";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import DefaultButton from "../custom_buttons/buttons/DefaultButton";

export const CalendarBody = () => {
  const [loading, setLoading] = useState(false);
  const [providerAppointment, setProviderAppointment] =
    useState<ProviderAppointmentsInterface | null>(null);
  const router = useRouter();
  const providerID = useSelector((state: RootState) => state.login.providerId);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20),
  });
  const [customRange, setCustomRange] = useState(false);

  const handleClick = () => {
    router.push("/dashboard//provider/calendar/availability");
  };

  const fetchAppointments = useCallback(async () => {
    if (providerID && date?.from && date?.to) {
      setLoading(true);
      const startDate = format(date.from, "yyyy-MM-dd");
      const endDate = format(date.to, "yyyy-MM-dd");
      try {
        const fetchedAppointments = await fetchProviderAppointments({
          providerId: providerID,
          startDate,
          endDate,
          limit: 7,
          page: 1,
        });

        if (fetchedAppointments) {
          setProviderAppointment(fetchedAppointments);
        }
      } catch (error) {
        console.log("Error fetching Appointments:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [providerID, date?.from, date?.to]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Calendar`} description="" />
        <div>
          <DefaultButton onClick={handleClick}>
            <PlusIcon size={24} />
            <div className="hidden md:block lg:block">
              Update my availability
            </div>
          </DefaultButton>
        </div>
      </div>
      <Tabs defaultValue="listView" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listView">List View</TabsTrigger>
          <TabsTrigger value="calendarView">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="listView">
          <div className="flex flex-col gap-3 ">
            <div className={cn("grid gap-2")}>
              <Popover open={customRange} onOpenChange={setCustomRange}>
                <PopoverTrigger asChild>
                  {/* <div>
                    <Select
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setCustomRange(true);
                        } else {
                          setCustomRange(false);
                          const days = parseInt(value);
                          const newDate = addDays(new Date(), days);
                          setDate({
                            from: newDate,
                            to: addDays(newDate, days),
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                        <SelectItem value="14">In two week</SelectItem>
                        <SelectItem value="30">In a month</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {providerAppointment && (
              <ListViewBody
                appointments={providerAppointment.data}
                onFetch={fetchAppointments}
              />
            )}
          </div>
        </TabsContent>
        <TabsContent value="calendarView">
          {providerAppointment && (
            <div>
              {!loading && providerAppointment && (
                <CalendarComponent appointments={providerAppointment?.data} />
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};
