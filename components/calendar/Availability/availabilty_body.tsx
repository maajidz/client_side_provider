// import React, { useCallback, useEffect, useState } from 'react'
// import { Separator } from '@/components/ui/separator'
// import { Heading } from '@/components/ui/heading'
// import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
// import { Calendar } from '@/components/ui/calendar';
// import { Control, FormProvider, useFieldArray, useForm } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import { CalendarIcon, PlusIcon, TrashIcon } from 'lucide-react';
// import { format } from 'date-fns';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { timeSlots } from '@/constants/data';
// import { appointmentDateSchema } from '@/schema/availabilitySchema';

// interface FormSchema {
//     appointmentDate: Date;
//     timeSlot: { startTime: string; endTime: string }[];
// }

// const AvailabilityBody = () => {
//     const methods = useForm<FormSchema>({
//         resolver: zodResolver(appointmentDateSchema),
//         defaultValues: {
//             appointmentDate: new Date(),
//             timeSlot: [
//                 {
//                     startTime: "",
//                     endTime: ""
//                 },
//             ]
//         }
//     });

//     const [isTimeSlotVisible, setIsTimeSlotVisible] = React.useState(false);
//     const [date, setDate] = React.useState<Date>();

//     const { control } = methods;
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "timeSlot", // This connects with the timeSlot field in the form
//     });

//     const addTimeSlot = useCallback(() => {
//       append({ startTime: "", endTime: "" });
//   }, [append]);

//   const removeTimeSlot = useCallback(
//     (index: number) => {
//         remove(index);
//     },
//     [remove]
// );

//     useEffect(() => {
//         if (date) {
//             setIsTimeSlotVisible(true);
//         }
//     }, [date]);

//     return (
//         <>
//             <div className="flex items-start justify-between">
//                 <Heading
//                     title={`Provider Availability`}
//                     description=""
//                 />
//             </div>
//             <Separator />
//             <div className='p-3'>
//                 <div>
//                     <div className="flex flex-col gap-8">
//                         <div>
//                             <div className="flex flex-col gap-6 py-8 border-b">
//                                 <div className="flex flex-row justify-between">
//                                     <p className="text-[#84012A] font-medium text-[18px]">
//                                         Configure the regular working hours of Fahd Kazi at Pomegranate Health.
//                                     </p>

//                                 </div>
//                                 <FormProvider {...methods}>
//                                     <form>
//                                         <div className='flex flex-col gap-3'>
//                                              <div className={`text-sm font-normal text-[#444444] flex ${isTimeSlotVisible ? "flex-row gap-3 items-center" : "flex-col gap-8"} `}>
//                                                 {!isTimeSlotVisible ? <CalendarView
//                                                     control={methods.control}
//                                                     selectedDate={date}
//                                                     onDateChange={setDate}
//                                                 /> : <CalendarField
//                                                     control={methods.control}
//                                                     date={date}
//                                                     setDate={setDate}
//                                                 />
//                                                 }
//                                             </div>
//                                             {isTimeSlotVisible && 
//                                                <div>
//                                                <div className="flex flex-col gap-3 pb-3">
//                                                    {fields.map((item, index) => (
//                                                        <TimeSlotField
//                                                            key={item.id} // Use item.id to uniquely identify each slot
//                                                            index={index}
//                                                            control={control}
//                                                            removeTimeSlot={removeTimeSlot}
//                                                        />
//                                                    ))}
//                                                </div>
//                                                {/* <Button
//                                                    variant="outline"
//                                                    className="text-[#84012A] border-[#84012A] border-2"
//                                                    onClick={addTimeSlot}
//                                                >
//                                                    <div className="flex flex-row items-center gap-1">
//                                                        <PlusIcon />
//                                                        Add Time Slot
//                                                    </div>
//                                                </Button> */}
//                                            </div>
//                                              } 
//                                         </div>
//                                     </form>
//                                 </FormProvider>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }



//   const TimeSlotField = React.memo(({ index, removeTimeSlot, control }: { index: number; removeTimeSlot: (index: number) => void; control: Control<FormSchema> }) => (
//     <div className="flex items-center gap-2">
//         <div className="flex flex-row gap-3">
//             <FormField control={control} name={`timeSlot.${index}.startTime`} render={({ field }) => (
//                 <FormItem className="flex-1">
//                     <FormControl>
//                         <Select {...field}>
//                             <SelectTrigger className="w-[180px]">
//                                 <SelectValue placeholder="From" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {timeSlots.map((slot, i) => (
//                                     <SelectItem key={i} value={slot}>
//                                         {slot}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )} />
//             <FormField control={control} name={`timeSlot.${index}.endTime`} render={({ field }) => (
//                 <FormItem className="flex-1">
//                     <FormControl>
//                         <Select {...field}>
//                             <SelectTrigger className="w-[180px]">
//                                 <SelectValue placeholder="To" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {timeSlots.map((slot, i) => (
//                                     <SelectItem key={i} value={slot}>
//                                         {slot}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </FormControl>
//                     <FormMessage />
//                 </FormItem>
//             )} />
//         </div>
//         <Button
//             variant="outline"
//             size="icon"
//             onClick={() => removeTimeSlot(index)}
//             className="border-[#84012A] border-2"
//         >
//             <TrashIcon className="text-[#84012A]" />
//         </Button>
//     </div>
// ));


