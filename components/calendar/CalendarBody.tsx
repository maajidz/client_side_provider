"use client";

import { Heading } from "@/components/ui/heading";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import React from "react";
import { Icon } from "@/components/ui/icon";
import CalendarComponent from "@/components/calendar/CalendarComponent";
import { Tabs, TabsList } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";
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
  const [activeView, setActiveView] = useState("listView");

  const handleClick = () => {
    router.push("/dashboard/provider/calendar/availability");
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
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingButton />
      </div>
    );
  }

  const formatDateRange = () => {
    if (!date?.from) return "";
    if (!date?.to) return format(date.from, "MMM dd, yyyy");
    return `${format(date.from, "MMM dd, yyyy")} - ${format(
      date.to,
      "MMM dd, yyyy"
    )}`;
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Heading
            title="Calendar"
            description={format(new Date(), "MMMM dd, yyyy")}
          />
        </div>
        <Button onClick={handleClick}>
          <Icon name="calendar_add_on"/>
          <span>Update my availability</span>
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <Tabs
          value={activeView}
          onValueChange={setActiveView}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <CustomTabsTrigger
              value="listView">
              <Icon name="list" />
              List View
            </CustomTabsTrigger>
            <CustomTabsTrigger
              value="calendarView">
              <Icon name="calendar_month" />
              Calendar View
            </CustomTabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            onValueChange={(value) => {
              if (value === "custom") {
                setCustomRange(true);
              } else {
                setCustomRange(false);
                const days = parseInt(value);
                setDate({
                  from: new Date(),
                  to: addDays(new Date(), days),
                });
              }
            }}
          >
            <SelectTrigger className="w-fit font-medium text-xs">
              <SelectValue placeholder={formatDateRange()} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Today</SelectItem>
              <SelectItem value="1">Tomorrow</SelectItem>
              <SelectItem value="3">Next 3 days</SelectItem>
              <SelectItem value="7">Next week</SelectItem>
              <SelectItem value="14">Next 2 weeks</SelectItem>
              <SelectItem value="30">Next month</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={customRange} onOpenChange={setCustomRange}>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "p-2 rounded-md hover:bg-gray-100",
                  customRange && "bg-blue-50 text-blue-700"
                )}
                variant="outline"
              >
                <Icon name="date_range" className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate?.from && newDate?.to) {
                    setCustomRange(false);
                  }
                }}
                numberOfMonths={2}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4">
        {activeView === "listView" ? (
          <div className="space-y-4">
            {providerAppointment?.data &&
            providerAppointment.data.length > 0 ? (
              <ListViewBody
                appointments={providerAppointment.data}
                onFetch={fetchAppointments}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Icon name="event_busy" className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">No appointments found</p>
                <p className="text-sm">
                  There are no appointments scheduled for the selected date
                  range
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[600px]">
            {providerAppointment?.data && (
              <CalendarComponent appointments={providerAppointment.data} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
