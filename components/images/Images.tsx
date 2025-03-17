"use client";

import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import ImageResults from "./ImageResults/ImageResults";
import ImageOrders from "./ImageOrders/ImageOrders";
import CustomTabsTrigger from "../custom_buttons/buttons/CustomTabsTrigger";

const imageTab = [
  {
    value: "imageResults",
    label: "Image Results",
    component: ImageResults,
  },
  {
    value: "imageOrders",
    label: "Image Orders",
    component: ImageOrders,
  },
];

function Images() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="imageResults">
          <div className="flex items-center justify-between">
            <TabsList>
              {imageTab.map((tabs) => (
                <CustomTabsTrigger value={tabs.value} key={tabs.value}>
                  {tabs.label}
                </CustomTabsTrigger>
              ))}
            </TabsList>
          </div>
          {imageTab.map(({ value, component: Component }) => (
            <TabsContent value={value} key={value}>
              <Component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default Images;
