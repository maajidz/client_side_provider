"use client";

import { basicInformationSchema } from "@/schema/addNewPatientSchema";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

const EditBasicInformation = ({
  patientDetails,
  setEditPatient,
}: {
  patientDetails: PatientDetails;
  setEditPatient: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const methods = useForm({
    resolver: zodResolver(basicInformationSchema),
    defaultValues: {
      patientDetails,
      firstName: patientDetails.user.firstName || "",
      lastName: patientDetails.user.lastName || "",
      dob: patientDetails.dob ? new Date(patientDetails.dob).toISOString().split("T")[0] : "",
      gender: patientDetails.gender || "",
    },
  });

  useEffect(() => {
    if (patientDetails) {
      methods.reset({
        patientDetails,
        firstName: patientDetails.user.firstName,
        lastName: patientDetails.user.lastName,
        dob: patientDetails.dob ? new Date(patientDetails.dob).toISOString().split("T")[0] : "",
        gender: patientDetails.gender,
      });
    }
  }, [patientDetails, methods]);

  const onSubmit = async (data: z.infer<typeof basicInformationSchema>) => {
    setLoading(true);

    if (patientDetails) {
      const requestData: CreateUser = {
        user: {
          email: patientDetails.user.email ? patientDetails.user.email : "",
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: patientDetails.user.phoneNumber
            ? patientDetails.user.phoneNumber
            : "",
        },
        userDetails: {
          dob: data.dob,
          height: patientDetails.height,
          heightType: patientDetails.heightType,
          weight: patientDetails.weight,
          weightType: patientDetails.weightType,
          location: patientDetails.location,
          gender: data.gender,
        },
      };

      try {
        if (patientDetails.user.id) {
          const response = await updateExistingPatient({
            requestData,
            userId: patientDetails.user.id,
          });
          if (response) {
            showToast({
              toast,
              type: "success",
              message: `Patient updated successfully`,
            });
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        showToast({
          toast,
          type: "error",
          message: `Error while updating Patient`,
        });
      } finally {
        setLoading(false);
        methods.reset();
        setEditPatient(false);
      }
    }
  };

  if (loading) {
    return <LoadingButton />;
  }
  return (
    <div className="flex border-gray-100 border group p-6 py-4 flex-1 rounded-lg">
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex gap-6 flex-col"
        >
          <FormSectionVert>
            <div className="font-semibold text-xs text-gray-600">Basic Information</div>
            <FormSectionHor>
              <FormField
                control={methods.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
              </FormSectionHor>
              <FormSectionHor>
              <FormField
                control={methods.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
                    <FormLabel className="w-full">Birth Gender:</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: string) => field.onChange(value)}
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
            </FormSectionHor>
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

export default EditBasicInformation;
