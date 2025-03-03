"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  ProviderDetailsFormValues,
  providerDetailsSchema,
} from "@/schema/providerDetailsSchema";
import {
  sendProviderDetails,
  updateProviderDetails,
} from "@/services/registerServices";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import RadioButton from "../custom_buttons/radio_button/RadioButton";
import { RootState } from "@/store/store";
import { Separator } from "../ui/separator";
import { Heading } from "../ui/heading";
import { UpdateProviderDetails } from "@/types/providerDetailsInterface";
import { showToast } from "@/utils/utils";

interface UserDetailsFormType {
  initialData: UpdateProviderDetails | null;
}

export const UserDetailsForm: React.FC<UserDetailsFormType> = ({
  initialData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const savedProviderAuthId = useSelector(
    (state: RootState) => state.login.providerAuthId
  );
  const savedProviderId = useSelector(
    (state: RootState) => state.login.providerId
  );

  const title = initialData ? "Edit profile" : "Create profile";

  const description = initialData ? "Edit profile." : "";

  const action = initialData ? "Update" : "Create";

  const defaultValues = {
    professionalSummary: initialData?.professionalSummary || "",
    gender: initialData?.gender || "",
    roleName: initialData?.roleName || "",
    nip: initialData?.nip || "",
    licenseNumber: initialData?.licenseNumber || "",
    yearsOfExperience: initialData?.yearsOfExperience,
    address: initialData?.address,
  };

  const form = useForm<ProviderDetailsFormValues>({
    resolver: zodResolver(providerDetailsSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        professionalSummary: initialData.professionalSummary || "",
        gender: initialData.gender || "",
        roleName: initialData.roleName || "",
        nip: initialData.nip || "",
        licenseNumber: initialData.licenseNumber || "",
        yearsOfExperience: initialData.yearsOfExperience || 0,
      });
    }
  }, [initialData, form]);

  const selectedGender = form.watch("gender");

  const handleChange = (value: string) => {
    form.setValue("gender", value);
  };

  const processForm: SubmitHandler<ProviderDetailsFormValues> = async (
    data
  ) => {
    const formValues = form.getValues();

    const requestData = {
      professionalSummary: formValues.professionalSummary,
      gender: formValues.gender,
      roleName: formValues.roleName,
      nip: formValues.nip,
      licenseNumber: formValues.licenseNumber,
      yearsOfExperience: formValues.yearsOfExperience,
      providerAuthId: savedProviderAuthId,
      address: formValues.address,
    };

    const updatedRequestData = {
      professionalSummary: formValues.professionalSummary,
      gender: formValues.gender,
      roleName: formValues.roleName,
      nip: formValues.nip,
      licenseNumber: formValues.licenseNumber,
      yearsOfExperience: formValues.yearsOfExperience,
      address: formValues.address,
    };
    console.log(requestData);

    setLoading(true);
    try {
      let response;
      if (initialData) {
        response = await updateProviderDetails({
          requestData: updatedRequestData,
          providerID: savedProviderId,
        });
        console.log("Form upddated");
      } else {
        response = await sendProviderDetails({ requestData });
        if (response) {
          showToast({ toast, type: "success", message: "Sucess!" });
          console.log("Form submitted:", data);
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showToast({
        toast,
        type: "error",
        message: "Failed to submit the form. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {savedProviderId}

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      {savedProviderAuthId}
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processForm)}
          className="w-[30rem] space-y-8 p-3"
        >
          <div className={cn("gap-3 flex flex-col")}>
            <FormField
              control={form.control}
              name="professionalSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Enter your professional summary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter the rolename"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({}) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <div className="w-[30rem] flex flex-col gap-3">
                      <RadioButton
                        label="Male"
                        name="gender"
                        value="Male"
                        selectedValue={selectedGender}
                        onChange={handleChange}
                      />
                      <RadioButton
                        label="Female"
                        name="gender"
                        value="Female"
                        selectedValue={selectedGender}
                        onChange={handleChange}
                      />
                      <RadioButton
                        label="Other"
                        name="gender"
                        value="Other"
                        selectedValue={selectedGender}
                        onChange={handleChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter nip"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter the license number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      disabled={loading}
                      placeholder="Enter question order"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        field.onChange(value >= 0 ? value : 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Enter address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            className="ml-auto bg-[#84012A] w-[30rem]"
            type="submit"
          >
            {loading ? "Saving..." : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
