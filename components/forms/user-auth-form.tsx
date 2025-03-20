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
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { providerLogin } from "@/services/loginServices";
import { useDispatch } from "react-redux";
import { setLoginData } from "@/store/slices/loginSlice";
import { checkProviderExistsOrNot } from "@/services/registerServices";
import { showToast } from "@/utils/utils";
import { useToast } from "../ui/use-toast";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultValues = {
    email: "",
    password: "",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    const requestData = {
      email: data.email,
      password: data.password,
    };

    console.log(requestData);

    try {
      const response = await providerLogin({ requestData: requestData });

      if (response) {
        dispatch(
          setLoginData({
            providerAuthId: response.providerId,
            token: response.token,
          })
        );
        const checkUserDetails = await checkProviderExistsOrNot({
          Authid: response.providerId,
        });
        if (checkUserDetails?.providerDetails.id) {
          router.push("/dashboard");
          dispatch(
            setLoginData({
              providerId: checkUserDetails.providerDetails.id,
              providerUniqueId: checkUserDetails.providerDetails.providerUniqueId,
              firstName: checkUserDetails.firstName,
              lastName: checkUserDetails.lastName,
              email: checkUserDetails.email,
              roleName: checkUserDetails.providerDetails.roleName,
              nip: checkUserDetails.providerDetails.nip,
              phoneNumber: checkUserDetails.phoneNumber,
            })
          );
        } else {
          router.push("/dashboard/provider/profile");
        }
      } else {
        showToast({
          toast,
          type: "error",
          message: "Login failed: Please check your credentials.",
        });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error?.response?.data?.message || "Login failed. Please try again.";

        alert(errorMessage);
      }

      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
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
                    className="w-full"
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
                        className=" w-full border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 "
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
          <Button
            disabled={loading}
            className="ml-auto w-full bg-[#84012A]"
            type="submit"
          >
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
}
