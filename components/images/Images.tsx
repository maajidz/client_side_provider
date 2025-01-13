"use client";

import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ImageResults from "./ImageResults/ImageResults";
import ImageOrders from "./ImageOrders/ImageOrders";

function Images() {
  const [activeTab, setActiveTab] = useState("imageResults");
  const router = useRouter();

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Tabs
          defaultValue="imageResults"
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex flex-row justify-between gap-10">
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="imageResults">Image Results</TabsTrigger>
              <TabsTrigger value="imageOrders">Image Orders</TabsTrigger>
            </TabsList>
            <Button
              className="bg-[#84012A]"
              onClick={() => 
                router.push(
                  activeTab === "imageResults"
                    ? "/dashboard/images/create_image_results"
                    : "/dashboard/images/create_image_orders"
                )
               }
            >
              <div className="flex items-center gap-3">
                <PlusIcon />
                {activeTab === "imageResults" ? "Image Results" : "Image Orders"}
              </div>
            </Button>
          </div>
          <TabsContent value="imageResults">
            <ImageResults />
          </TabsContent>
          <TabsContent value="imageOrders">
           <ImageOrders />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default Images;

