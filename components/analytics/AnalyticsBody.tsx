import React from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DefaultReportsBody from "./DefaultReports/DefaultReportsBody";

const AnalyticsBody = () => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Analytics`} description="" />
      </div>
      <Separator />
      <Tabs defaultValue="defaultReports" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="defaultReports">Default Reports</TabsTrigger>
          <TabsTrigger value="currentReports">Current Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="defaultReports">
          <DefaultReportsBody />
        </TabsContent>
        <TabsContent value="currentReports">Change your password here.</TabsContent>
      </Tabs>
    </>
  );
};

export default AnalyticsBody;
