import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import EncountersByMonthDay from "./Encounters/EncountersByMonth&Day";
import EncountersByVisitType from "./Encounters/EncountersByVisitType";
import EncountersByProvider from "./Encounters/EncountersByProvider";
import PatientsByRegistration from "./Patients/PatientsByRegistration";
import PatientsByDemographics from "./Patients/PatientsByDemographics";
import PatientsByPHRUsage from "./Patients/PatientsByPHRUsage";
import PatientsByPrimaryCarePhysician from "./Patients/PatientsByPrimaryCarePhysician";
import PatientsByReferringProvider from "./Patients/PatientsByReferringProvider";
import PatientsByInHouseCareTeam from "./Patients/PatientsByInHouseCareTeam";
import PatientsByPrimaryInsurance from "./Patients/PatientsByPrimaryInsurance";
import MedicalRecordsTop20Diagnoses from "./MedicalRecords/MedicalRecordsTop20Diagnoses";
import MedicalRecordsTop20Vaccines from "./MedicalRecords/MedicalRecordsTop20Vaccines";
import MedicalRecordsTop20LabTests from "./MedicalRecords/MedicalRecordsTop20LabTests";
import MedicalRecordsTop20Supplements from "./MedicalRecords/MedicalRecordsTop20Supplements";

const DefaultReportsBody = () => {
  return (
    <Tabs defaultValue="encountersByMonth" className="flex flex-row gap-5">
      <ScrollArea className="h-[65dvh] border rounded-md w-56">
        <TabsList className="flex flex-col h-full w-56 justify-start items-start p-3 gap-3 overflow-hidden">
          <div className="text-black">Encounters</div>
          <div className="flex flex-col items-start">
            <TabsTrigger value="encountersByMonth&Day">
              By Month/Day
            </TabsTrigger>
            <TabsTrigger value="encountersByVisitType">
              By Visit Type
            </TabsTrigger>
            <TabsTrigger value="encountersByMode">By Mode</TabsTrigger>
            <TabsTrigger value="encountersByProvider">By Provider</TabsTrigger>
          </div>
          <Separator color="#000" />
          <div className="text-black">Patients</div>
          <div className="flex flex-col items-start">
            <TabsTrigger value="patientsByRegistration">
              By Registration
            </TabsTrigger>
            <TabsTrigger value="patientsByDemographics">
              By Demographics
            </TabsTrigger>
            <TabsTrigger value="patientsByPHRUsage">By PHR Usage</TabsTrigger>
            <TabsTrigger value="patientsByPrimaryCarePhysician">
              By Primary Care Physician
            </TabsTrigger>
            <TabsTrigger value="patientsByReferringProvider">
              By Referring Provider
            </TabsTrigger>
            <TabsTrigger value="patientsByInHouseCareTeam">
              By In House Care Team
            </TabsTrigger>
            <TabsTrigger value="patientsByPrimaryInsurance">
              By Primary Insurance
            </TabsTrigger>
          </div>
          <Separator color="#000" />
          <div className="text-black">Medical Records</div>
          <div className="flex flex-col items-start">
            <TabsTrigger value="medicalRecordsTop20Diagnoses">
              Top 20 Diagnoses
            </TabsTrigger>
            <TabsTrigger value="medicalRecordsTop20Presciptions">
              Top 20 Presciptions
            </TabsTrigger>
            <TabsTrigger value="medicalRecordsTop20Vaccines">
              Top 20 Vaccines
            </TabsTrigger>
            <TabsTrigger value="medicalRecordsTop20LabTests">
              Top 20 Lab Tests
            </TabsTrigger>
            <TabsTrigger value="medicalRecordsTop20Supplements">
              Top 20 Supplements
            </TabsTrigger>
          </div>
          <Separator color="#000" />
          <div className="text-black">Appointments</div>
        </TabsList>
      </ScrollArea>
      <TabsContent value="encountersByMonth&Day">
        <EncountersByMonthDay />
      </TabsContent>
      <TabsContent value="encountersByVisitType">
        <EncountersByVisitType />
      </TabsContent>
      <TabsContent value="encountersByMode">
        <EncountersByMonthDay />
      </TabsContent>
      <TabsContent value="encountersByProvider">
        <EncountersByProvider />
      </TabsContent>
      <TabsContent value="patientsByRegistration">
        <PatientsByRegistration />
      </TabsContent>
      <TabsContent value="patientsByDemographics">
        <PatientsByDemographics />
      </TabsContent>
      <TabsContent value="patientsByPHRUsage">
        <PatientsByPHRUsage />
      </TabsContent>
      <TabsContent value="patientsByPrimaryCarePhysician">
        <PatientsByPrimaryCarePhysician />
      </TabsContent>
      <TabsContent value="patientsByReferringProvider">
        <PatientsByReferringProvider />
      </TabsContent>
      <TabsContent value="patientsByInHouseCareTeam">
        <PatientsByInHouseCareTeam />
      </TabsContent>
      <TabsContent value="patientsByPrimaryInsurance">
        <PatientsByPrimaryInsurance />
      </TabsContent>
      <TabsContent value="medicalRecordsTop20Diagnoses">
        Change your password here.
      </TabsContent>
      <TabsContent value="medicalRecordsTop20Presciptions">
        <MedicalRecordsTop20Diagnoses />
      </TabsContent>
      <TabsContent value="medicalRecordsTop20Vaccines">
        <MedicalRecordsTop20Vaccines />
      </TabsContent>
      <TabsContent value="medicalRecordsTop20LabTests">
        <MedicalRecordsTop20LabTests />
      </TabsContent>
      <TabsContent value="medicalRecordsTop20Supplements">
        <MedicalRecordsTop20Supplements />
      </TabsContent>
    </Tabs>
  );
};

export default DefaultReportsBody;
