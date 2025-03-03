"use client";

import { patientContactSchema } from "@/schema/addNewPatientSchema";
import React, { useEffect, useMemo, useState } from "react";
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
      phoneNumber: patientDetails.user.phoneNumber || "",
      address: patientDetails?.location.split(",")[0] ?? "",
      city: patientDetails?.location.split(",")[1] ?? "",
      state: patientDetails?.location.split(",")[2] ?? "",
      country: patientDetails?.location.split(",")[3] ?? "",
      zipCode: patientDetails?.location.split(",")[4] ?? "",
      gender: patientDetails.gender || "",
      email: patientDetails.user.email || "",
    },
  });

  useEffect(() => {
    if (patientDetails) {
      methods.reset({
        patientDetails,
        phoneNumber: patientDetails.user.phoneNumber,
        gender: patientDetails.gender,
        email: patientDetails.user.email,
        address: patientDetails.location.split(",")[0],
        city: patientDetails.location.split(",")[1],
        state: patientDetails.location.split(",")[2],
        country: patientDetails.location.split(",")[3],
        zipCode: patientDetails.location.split(",")[4],
      });
      methods.setValue("state", patientDetails.location.split(",")[2] ?? "");
      // console.log(patientDetails.location.split(",")[2], "HEHEHEHHEH");
    }
  }, [patientDetails, methods]);

  const onSubmit = async (data: z.infer<typeof patientContactSchema>) => {
    if (patientDetails) {
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
          height: patientDetails.height,
          heightType: patientDetails.heightType,
          weight: patientDetails.weight,
          weightType: patientDetails.weightType,
          location: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipCode}`,
          gender: patientDetails.gender ? patientDetails.gender : "",
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

  const filteredStates = useMemo(() => {
    return US_STATES.filter((state) =>
      state.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

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
          <div className="font-semibold text-xs text-gray-600">Contact Details</div>
            <FormSectionHor>
              <FormField
                control={methods.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#344054] font-medium text-sm">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-full">State:</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a State">
                            {field.value || "Select a State"}
                          </SelectValue>
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#344054] font-medium text-sm">
                      City
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSectionHor>
            <FormSectionHor>

              <FormField
                control={methods.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#344054] font-medium text-sm">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#344054] font-medium text-sm">
                      Zipcode
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSectionHor>
            <FormSectionHor>
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
