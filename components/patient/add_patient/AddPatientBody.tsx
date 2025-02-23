"use client";

import { addNewPatientSchema } from "@/schema/addNewPatientSchema";
import React, { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { US_STATES } from "@/constants/data";
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { CreateUser } from "@/types/userInterface";
import { createNewPatient } from "@/services/userServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import PatientConfirmationScreen from "./PatientConfirmationScreen";

const AddPatientBody = () => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const { toast } = useToast();

  const methods = useForm({
    resolver: zodResolver(addNewPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      height: { unit: "cm", value: "" } as z.infer<
        typeof addNewPatientSchema.shape.height
      >,
      weight: { units: "kg", value: "" } as z.infer<
        typeof addNewPatientSchema.shape.weight
      >,
      phoneNumber: "",
      dob: String(new Date()),
      state: "",
      gender: "",
      email: "",
      // category: "",
      // blood_group: "",
      // language: "",
      // race: "",
      // ethnicity: "",
      // smoking_status: "",
      // martial_status: "",
      // employment_status: "",
      // sexual_orientation: "",
      // emergency_contact_name: "",
      // emergency_contact_number: "",
      // preferred_communication: "",
      // source: "",
      // specific_source: "",
    },
  });

  const filteredStates = useMemo(() => {
    return US_STATES.filter((state) =>
      state.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const heightUnit = useWatch({
    name: "height.unit",
    control: methods.control,
  });

  const handleUnitChange = useCallback(
    (value: string) => {
      if (value === "feet") {
        methods.setValue("height", { unit: "feet", feet: "", inches: "" });
      } else {
        methods.setValue("height", { unit: "cm", value: "" });
      }
    },
    [methods]
  );

  // useEffect(() => {
  //   setFilteredStates(
  //     US_STATES.filter((state) =>
  //       state.name.toLowerCase().includes(search.toLowerCase())
  //     )
  //   );
  // }, [search]);

  const onSubmit = async (data: z.infer<typeof addNewPatientSchema>) => {
    setLoading(true);

    const requestData: CreateUser = {
      user: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      },
      userDetails: {
        dob: data.dob,
        height:
          data.height.unit === "cm"
            ? Number(data.height.value)
            : Number(data.height.feet),
        heightType: data.height.unit,
        weight: Number(data.weight.value),
        weightType: data.weight.units,
        location: data.state,
        gender: data.gender,
      },
    };

    try {
      const response = await createNewPatient({ requestData });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: `Patient added successfully`,
        });
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast({
        toast,
        type: "error",
        message: `Error while creating Patient`,
      });
    } finally {
      setLoading(false);
      methods.reset();
    }
  };

  if (loading) {
    return <LoadingButton />;
  }
  return (
    <div>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col bg-gray-50/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-6">
              <div className="flex flex-col gap-6 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Basic Information
                </div>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={methods.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex items-center flex-col">
                        <FormLabel className="w-full">First Name:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="First Name"
                            inputMode="text"
                            {...field}
                            className="font-normal capitalize"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex items-center flex-col">
                        <FormLabel className="w-full">Last Name:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Last Name"
                            inputMode="text"
                            {...field}
                            className="font-normal text-base capitalize"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row gap-2">
                  <FormField
                    control={methods.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex items-center flex-col flex-1">
                        <FormLabel className="w-full">DOB:</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="text-left justify-center cursor-pointer "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="flex items-center flex-col flex-1">
                        <FormLabel className="w-full">Birth Gender:</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Contact Details
                </div>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={methods.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex items-center flex-col">
                        <FormLabel className="w-full">State:</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <Input
                                type="text"
                                placeholder="Search states..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="p-2 w-full border-b border-gray-300"
                                autoFocus={true}
                              />
                              {filteredStates.map((state) => (
                                <SelectItem key={state.name} value={state.name}>
                                  {state.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex items-center flex-col">
                        <FormLabel className="w-full">Phone Number:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contact Number"
                            inputMode="tel"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(e.currentTarget.value)
                            }
                            className="font-normal text-base"
                            autoFocus={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex items-center flex-col">
                        <FormLabel className="w-full">Email:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            type="email"
                            {...field}
                            className="font-normal text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-6 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Other Information
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <FormLabel className="w-full">Height:</FormLabel>
                    <div className="flex gap-1">
                      {heightUnit === "cm" && (
                        <div>
                          <FormField
                            control={methods.control}
                            name="height.value"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    inputMode="numeric"
                                    placeholder="eg 175"
                                    value={field.value}
                                    maxLength={2}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    className="font-normal text-base flex-1 flex"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      {heightUnit === "feet" && (
                        <div className="flex gap-6">
                          <FormField
                            control={methods.control}
                            name="height.feet"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="eg 5"
                                    value={field.value}
                                    maxLength={2}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    className="font-normal text-base flex-1 flex"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={methods.control}
                            name="height.inches"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="eg 11"
                                    value={field.value}
                                    maxLength={2}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    className="font-normal text-base flex-1 flex"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      <div className="">
                        <FormField
                          control={methods.control}
                          name="height.unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={(value: string) => {
                                    field.onChange(value);
                                    handleUnitChange(value);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="feet">Feet</SelectItem>
                                    <SelectItem value="cm">cm</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormLabel className="w-full">Weight:</FormLabel>
                    <div className="flex gap-2">
                      <FormField
                        control={methods.control}
                        name="weight.value"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Weight"
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="font-normal text-base flex-1"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={methods.control}
                        name="weight.units"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={(value: string) => {
                                  field.onChange(value);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="kg">Kilograms</SelectItem>
                                  <SelectItem value="Pounds">Pounds</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="flex flex-col gap-5 border p-5 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Additional Information
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={methods.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">Category:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="category"
                            inputMode="text"
                            {...field}
                            className="font-normal text-base capitalize "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="blood_group"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">Blood Group:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Blood Group"
                            inputMode="text"
                            {...field}
                            className="font-normal text-base capitalize"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">Language:</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="race"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">Race:</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="African">African</SelectItem>
                              <SelectItem value="Asian">Asian</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="smoking_status"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Smoking status:
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Current every day smoker">
                                Current every day smoker
                              </SelectItem>
                              <SelectItem value="Current some day smoker">
                                Current some day smoker
                              </SelectItem>
                              <SelectItem value="Former smoker">
                                Former smoker
                              </SelectItem>
                              <SelectItem value="Never smoker">
                                Never smoker
                              </SelectItem>
                              <SelectItem value="Smoker, current status unknown">
                                Smoker, current status unknown
                              </SelectItem>
                              <SelectItem value="Unknown if ever smoked">
                                Unknown if ever smoked
                              </SelectItem>
                              <SelectItem value="Heavy tobacco smoker">
                                Heavy tobacco smoker
                              </SelectItem>
                              <SelectItem value="Light tobacco smoker">
                                Light tobacco smoker
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="martial_status"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Martial Status:
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Married">Married</SelectItem>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="employment_status"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Employment Status:
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Employed">Employed</SelectItem>
                              <SelectItem value="Unemployed">
                                Unemployed
                              </SelectItem>
                              <SelectItem value="Full Time Student">
                                Full Time Student
                              </SelectItem>
                              <SelectItem value="Part Time Student">
                                Part Time Student
                              </SelectItem>
                              <SelectItem value="Retired">Retired</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="sexual_orientation"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Sexual Orientation:
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Homosexual">
                                Homosexual
                              </SelectItem>
                              <SelectItem value="Heterosexual">
                                Heterosexual
                              </SelectItem>
                              <SelectItem value="Bisexual">Bisexual</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 border p-5 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Emergency Contact
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={methods.control}
                    name="emergency_contact_name"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Emergency Contact Name:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Emergency Contact Name"
                            inputMode="text"
                            {...field}
                            className="font-normal text-base capitalize "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="emergency_contact_number"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Emergency Contact Number:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Emergency Contact Number"
                            inputMode="text"
                            {...field}
                            className="font-normal text-base capitalize"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 border p-5 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">Patient IDs</div>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={methods.control}
                    name="emergency_contact_name"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Emergency Contact Name:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Emergency Contact Name"
                            inputMode="text"
                            {...field}
                            className="font-normal text-base capitalize "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="emergency_contact_number"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Emergency Contact Number:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Emergency Contact Number"
                            inputMode="text"
                            {...field}
                            className="font-normal text-base capitalize"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 border p-5 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Patient Preferences
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={methods.control}
                    name="preferred_communication"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Preferred Communication:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Preferred Communication"
                            inputMode="text"
                            {...field}
                            className="font-normal text-base capitalize "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-5 border p-5 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  How did you hear about us
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={methods.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">Source:</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Family">Family</SelectItem>
                              <SelectItem value="Friend">Friend</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={methods.control}
                    name="specific_source"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">
                          Specific source:
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value: string) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger className="">
                              <SelectValue placeholder="Select here" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div> */}
            <div className="flex justify-end w-full">
                <SubmitButton label="Add" />
            </div>
            </div>
          </div>
        </form>
      </Form>
      <PatientConfirmationScreen
        onClose={() => {
          setIsDialogOpen(false);
        }}
        isOpen={isDialogOpen}
      />
    </div>
  );
};

export default AddPatientBody;
