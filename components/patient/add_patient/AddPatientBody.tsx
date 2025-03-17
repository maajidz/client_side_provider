"use client";

import { addNewPatientSchema } from "@/schema/addNewPatientSchema";
import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
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

const ringAnimation = `
  @keyframes ring {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }
`;

const checkAnimation = `
  @keyframes checkmark {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const AddPatientBody = () => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [activeSectionHeight, setActiveSectionHeight] = useState<number>(0);
  const [activeSectionTop, setActiveSectionTop] = useState<number>(0);
  const [isBasicFilled, setIsBasicFilled] = useState(false);
  const [isContactFilled, setIsContactFilled] = useState(false);
  const [isVitalsFilled, setIsVitalsFilled] = useState(false);
  const [hasBasicBeenFilled, setHasBasicBeenFilled] = useState(false);
  const [hasContactBeenFilled, setHasContactBeenFilled] = useState(false);
  const [hasVitalsBeenFilled, setHasVitalsBeenFilled] = useState(false);

  const firstNameRef = useRef<HTMLInputElement | null>(null);
  const heightRef = useRef<HTMLInputElement | null>(null);
  const phoneNumberRef = useRef<HTMLInputElement | null>(null);
  
  const basicSectionRef = useRef<HTMLDivElement | null>(null);
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const vitalsSectionRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

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

  const handleInputFocus = (section: string) => {
    setActiveSection(section);
    if (section === "basic") {
      if (basicSectionRef.current) {
        const height = basicSectionRef.current.clientHeight;
        setActiveSectionHeight(height);
        setActiveSectionTop(0);
      }
    } else if (section === "contact") {
      if (contactSectionRef.current && basicSectionRef.current) {
        const height = contactSectionRef.current.clientHeight;
        setActiveSectionHeight(height);
        const topPosition = basicSectionRef.current.clientHeight + 16;
        setActiveSectionTop(topPosition);
      }
    } else if (section === "vitals") {
      if (vitalsSectionRef.current && basicSectionRef.current && contactSectionRef.current) {
        const height = vitalsSectionRef.current.clientHeight;
        setActiveSectionHeight(height);
        const topPosition = basicSectionRef.current.clientHeight + 
                           contactSectionRef.current.clientHeight + 
                           32;
        setActiveSectionTop(topPosition);
      }
    }
  };

  const checkBasicFilled = () => {
    const { firstName, lastName, dob, gender } = methods.getValues();
    const isDobFilled = dob !== "";
    const isGenderFilled = gender === "Male" || gender === "Female" || gender === "Other";
    const filled = !!firstName && !!lastName && isDobFilled && isGenderFilled;
    setIsBasicFilled(filled);
    if (filled && !hasBasicBeenFilled) {
      setHasBasicBeenFilled(true);
    }
  };

  const checkContactFilled = () => {
    const { phoneNumber, state, email } = methods.getValues();
    const filled = !!phoneNumber && !!state && !!email;
    setIsContactFilled(filled);
    if (filled && !hasContactBeenFilled) {
        setHasContactBeenFilled(true);
    }
  };

  const checkVitalsFilled = () => {
    const { height, weight } = methods.getValues();
    const heightFilled = height.unit === "cm" ? !!height.value : !!height.feet && !!height.inches;
    const filled = heightFilled && !!weight.value;
    setIsVitalsFilled(filled);
    if (filled && !hasVitalsBeenFilled) {
      setHasVitalsBeenFilled(true);
    }
  };

  const handleInputChange = (section: string) => {
    if (section === "basic") {
      checkBasicFilled();
    } else if (section === "contact") {
      checkContactFilled();
    } else if (section === "vitals") {
      checkVitalsFilled();
    }
  };

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
          <div className="relative flex flex-col gap-4">
            <div
              className={`absolute inset-0 transition-transform duration-300 rounded-lg backdrop-blur-sm border bg-[#F3EFF0]/20`}
              style={{
                zIndex: 1,
                height: activeSectionHeight,
                transform: `translateY(${activeSection === "basic" ? 0 : activeSectionTop}px)`
              }}
            />
            
            <div ref={basicSectionRef} className={`hover:opacity-100 flex flex-row gap-4 p-4 ${activeSection === "basic" ? 'relative z-10 opacity-100' : ''} ${isBasicFilled && activeSection !== "basic" ? 'opacity-80' : ''} ${!isBasicFilled && activeSection !== "basic" ? 'opacity-70' : ''}`}>
              <div 
                className={`
                  flex flex-col gap-1 items-center justify-center w-11 h-11 rounded-lg
                  transition-all duration-300 ease-in-out
                  ${isBasicFilled ? 
                    !hasBasicBeenFilled && activeSection === "basic"
                      ? 'bg-blue-50 animate-[ring_2s_ease-in-out_infinite]' 
                      : 'bg-green-50 border border-green-600'
                    : activeSection === "basic"
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-200'
                  }
                `}
              >
                <Icon 
                  name={isBasicFilled ? "check_circle" : "badge"}
                  className={`
                    transition-all duration-300
                    ${isBasicFilled 
                      ? 'text-green-600 animate-[checkmark_0.4s_ease-in-out_forwards]' 
                      : activeSection === "basic"
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }
                  `}
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 font-semibold">
                  Identity
                  <span className="text-gray-500 text-xs font-medium">
                    Add patients identity information.
                  </span>
                </div>
                <div className="flex flex-col gap-6">
                  <FormSectionHor>
                    <FormField
                      control={methods.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>First Name:</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="First Name"
                              inputMode="text"
                              size={28}
                              ref={firstNameRef}
                              onFocus={() => handleInputFocus("basic")}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleInputChange("basic");
                                checkBasicFilled();
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
                              {...field}
                              type="text"
                              placeholder="Last Name"
                              inputMode="text"
                              size={28}
                              onFocus={() => handleInputFocus("basic")}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleInputChange("basic");
                                checkBasicFilled();
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
                                checkBasicFilled();
                              }}
                            >
                              <SelectTrigger onFocus={() => handleInputFocus("basic")} className="w-[230px]">
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
                    <FormField
                      control={methods.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="w-full">DOB:</FormLabel>
                          <FormControl>
                            <Input  
                              type="date"
                              size={28}
                              {...field}
                              className="text-center justify-center w-[174px]"
                              onFocus={() => handleInputFocus("basic")}
                              onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                const formattedDate = selectedDate.toISOString().split('T')[0];
                                field.onChange(formattedDate);
                                handleInputChange("basic");
                                checkBasicFilled();
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

            <div ref={contactSectionRef} className={`hover:opacity-100 flex flex-row gap-4 p-4 ${activeSection === "contact" ? 'relative z-10 opacity-100' : ''} ${isContactFilled && activeSection !== "contact" ? 'opacity-80' : ''} ${!isContactFilled && activeSection !== "contact" ? 'opacity-70' : ''}`}>
              <div 
                className={`
                  flex flex-col gap-1 items-center justify-center w-11 h-11 rounded-lg
                  transition-all duration-300 ease-in-out
                  ${isContactFilled ? 
                    !hasContactBeenFilled && activeSection === "contact"
                      ? 'bg-blue-50 animate-[ring_2s_ease-in-out_infinite]' 
                      : 'bg-green-50 border border-green-600'
                    : activeSection === "contact"
                      ? 'bg-blue-50'
                      : 'bg-gray-200 opacity-60'
                  }
                `}
              >
                <Icon 
                  name={isContactFilled ? "check_circle" : "contact_phone"}
                  className={`
                    transition-all duration-300
                    ${isContactFilled 
                      ? 'text-green-600 animate-[checkmark_0.4s_ease-in-out_forwards]' 
                      : activeSection === "contact"
                        ? 'text-blue-600'
                        : 'text-gray-400 opacity-60'
                    }
                  `}
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
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Phone Number:</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Contact Number"
                                inputMode="tel"
                                value={field.value}
                                ref={phoneNumberRef}
                                maxLength={10}
                                onFocus={() => handleInputFocus("contact")}
                                onChange={(e) => {
                                  field.onChange(e.currentTarget.value);
                                  handleInputChange("contact");
                                }}
                                className="font-normal text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                <SelectTrigger onFocus={() => handleInputFocus("contact")} className="w-[174px]">
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
                                onFocus={() => handleInputFocus("contact")}
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

            <div ref={vitalsSectionRef} className={`hover:opacity-100 flex flex-row gap-4 p-4 ${activeSection === "vitals" ? 'relative z-10 opacity-100' : ''} ${isVitalsFilled && activeSection !== "vitals" ? 'opacity-80' : ''} ${!isVitalsFilled && activeSection !== "vitals" ? 'opacity-70' : ''}`}>
              <div 
                className={`
                  flex flex-col gap-1 items-center justify-center w-11 h-11 rounded-lg
                  transition-all duration-300 ease-in-out
                  ${isVitalsFilled ? 
                    !hasVitalsBeenFilled && activeSection === "vitals"
                      ? 'bg-blue-50 animate-[ring_2s_ease-in-out_infinite]' 
                      : 'bg-green-50 border border-green-600'
                    : activeSection === "vitals"
                      ? 'bg-blue-50'
                      : 'bg-gray-200 opacity-60'
                  }
                `}
              >
                <Icon 
                  name={isVitalsFilled ? "check_circle" : "badge"}
                  className={`
                    transition-all duration-300
                    ${isVitalsFilled 
                      ? 'text-green-600 animate-[checkmark_0.4s_ease-in-out_forwards]' 
                      : activeSection === "vitals"
                        ? 'text-blue-600'
                        : 'text-gray-400 opacity-60'
                    }
                  `}
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
                    <div className="flex gap-2">
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
                                  placeholder="eg. 175"
                                  value={field.value}
                                  maxLength={3}
                                  width={4}
                                  ref={heightRef}
                                  onFocus={() => handleInputFocus("vitals")}
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
                                    onFocus={() => handleInputFocus("vitals")}
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
                                    onFocus={() => handleInputFocus("vitals")}
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
                                <SelectTrigger onFocus={() => handleInputFocus("vitals")}>
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
                                onFocus={() => handleInputFocus("vitals")}
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
                                <SelectTrigger onFocus={() => handleInputFocus("vitals")}>
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
          </div>
          <div className="flex justify-end w-full py-4">
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
      <style jsx>{`
        ${ringAnimation}
        ${checkAnimation}
      `}</style>
    </div>
  );
};

export default AddPatientBody;