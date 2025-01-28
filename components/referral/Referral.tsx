"use client";
import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import ReferralOutDialog from "./ReferralOut/ReferralOutDialog";
import ReferralInDialog from "./Referraln/ReferralInDialog";
import ViewReferralOut from "./ReferralOut/ViewReferralOut";
import ViewReferralIn from "./Referraln/ViewReferralIn";
import DefaultButton from "../custom_buttons/buttons/DefaultButton";

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
              <DefaultButton
                onClick={() => {
                  setIsReferralOutDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <PlusIcon />
                  Referral Out
                </div>
              </DefaultButton>
            ) : (
              <DefaultButton
                onClick={() => {
                  setIsReferralInDialogOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <PlusIcon />
                  Referral In
                </div>
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
          <TabsContent value="referralOut">
            <ViewReferralOut />
          </TabsContent>
          <TabsContent value="referralIn">
            <ViewReferralIn />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default Referral;
