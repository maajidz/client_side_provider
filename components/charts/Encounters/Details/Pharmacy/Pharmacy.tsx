import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { addPharmacyFormSchema } from "@/schema/addPharmacySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PharmacyDialog from "./PharmacyDialog";

const Pharmacy = () => {
  const [filteredData, setFilteredData] = useState(PHARMACY_DATA);

  const form = useForm<z.infer<typeof addPharmacyFormSchema>>({
    resolver: zodResolver(addPharmacyFormSchema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof addPharmacyFormSchema>) {
    // Filter logic
    const filtered = PHARMACY_DATA.filter((pharmacy) => {
      return (
        (!values.name ||
          pharmacy.name.toLowerCase().includes(values.name.toLowerCase())) &&
        (!values.city ||
          pharmacy.address.toLowerCase().includes(values.city.toLowerCase())) &&
        (!values.state ||
          pharmacy.address
            .toLowerCase()
            .includes(values.state.toLowerCase())) &&
        (!values.zip || pharmacy.zip.includes(values.zip)) &&
        (!values.phone || pharmacy.contact.includes(values.phone))
      );
    });
    setFilteredData(filtered);
  }

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="pharmacy">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Pharmacy</AccordionTrigger>
            <PharmacyDialog
              filteredData={filteredData}
              form={form}
              onSubmit={onSubmit}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Pharmacy;

const PHARMACY_DATA = [
  {
    name: "Smithermans Pharmacy",
    type: "Retail",
    address: "703 Main St , Montevallo, AL",
    contact: "2056652574",
    zip: "35115",
  },
  {
    name: "McConaghy Drug Store Inc.",
    type: "Retail",
    address: "5565 Hwy 43 , Satsuma, AL",
    contact: "2516752070",
    zip: "365720488",
  },
  {
    name: "LIMESTONE DRUG",
    type: "Retail",
    address: "200 W MARKET ST , ATHENS, AL",
    contact: "2562323811",
    zip: "35611",
  },
  {
    name: "PROPST DRUG INC",
    type: "Retail",
    address: "717 PRATT AVE , HUNTSVILLE, AL",
    contact: "2565397443",
    zip: "35801",
  },
  {
    name: "Boaz Discount Pharmacy",
    type: "Retail",
    address: "10460 AL Highway 168 Ste 1 , Boaz, AL",
    contact: "2565936546",
    zip: "35957",
  },
];
