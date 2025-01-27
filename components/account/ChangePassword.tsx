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
import { useToast } from "@/hooks/use-toast";
import { changePasswordSchema } from "@/schema/changePasswordSchema";
import { changeProviderPassword } from "@/services/registerServices";
import { RootState } from "@/store/store";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

function ChangePassword() {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Password State
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const {
    formState: { isValid },
    control,
  } = form;

  const currentPassword = useWatch({
    control,
    name: "oldPassword",
  });

  const newPassword = useWatch({
    control,
    name: "newPassword",
  });

  const confirmPassword = useWatch({
    control,
    name: "confirmPassword",
  });

  useEffect(() => {
    const validateCurrentPassword = async () => {
      if (currentPassword.length > 0) {
        await form.trigger("oldPassword");
      }
    };

    validateCurrentPassword();
  }, [currentPassword, form, currentPassword.length]);

  useEffect(() => {
    const validateNewPassword = async () => {
      if (newPassword) {
        await form.trigger("newPassword");
      }
    };

    validateNewPassword();
  }, [newPassword, form]);

  useEffect(() => {
    const validateConfirmPassword = async () => {
      if (confirmPassword.length > 0) {
        await form.trigger("confirmPassword");
      }
    };

    validateConfirmPassword();
  }, [newPassword, form, confirmPassword.length]);

  // Update Password
  const updatePassword = async (
    values: z.infer<typeof changePasswordSchema>
  ) => {
    setLoading(true);

    try {
      await changeProviderPassword({
        providerId: providerDetails.providerAuthId,
        requestData: {
          newPassword: values.newPassword,
          oldPassword: values.oldPassword,
        },
      });

      showToast({
        toast,
        type: "success",
        message: "Password changed successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not change password",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Could not change password. An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  return (
    <div className="flex flex-col gap-8 space-y-4 p-8 md:max-w-[500px] lg:max-w-[530px] w-full">
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold text-[#84012A]">
          Change Password
        </h2>
        <p className="text-base font-normal text-[#475467]">
          Please enter following details.
        </p>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(updatePassword)}
        >
          <div className="flex flex-col gap-2">
            <FormLabel className="block text-[#344054] text-sm font-normal">
              Current Password
            </FormLabel>
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormControl>
                    <div className="flex gap-2 border pr-2 rounded-md items-center">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current Password"
                        className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                      {showCurrentPassword ? (
                        <EyeIcon
                          size={15}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowCurrentPassword(!showCurrentPassword);
                          }}
                        />
                      ) : (
                        <EyeOffIcon
                          size={15}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowCurrentPassword(!showCurrentPassword);
                          }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel className="block text-[#344054] text-sm font-normal">
              New Password
            </FormLabel>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormControl>
                    <div className="flex gap-2 border pr-2 rounded-md items-center">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                        {...field}
                      />
                      {showNewPassword ? (
                        <EyeIcon
                          size={15}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowNewPassword(!showNewPassword);
                          }}
                        />
                      ) : (
                        <EyeOffIcon
                          size={15}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowNewPassword(!showNewPassword);
                          }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel className="block text-[#344054]  text-sm font-normal">
              Confirm Password
            </FormLabel>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormControl>
                    <div className="flex gap-2 border pr-2 rounded-md items-center">
                      <Input
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                        {...field}
                      />
                      {showConfirmNewPassword ? (
                        <EyeIcon
                          size={15}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowConfirmNewPassword(
                              !setShowConfirmNewPassword
                            );
                          }}
                        />
                      ) : (
                        <EyeOffIcon
                          size={15}
                          className="cursor-pointer"
                          onClick={() => {
                            setShowConfirmNewPassword(!showConfirmNewPassword);
                          }}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full px-3 py-4 rounded-lg cursor-pointer bg-[#84012A] hover:bg-[#6C011F]"
            disabled={!isValid || loading}
          >
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default ChangePassword;



