"use client";

import {
  patientContactSchema,
} from "@/schema/addNewPatientSchema";
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
  FormSectionHor,
  FormSectionVert,
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
import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { CreateUser, PatientDetails } from "@/types/userInterface";
import { updateExistingPatient } from "@/services/userServices";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { US_STATES } from "@/constants/data";

const EditContactDetails = ({
  patientDetails,
  setEditPatient,
}: {
  patientDetails: PatientDetails;
  setEditPatient: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");

  const { toast } = useToast();

  const methods = useForm({
    resolver: zodResolver(patientContactSchema),
    defaultValues: {
      patientDetails,
      height: { unit: "cm", value: "" } as z.infer<
        typeof patientContactSchema.shape.height
      >,
      weight: { units: "kg", value: "" } as z.infer<
        typeof patientContactSchema.shape.weight
      >,
      phoneNumber: patientDetails.user.phoneNumber || "",
      state: patientDetails.location || "",
      gender: patientDetails.gender || "",
      email: patientDetails.user.email || "",
    },
  });

  useEffect(() => {
    if (patientDetails) {
      methods.reset({
        patientDetails,
        phoneNumber: patientDetails.user.phoneNumber,
        state: patientDetails.location,
        gender: patientDetails.gender,
        email: patientDetails.user.email,
      });
      if (patientDetails.heightType === "cm") {
        methods.setValue(
          "height.unit",
          patientDetails.heightType as "feet" | "cm"
        );
        methods.setValue("height.value", patientDetails.height.toString());
      } else {
        methods.setValue(
          "height.unit",
          patientDetails.heightType as "feet" | "cm"
        );
        methods.setValue("height.feet", patientDetails.height.toString());
      }
      if (patientDetails.weightType === "kg") {
        methods.setValue("weight.value", patientDetails.weight.toString());
      }
    }
  }, [patientDetails, methods]);

  const onSubmit = async (data: z.infer<typeof patientContactSchema>) => {
    setLoading(true);

    const requestData: CreateUser = {
      user: {
        email: data.email,
        firstName: patientDetails.user.firstName
          ? patientDetails.user.firstName
          : "",
        lastName: patientDetails.user.lastName
          ? patientDetails.user.lastName
          : "",
        phoneNumber: data.phoneNumber,
      },
      userDetails: {
        dob: patientDetails.dob ? patientDetails.dob : "",
        height:
          data.height.unit === "cm"
            ? Number(data.height.value)
            : Number(data.height.feet),
        heightType: data.height.unit,
        weight: Number(data.weight.value),
        weightType: data.weight.units,
        location: data.state,
        gender: patientDetails.gender ? patientDetails.gender : "",
      },
    };

    try {
      const response = await updateExistingPatient({
        requestData,
        userId: patientDetails.id,
      });
      if (response) {
        showToast({
          toast,
          type: "success",
          message: `Patient added successfully`,
        });
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

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="border-gray-100 border group p-6 py-4 flex-1 rounded-lg">
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex gap-6 flex-col"
        >
          <FormSectionVert>
            <FormSectionHor>
              <FormField
                control={methods.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">State:</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: string) => field.onChange(value)}
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
                            className="p-2 w-full -b -gray-300"
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
                  <FormItem>
                    <FormLabel className="w-full">Phone Number:</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contact Number"
                        inputMode="tel"
                        value={field.value}
                        onChange={(e) => field.onChange(e.currentTarget.value)}
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
                  <FormItem>
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
            </FormSectionHor>
          </FormSectionVert>
          <FormSectionVert>
            {/* <div className="font-bold text-sm text-gray-500">Other Information</div> */}
            <div className="flex gap-4 items-end">
              <div className="flex flex-row items-end gap-2">
                {heightUnit === "cm" && (
                  <FormField
                    control={methods.control}
                    name="height.value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height:</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            inputMode="numeric"
                            placeholder="cm"
                            value={field.value}
                            maxLength={2}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="font-normal text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {heightUnit === "feet" && (
                  <div className="flex flex-row">
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
                      name="height.inches"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Inches"
                              value={field.value}
                              maxLength={2}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="font-normal text-base"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
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
              <div className="flex gap-2 items-end">
                <FormField
                  control={methods.control}
                  name="weight.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight:</FormLabel>
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
          </FormSectionVert>

          <div className="flex self-end gap-5">
            <Button variant={"outline"} onClick={() => setEditPatient(false)}>
              Cancel
            </Button>
            <SubmitButton label="Update" />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditContactDetails;
