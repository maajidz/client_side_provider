import { useForm, useFieldArray, Control, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { providerAvailabilityRequest } from '@/services/availabilityServices';
import { appointmentDateSchema, FormSchema } from '@/schema/availabilitySchema';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

const AppointmentForm = () => {
  const router = useRouter();
  const methods = useForm<FormSchema>({
    resolver: zodResolver(appointmentDateSchema),
    defaultValues: {
      appointmentDate: new Date(),
      timeSlot: [
        {
          startTime: '',
          endTime: '',
        },
      ],
    },
  });
  const [isTimeSlotVisible, setIsTimeSlotVisible] = useState(false);
  const [date, setDate] = React.useState<Date>();
  const providerID = useSelector((state: RootState) => state.login.providerId);

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'timeSlot',
  });

  useEffect(() => {
    if (date) {
      setIsTimeSlotVisible(true);
    }
  }, [date]);

  const onSubmit = async(data: FormSchema) => {
    const formValues = methods.getValues()
    const formattedDate = format(formValues.appointmentDate, 'yyyy-MM-dd');
    console.log(data);
    const requestData = {
      availabilities: [
        {
          date: formattedDate,
          providerId: providerID,
          slots: formValues.timeSlot
        }
      ]
    }
    console.log(requestData)
    try{
      const request = await providerAvailabilityRequest({requestData: requestData});
      console.log("Success:", request);
      if(request){
        router.push('/dashboard/calendar')
      }
    } catch (error) {
      console.log("Failed to submit form:", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-6 py-8 border-b">
        <div className="flex flex-row justify-between">
          <p className="text-[#84012A] font-medium text-[18px]">
            Configure the regular working hours of Fahd Kazi at Pomegranate Health.
          </p>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-3'>
              <div className={`text-sm font-normal text-[#444444] flex ${isTimeSlotVisible ? "flex-row gap-3 items-center" : "flex-col gap-8"} `}>
                {!isTimeSlotVisible ? <CalendarView
                  control={methods.control}
                  selectedDate={date}
                  onDateChange={setDate}
                /> :
                  <div className='flex flex-col gap-3'>
                    <label>Availability Date:</label>
                    <CalendarField
                      control={methods.control}
                      date={date}
                      setDate={setDate}
                    />
                  </div>
                }
              </div>
              {isTimeSlotVisible && <div className='flex flex-col gap-3'>
                <div>
                  <div className=' flex flex-col gap-3 text-sm font-normal text-[#444444]'>
                    <label>Time Slot:</label>
                    {fields.map((field, index) => (
                      <div key={field.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <Input
                          type="time"
                          className='w-fit'
                          {...methods.register(`timeSlot.${index}.startTime` as const)}
                          placeholder="HH:MM"
                        />
                        <Input
                          type="time"
                          className='w-fit'
                          {...methods.register(`timeSlot.${index}.endTime` as const)}
                          placeholder="End Time"
                        />
                        <Button type="button" className='bg-[#84012A]' onClick={() => remove(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    className='bg-[#84012A]'
                    onClick={() =>
                      append({ startTime: '', endTime: '' }) // Adds a new empty time slot
                    }
                  >
                    Add Time Slot
                  </Button>
                </div>
                <Button className='bg-[#84012A]' type="submit">Submit</Button>
              </div>
              }
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

const CalendarView = ({ selectedDate, onDateChange, control, }: {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  control: Control<FormSchema>;
}) => {

  const todayClass = "w-full bg-[#84012A] text-[#84012A] ";
  const selectedClass = "w-full bg-[#84012A] text-white rounded-2xl hover:bg-[#84012A] hover:text-white";
  const defaultClass = "w-full bg-white text-black";

  const isToday = (date: Date | undefined) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
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
          <FormItem>
            <FormControl>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(newDate) => {
                  field.onChange(newDate);
                  onDateChange(newDate)
                }}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="h-[270px] w-full rounded-2xl bg-white border"
                classNames={{
                  day_today: isToday(selectedDate) ? todayClass : defaultClass,
                  day_selected: isSelected(selectedDate) ? selectedClass : defaultClass,
                  month: "w-full font-semibold text-[#344054]",
                  head_row: "w-full",
                  row: "w-full",
                }}
              />
            </FormControl>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )} />
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
                        "w-[240px] pl-3 text-left font-normal",
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
                      date > new Date("2025-01-01")
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
