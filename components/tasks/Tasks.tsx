"use client";
import PageContainer from "@/components/layout/page-container";
import React from "react";
import ViewTasks from "./ViewTasks";

const Tasks = () => {
  return (
    <PageContainer scrollable={true}>
      <ViewTasks />
    </PageContainer>
  );
};

export default Tasks;
