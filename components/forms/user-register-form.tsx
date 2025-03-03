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
import { useForm, useWatch } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { registerProvider } from "@/services/registerServices";
import { useDispatch } from "react-redux";
import { setLoginData } from "@/store/slices/loginSlice";
import {
  formRegisterSchema,
  UserFormRegisterValue,
} from "@/schema/registerSchema";

export default function UserRegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);
  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    phonenumber: "",
  };

  const form = useForm<UserFormRegisterValue>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues,
  });

  const {
    formState: { isValid },
    control,
  } = form;

  const password = useWatch({
    control,
    name: "password",
  });

  const confirmPassword = useWatch({
    control,
    name: "confirmPassword",
  });

  useEffect(() => {
    const validatePassword = async () => {
      if (password) {
        await form.trigger("password");
      }
    };

    validatePassword();
  }, [password, form]);

  useEffect(() => {
    const validateConfirmPassword = async () => {
      if (confirmPassword.length > 0) {
        await form.trigger("confirmPassword");
      }
    };

    validateConfirmPassword();
  }, [password, form, confirmPassword.length]);

  const onSubmit = async (data: UserFormRegisterValue) => {
    setLoading(true);

    const requestData = {
      email: data.email,
      password: data.password,
      firstName: data.firstname,
      lastName: data.lastname,
      phoneNumber: data.phonenumber,
    };

    console.log(requestData);

    try {
      const response = await registerProvider({ requestData: requestData });

      if (response) {
        dispatch(setLoginData({ providerAuthId: response.providerId }));
        router.push("/provider_details");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Login failed: Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmNewPassword(!showConfirmNewPassword);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <div className="flex flex-row gap-3">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      type="firstname"
                      placeholder="Enter firstname"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="lastname"
                      placeholder="Enter lastname"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phonenumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone Number"
                    inputMode="tel"
                    value={field.value}
                    onChange={(e) => field.onChange(e.currentTarget.value)}
                    autoFocus={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className=""> Password</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 border pr-2 rounded-md">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                        className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                      />
                      <button onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <EyeIcon size={15} />
                        ) : (
                          <EyeOffIcon size={15} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 border pr-2 rounded-md">
                      <Input
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                        className="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                      />
                      <button onClick={toggleConfirmPasswordVisibility}>
                        {showPassword ? (
                          <EyeIcon size={15} />
                        ) : (
                          <EyeOffIcon size={15} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="ml-auto w-full"
            type="submit"
            style={{
              backgroundColor: isValid  ? '#84012A' : '#84012A4D',
              cursor: isValid  ? 'pointer' : 'not-allowed',
          }}
            disabled={!isValid || loading}
          >
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
}
