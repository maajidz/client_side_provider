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
  FormSectionHor,
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
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";

const AddPatientBody = () => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  // const [isBasicActive, setIsBasicActive] = useState(false);
  // const [isContactActive, setIsContactActive] = useState(false);
  // const [isVitalsActive, setIsVitalsActive] = useState(false);
  const [isBasicFilled, setIsBasicFilled] = useState(false);
  const [isContactFilled, setIsContactFilled] = useState(false);
  const [isVitalsFilled, setIsVitalsFilled] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

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
      router.push("/dashboard/provider/patient");
      methods.reset();
    }
  };

  // const handleInputFocus = (section: string) => {
  //   if (section === "basic") setIsBasicActive(true);
  //   if (section === "contact") setIsContactActive(true);
  //   if (section === "vitals") setIsVitalsActive(true);
  // };

  // Function to check if all fields in the basic section are filled
  const checkBasicFilled = () => {
    const { firstName, lastName, dob, gender } = methods.getValues();
    setIsBasicFilled(!!firstName && !!lastName && !!dob && !!gender);
  };

  // Function to check if all fields in the contact section are filled
  const checkContactFilled = () => {
    const { state, phoneNumber, email } = methods.getValues();
    console.log("Contact Fields:", { state, phoneNumber, email });
    setIsContactFilled(!!state && !!phoneNumber && !!email);
  };

  // Function to check if all fields in the vitals section are filled
  const checkVitalsFilled = () => {
    const { height, weight } = methods.getValues();
    const heightFilled = height.unit === "cm" ? !!height.value : !!height.feet && !!height.inches;
    setIsVitalsFilled(heightFilled && !!weight.value);
  };

  // Update filled state on input change
  const handleInputChange = (section: string) => {
    if (section === "basic") {
      checkBasicFilled();
    } else if (section === "contact") {
      checkContactFilled();
    } else if (section === "vitals") {
      checkVitalsFilled();
    }
  };

  // // Reset active state when form is reset
  // useEffect(() => {
  //   methods.reset();
  //   setIsBasicActive(false);
  //   setIsContactActive(false);
  //   setIsVitalsActive(false);
  // }, [methods]);

  if (loading) {
    return <LoadingButton />;
  }
  return (
    <div>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-row gap-4">
            <div className={`flex flex-col gap-1 items-center justify-center w-11 h-11 ${isBasicFilled ? 'bg-green-50' : 'bg-rose-50'} rounded-lg`}>
              <Icon 
                name={isBasicFilled ? "check_circle" : "badge"} 
                className={isBasicFilled ? "text-green-600" : "text-pink-800"}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 font-semibold">
                Identity
                <span className="text-gray-500 text-xs font-medium">
                  Add patients identity information.
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <FormSectionHor>
                  <FormField
                    control={methods.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>First Name:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="First Name"
                            inputMode="text"
                            {...field}
                            // onFocus={() => handleInputFocus("basic")}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleInputChange("basic");
                            }}
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
                      <FormItem className="flex flex-col">
                        <FormLabel>Last Name:</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Last Name"
                            inputMode="text"
                            {...field}
                            // onFocus={() => handleInputFocus("basic")}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleInputChange("basic");
                            }}
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
                      <FormItem className="flex items-center flex-col flex-1">
                        <FormLabel className="w-full">DOB:</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="text-left justify-center cursor-pointer "
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleInputChange("basic");
                            }}
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
                            onValueChange={(value: string) => {
                              field.onChange(value);
                              handleInputChange("basic");
                            }}
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
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className={`flex flex-col gap-1 items-center justify-center w-11 h-11 ${isContactFilled ? 'bg-green-50' : 'bg-rose-50'} rounded-lg`}>
              <Icon 
                name={isContactFilled ? "check_circle" : "contact_phone"} 
                className={isContactFilled ? "text-green-600" : "text-pink-800"}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 font-semibold">
                Contact Details
                <span className="text-gray-500 text-xs font-medium">
                  Add patients contact information.
                </span>
              </div>
              <div className="flex flex-col group gap-4 flex-1">
                <div className="flex flex-col gap-6">
                  <FormSectionHor>
                    <FormField
                      control={methods.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>State:</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value: string) => {
                                field.onChange(value);
                                handleInputChange("contact");
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select here" />
                              </SelectTrigger>
                              <SelectContent>
                                <Input
                                  type="text"
                                  placeholder="Search states..."
                                  value={search}
                                  onChange={(e) => {
                                    setSearch(e.target.value);
                                    handleInputChange("contact");
                                  }}
                                  className="p-2 w-full border-b border-gray-300"
                                  autoFocus={true}
                                />
                                {filteredStates.map((state) => (
                                  <SelectItem
                                    key={state.name}
                                    value={state.name}
                                  >
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
                        <FormItem className="flex flex-col">
                          <FormLabel>Phone Number:</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contact Number"
                              inputMode="tel"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.currentTarget.value);
                                handleInputChange("contact");
                              }}
                              className="font-normal text-base"
                              autoFocus={true}
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
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Email:</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              type="email"
                              {...field}
                              className="font-normal text-base"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleInputChange("contact");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FormSectionHor>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className={`flex flex-col gap-1 items-center justify-center w-11 h-11 ${isVitalsFilled ? 'bg-green-50' : 'bg-rose-50'} rounded-lg`}>
              <Icon 
                name={isVitalsFilled ? "check_circle" : "badge"} 
                className={isVitalsFilled ? "text-green-600" : "text-pink-800"}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 font-semibold">
                Vitals
                <span className="text-gray-500 text-xs font-medium">
                  Add patients vitals information.
                </span>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <FormLabel>Height:</FormLabel>
                  <div className="flex gap-1">
                    {heightUnit === "cm" && (
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
                                // onFocus={() => handleInputFocus("vitals")}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  handleInputChange("vitals");
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {heightUnit === "feet" && (
                      <div className="flex gap-2">
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
                                  // onFocus={() => handleInputFocus("vitals")}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    handleInputChange("vitals");
                                  }}
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
                                  //  onFocus={() => handleInputFocus("vitals")}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    handleInputChange("vitals");
                                  }}
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
                                handleInputChange("vitals");
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
                <div className="flex flex-col gap-2">
                  <FormLabel>Weight:</FormLabel>
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
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleInputChange("vitals");
                              }}
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
                                handleInputChange("vitals");
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
          <div className="flex justify-end w-full">
            <SubmitButton label="Add" />
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