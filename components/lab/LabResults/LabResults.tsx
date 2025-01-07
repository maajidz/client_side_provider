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
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { filterLabResultsSchema } from "@/schema/createLabResultsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

function LabResults() {
  const form = useForm<z.infer<typeof filterLabResultsSchema>>({
    resolver: zodResolver(filterLabResultsSchema),
    defaultValues: {
      reviewer: "",
      status: "",
      name: ""
    },
  })

  function onSubmit(values: z.infer<typeof filterLabResultsSchema>) {
    console.log(values)
  }
  
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
              name="reviewer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reviewer</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reviewer1">Reviewer</SelectItem>
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
              {/* {filteredData.map((pharmacy, index) => (
                <TableRow key={index}>
                  <TableCell>{pharmacy.name}</TableCell>
                  <TableCell>{pharmacy.type}</TableCell>
                  <TableCell>{pharmacy.address}</TableCell>
                  <TableCell>{pharmacy.contact}</TableCell>
                  <TableCell>{pharmacy.zip}</TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default LabResults;
