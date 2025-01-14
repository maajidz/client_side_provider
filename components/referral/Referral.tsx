"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ReferralOutDialog from "./ReferralOut/ReferralOutDialog";
import ReferralInDialog from "./Referraln/ReferralInDialog";

const Referral = () => {
  const [activeTab, setActiveTab] = useState<string>("referralOut");
  const [isReferralOutDialogOpen, setIsReferralOutDialogOpen] =
    useState<boolean>(false);
  const [isReferralInDialogOpen, setIsReferralInDialogOpen] =
    useState<boolean>(false);

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="referralOut"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="referralOut">Referral Out</TabsTrigger>
              <TabsTrigger value="referralIn">Referral In</TabsTrigger>
            </TabsList>
            {activeTab === "referralOut" ? (
              <Button
                className="bg-[#84012A]"
                onClick={() => {
                  setIsReferralOutDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <PlusIcon />
                  Referral Out
                </div>
              </Button>
            ) : (
              <Button
                className="bg-[#84012A]"
                onClick={() => {
                  setIsReferralInDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <PlusIcon />
                  Referral In
                </div>
              </Button>
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
          <TabsContent value="referralOut">{/* <LabResults /> */}</TabsContent>
          <TabsContent value="referralIn">{/* <LabOrders /> */}</TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Referral;
