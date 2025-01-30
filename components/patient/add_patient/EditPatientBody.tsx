"use client";

import { addNewPatientSchema } from "@/schema/addNewPatientSchema";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import SubmitButton from "@/components/custom_buttons/SubmitButton";
import { CreateUser, PatientDetails } from "@/types/userInterface";
import { createNewPatient } from "@/services/userServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/components/ui/use-toast";
import PatientConfirmationScreen from "./PatientConfirmationScreen";

const EditPatientBody = ({
  patientDetails,
}: {
  patientDetails: PatientDetails;
}) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const { toast } = useToast();

  const methods = useForm({
    resolver: zodResolver(addNewPatientSchema),
    defaultValues: {
      patientDetails,
      firstName: patientDetails.user.firstName || "",
      lastName: patientDetails.user.lastName || "",
      height: { unit: "cm", value: "" } as z.infer<
        typeof addNewPatientSchema.shape.height
      >,
      weight: { units: "kg", value: "" } as z.infer<
        typeof addNewPatientSchema.shape.weight
      >,
      phoneNumber: patientDetails.user.phoneNumber || "",
      dob: patientDetails.dob || String(new Date()),
      state: patientDetails.location || "",
      gender: patientDetails.gender || "",
      email: patientDetails.user.email || "",
    },
  });

  useEffect(() => {
    if (patientDetails) {
      methods.reset({
        patientDetails,
        firstName: patientDetails.user.firstName,
        lastName: patientDetails.user.lastName,
        phoneNumber: patientDetails.user.phoneNumber,
        dob: patientDetails.dob,
        state: patientDetails.location,
        gender: patientDetails.gender,
        email: patientDetails.user.email,
      });
      if (patientDetails.heightType === "cm") {
        methods.setValue("height.unit", patientDetails.heightType as "feet" | "cm");
        methods.setValue("height.value", patientDetails.height.toString());
      } else {
        methods.setValue("height.unit", patientDetails.heightType as "feet" | "cm");
        methods.setValue("height.feet", patientDetails.height.toString());
      }
      if(patientDetails.weightType === "kg"){
        methods.setValue("weight.value", patientDetails.weight.toString())
      }
    }
  }, [patientDetails, methods]);

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
          <div className="flex flex-col gap-5">
            <div className="flex justify-end">
              <SubmitButton label="Edit" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-5 border p-5 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Basic Information
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={methods.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">First Name:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="First Name"
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
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
                  <FormField
                    control={methods.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="w-full">DOB:</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="text-center  justify-center "
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
                      <FormItem className="flex items-center">
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
              <div className="flex flex-col gap-5 border p-5 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Contact Details
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={methods.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
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
                      <FormItem className="flex items-center">
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
                      <FormItem className="flex items-center">
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
              <div className="flex flex-col gap-5 border p-5 w-full rounded-lg">
                <div className="font-medium text-[#84012A]">
                  Other Information
                </div>
                <div className="flex flex-col gap-3">
                  <div className="text-sm font-medium">Height:</div>
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
                                  placeholder="cm"
                                  value={field.value}
                                  maxLength={2}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className="font-normal text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    {heightUnit === "feet" && (
                      <div className="flex gap-3">
                        <FormField
                          control={methods.control}
                          name="height.feet"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Feet"
                                  value={field.value}
                                  maxLength={2}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className="font-normal text-base"
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
                                  placeholder="Inches"
                                  value={field.value}
                                  maxLength={2}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className="font-normal text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <div className="md:w-[256px] lg:w-[256px] md:px-3 lg:px-3 px-1">
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
                  <div className="text-sm font-medium">Weight:</div>
                  <div className="flex  gap-2">
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
                              className="font-normal text-base"
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

export default EditPatientBody;
