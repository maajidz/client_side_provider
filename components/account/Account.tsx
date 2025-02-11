"use client";

import Profile from "@/app/dashboard/provider/profile/page";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import ChangePassword from "./ChangePassword";
import { useState } from "react";

function Account() {
  const [activeTab, setActiveTab] = useState("myProfile");

  return (
    <div className="space-y-2">
      <Tabs
        defaultValue={activeTab}
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="flex items-center justify-between gap-10 border-b rounded-md border-gray-300 p-1.5">
          <TabsList className="grid w-full grid-cols-2">
            <CustomTabsTrigger value="myProfile">My Profile</CustomTabsTrigger>
            <CustomTabsTrigger value="changePassword">
              Change Password
            </CustomTabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="myProfile">
          <Profile />
        </TabsContent>
        <TabsContent value="changePassword" className="flex space-y-2">
          <ChangePassword />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Account;
