'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { registerProvider } from '@/services/registerServices';

const formSchema = z.object({
  firstname: z.string().min(3, 'Firstname is required'),
  lastname: z.string().min(3, 'Lastname is required'),
  phonenumber: z.string().refine((num) => {
    return num.length >= 10 && /^\d{10,}$/.test(num);
  }, {
    message: "Invalid phone number format. At least 10 digits are required."
  }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const defaultValues = {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    phonenumber: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    const requestData = {
      email: data.email,
      password: data.password,
      firstName: data.firstname,
      lastName: data.lastname,
      phoneNumber: data.phonenumber
    }

    console.log(requestData)

    try {
    const response = await registerProvider({ requestData: requestData });

    if (response) {
      // const signInResponse = await signIn('credentials', {
      //   username: data.username,
      //   email: data.email,
      //   password: data.password,
      //   callbackUrl: callbackUrl ?? '/dashboard',
      //   redirect: false,
      // });

      // if (signInResponse?.error) {
      //   alert('Sign-in failed: ' + signInResponse.error);
      // } else {
      //   window.location.href = callbackUrl ?? '/dashboard';
      // }
      router.push('/providerDetails')
    }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Login failed: Please check your credentials.');
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
          <div className='flex flex-row gap-3'>
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
          <FormField control={form.control} name="phonenumber" render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl >
                <Input placeholder="Phone Number" inputMode='tel' value={field.value}
                  onChange={(e) => field.onChange(e.currentTarget.value)}
                  autoFocus={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
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
          <div className='flex flex-col'>
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem className="">
                <FormLabel className=""> Password</FormLabel>
                <FormControl>
                  <div className='flex gap-2 border pr-2 rounded-md'>
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Password" {...field} className='border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ' />
                    <button onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeIcon size={15} /> : <EyeOffIcon size={15} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <Button disabled={loading} className="ml-auto w-full bg-[#84012A]" type="submit">
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
}
