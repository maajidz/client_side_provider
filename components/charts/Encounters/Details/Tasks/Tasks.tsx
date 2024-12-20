import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LoadingButton from "@/components/LoadingButton";
import { tasksSchema } from "@/schema/tasksSchema";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import TasksDialog from "./TasksDialog";

const Tasks = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showDueDate, setShowDueDate] = useState(false);
  const providerDetails = useSelector((state: RootState) => state.login);
  const reminderOptions = [
    "On Due Date",
    "1 Day Before",
    "2 Days Before",
    "3 Days Before",
  ];

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: {
      category: "",
      task: "",
      owner: providerDetails.firstName ? providerDetails.firstName : "",
      priority: "",
      dueDate: new Date().toISOString().split("T")[0],
      sendReminder: [],
      comments: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    console.log("Form Values:", values);
    // const requestData = {
    //     alertName: "",
    //     alertDescription: "",
    // }
    setLoading(true);
    try {
      // await createTransfer({ requestData: requestData })
    } catch (e) {
      console.log("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className="flex flex-col gap-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="tasks">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Tasks</AccordionTrigger>
            <TasksDialog
              form={form}
              reminderOptions={reminderOptions}
              showDueDate={showDueDate}
              onSetShowDueData={setShowDueDate}
              onSubmit={onSubmit}
            />
          </div>
          <AccordionContent className="sm:max-w-4xl"></AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Tasks;
