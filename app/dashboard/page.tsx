//dashboard
'use client'
import PageContainer from '@/components/layout/page-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function page() {

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, {} Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            {/* <CalendarDateRangePicker /> */}
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div>
              Tab Content
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
