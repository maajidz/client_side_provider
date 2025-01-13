import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";
import { getTasks } from "@/services/chartDetailsServices";
import {
  TasksResponseDataInterface,
  TasksResponseInterface,
} from "@/types/tasksInterface";
import { filterTasksSchema } from "@/schema/tasksSchema";
import { priority } from "@/constants/data";
import TasksDialog from "./TasksDialog";

const ViewTasks = () => {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<TasksResponseInterface>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<TasksResponseDataInterface | null>(
    null
  );

  const form = useForm<z.infer<typeof filterTasksSchema>>({
    resolver: zodResolver(filterTasksSchema),
    defaultValues: {
      category: "",
      status: "",
      priority: "",
      userDetailsId: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterTasksSchema>) {
    console.log(values);
  }

  const fetchTasksList = useCallback(
    async (page: number) => {
      try {
        if (providerDetails) {
          const response = await getTasks({
            providerId: providerDetails.providerId,
            limit: 8,
            page: page,
          });
          if (response) {
            setResultList(response);
            setTotalPages(Math.ceil(response.total / Number(response.limit)));
          }
          setLoading(false);
        }
      } catch (e) {
        console.log("Error", e);
      }
    },
    [providerDetails]
  );

  useEffect(() => {
    fetchTasksList(page);
  }, [page, fetchTasksList]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="w-fit">Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ancillary_appointments">
                          Ancillary Appointments
                        </SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="cancel_subscription">
                          Cancel Subscription
                        </SelectItem>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priority.map((priority) => (
                          <SelectItem value={priority} key={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userDetailsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <FormControl>
                    <Input placeholder="Search Patient" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-end">
              <Button type="submit">Search</Button>
            </div>
          </form>
        </Form>

        {/* Results Table */}
        <div className="py-5">
          {resultList?.data && (
            <DataTable
              searchKey="id"
              columns={columns({
                setEditData,
                setIsDialogOpen,
              })}
              data={resultList?.data}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          )}

          <TasksDialog
            tasksData={editData}
            onClose={() => {
              setIsDialogOpen(false);
            }}
            isOpen={isDialogOpen}
          />
        </div>
      </div>
    </>
  );
};

export default ViewTasks;