// // const TimeSlotSelect = React.memo(({ control }: { control: Control<FormSchema> }) => {
// //     const [selectedSlots, setSelectedSlots] = useState<string[]>([""]);

// //     const addTimeSlot = () => {
// //         setSelectedSlots((prevSlots) => [...prevSlots, ""]);
// //     };

// //     const removeTimeSlot = (index: number) => {
// //         setSelectedSlots(selectedSlots.filter((_, i) => i !== index));
// //     };

// //     return (
// //         <div>
// //             <div className="flex flex-col gap-3 pb-3">
// //                 {selectedSlots.map((_, index) => (
// //                     <TimeSlotField
// //                         key={index}
// //                         index={index}
// //                         control={control}
// //                         removeTimeSlot={removeTimeSlot}
// //                     />
// //                 ))}
// //             </div>
// //             <Button
// //                 variant="outline"
// //                 className="text-[#84012A] border-[#84012A] border-2"
// //                 onClick={addTimeSlot}
// //             >
// //                 <div className="flex flex-row items-center gap-1">
// //                     <PlusIcon />
// //                     Add Time Slot
// //                 </div>
// //             </Button>
// //         </div>
// //     );

// // })

// // const TimeSlotField = React.memo(({ index, removeTimeSlot, control }: {
// //     index: number;
// //     removeTimeSlot: (index: number) => void;
// //     control: Control<FormSchema>
// // }) => (
// //     <div className="flex items-center gap-2">
// //         <div className='flex flex-row gap-3'>
// //             <FormField control={control} name={`timeSlot.${index}.startTime`} render={({ field }) => (
// //                 <FormItem className="flex-1">
// //                     <FormControl>
// //                         <Select  >
// //                             <SelectTrigger className="w-[180px]">
// //                                 <SelectValue placeholder="From" />
// //                             </SelectTrigger>
// //                             <SelectContent>
// //                                 {timeSlots.map((slot, index) => (
// //                                     <SelectItem key={index} value={slot}>
// //                                         {slot}
// //                                     </SelectItem>
// //                                 ))}
// //                             </SelectContent>
// //                         </Select>
// //                     </FormControl>
// //                     <FormMessage />
// //                 </FormItem>
// //             )} />
// //             <FormField control={control} name={`timeSlot.${index}.endTime`} render={({ field }) => (
// //                 <FormItem className="flex-1">
// //                     <FormControl>
// //                         <Select  >
// //                             <SelectTrigger className="w-[180px]">
// //                                 <SelectValue placeholder="To" />
// //                             </SelectTrigger>
// //                             <SelectContent>
// //                                 {timeSlots.map((slot, index) => (
// //                                     <SelectItem key={index} value={slot}>
// //                                         {slot}
// //                                     </SelectItem>
// //                                 ))}
// //                             </SelectContent>
// //                         </Select>
// //                     </FormControl>
// //                     <FormMessage />
// //                 </FormItem>
// //             )} />
// //         </div>
// //         <Button
// //             variant="outline"
// //             size="icon"
// //             onClick={() => removeTimeSlot(index)}
// //             className="border-[#84012A] border-2"
// //         >
// //             <TrashIcon className="text-[#84012A]" />
// //         </Button>
// //     </div>
// // ));


// export default AvailabilityBody

import { z } from 'zod';

export const appointmentDateSchema = z.object({
  appointmentDate: z.date(),
  timeSlot: z.array(
    z.object({
      startTime: z.string().min(1, 'Start time is required'),
      endTime: z.string().min(1, 'End time is required'),
    })
  ),
});

export type FormSchema = z.infer<typeof appointmentDateSchema>;


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

const AppointmentForm = () => {
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


  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'timeSlot',
  });

  // const addTimeSlot = () => {
  //   append({ startTime: '', endTime: '' });
  // };

  // const removeTimeSlot = (index: number) => {
  //   remove(index);
  // };

  useEffect(() => {
    if (date) {
      setIsTimeSlotVisible(true);
    }
  }, [date]);

  const onSubmit = (data: FormSchema) => {
    console.log(data);
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
                          placeholder="Start Time"
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
