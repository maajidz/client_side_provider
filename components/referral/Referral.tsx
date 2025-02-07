"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import ReferralOutDialog from "./ReferralOut/ReferralOutDialog";
import ReferralInDialog from "./Referraln/ReferralInDialog";
import ViewReferralOut from "./ReferralOut/ViewReferralOut";
import ViewReferralIn from "./Referraln/ViewReferralIn";
import DefaultButton from "../custom_buttons/buttons/DefaultButton";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";

const Referral = () => {
  const [activeTab, setActiveTab] = useState<string>("referralOut");
  const [isReferralOutDialogOpen, setIsReferralOutDialogOpen] =
    useState<boolean>(false);
  const [isReferralInDialogOpen, setIsReferralInDialogOpen] =
    useState<boolean>(false);

  const patientReferralTab = [
    {
      value: "referralOut",
      label: "Referral Out",
      component: ViewReferralOut,
    },
    { value: "referralIn", label: "Referral In", component: ViewReferralIn },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="referralOut"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
              {patientReferralTab.map((tab) => (
                <CustomTabsTrigger value={tab.value} key={tab.value}>
                  {tab.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
            {activeTab === "referralOut" ? (
              <DefaultButton
                onClick={() => {
                  setIsReferralOutDialogOpen(true);
                }}
              >
                <PlusIcon />
                Referral Out
              </DefaultButton>
            ) : (
              <DefaultButton
                onClick={() => {
                  setIsReferralInDialogOpen(true);
                }}
              >
                <PlusIcon />
                Referral In
              </DefaultButton>
            )}
            <ReferralOutDialog
              onClose={() => {
                setIsReferralOutDialogOpen(false);
              }}
              isOpen={isReferralOutDialogOpen}
            />
            <ReferralInDialog
              onClose={() => {
                setIsReferralInDialogOpen(false);
              }}
              isOpen={isReferralInDialogOpen}
            />
          </div>
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
