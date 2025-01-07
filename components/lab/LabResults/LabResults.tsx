import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { filterLabResultsSchema } from "@/schema/createLabResultsSchema";
import { getLabResultList } from "@/services/labResultServices";
import { RootState } from "@/store/store";
import { LabResultsInterface } from "@/types/labResults";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

function LabResults() {
  const providerDetails = useSelector((state: RootState) => state.login);
  const [resultList, setResultList] = useState<LabResultsInterface>();
  const form = useForm<z.infer<typeof filterLabResultsSchema>>({
    resolver: zodResolver(filterLabResultsSchema),
    defaultValues: {
      reviewer: "",
      status: "",
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof filterLabResultsSchema>) {
    console.log(values);
  }

  const fetchLabResultsList = async () => {
    try {
      if (providerDetails) {
        const response = await getLabResultList({
          providerId: providerDetails.providerId,
          limit: 10,
          page: 1,
        });
        if (response) {
          setResultList(response);
        }
      }
    } catch (e) {
      console.log("Error", e );
    }
  };

  useEffect(() => {
    fetchLabResultsList();
  })

  return (
    <>
      <div className="">
        {/* Search Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
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
                        <SelectItem value="signed">Signed</SelectItem>
                        <SelectItem value="unsigned">Unsigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patients</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Lab</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Interpretation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {resultList?.results.map((pharmacy, index) => (
                <TableRow key={index}>
                  <TableCell>{pharmacy.id}</TableCell>
                  <TableCell>{pharmacy.reviewerId}</TableCell>
                  <TableCell>{pharmacy.tags}</TableCell>
                  <TableCell>{pharmacy.dateTime}</TableCell>
                  <TableCell>{pharmacy.file}</TableCell>
                </TableRow>
              ))}
              {resultList?.total === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )} 
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default LabResults;
