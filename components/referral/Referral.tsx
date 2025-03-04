"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import React from "react";
import ViewReferralOut from "./ReferralOut/ViewReferralOut";
import ViewReferralIn from "./Referraln/ViewReferralIn";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";

const Referral = () => {
  const patientReferralTab = [
    {
      value: "referralOut",
      label: "Referral Out",
      component: ViewReferralOut,
    },
    {
      value: "referralIn",
      label: "Referral In",
      component: ViewReferralIn,
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-4">
        <Tabs defaultValue="referralOut">
          <TabsList className="grid w-full grid-cols-2">
            {patientReferralTab.map((tab) => (
              <CustomTabsTrigger value={tab.value} key={tab.value}>
                {tab.label}
              </CustomTabsTrigger>
            ))}
          </TabsList>
          {patientReferralTab.map(({ value, component: Component }) => (
            <TabsContent value={value} key={value}>
              {Component ? <Component /> : value}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Referral;
