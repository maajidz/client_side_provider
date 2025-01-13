"use client";

import { Breadcrumbs } from "@/components/breadcrumbs";
import PageContainer from "@/components/layout/page-container";
import Tasks from "@/components/tasks/Tasks";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Tasks", link: "/dashboard/tasks" },
];

function TasksPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Tasks />
      </div>
    </PageContainer>
  );
}

export default TasksPage;
