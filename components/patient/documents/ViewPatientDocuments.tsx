import { getDocumentsData } from "@/services/documentsServices";
import { DocumentsInterface } from "@/types/documentsInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import DragAndDrop from "./DragAndDrop";
import UploadDocumentDialog from "./UploadDocumentDialog";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";
import PageContainer from "@/components/layout/page-container";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ViewPatientDocuments({ userDetailsId }: { userDetailsId: string }) {
  const [documentsData, setDocumentsData] = useState<DocumentsInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 5;

  const [isOpen, setIsOpen] = useState(false);

  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const form = useForm({
    defaultValues: {
      status: "",
    },
  });

  const filters = form.watch();

  const handleOpenUploadDialog = (status: boolean, files?: File[]) => {
    setIsOpen(status);
    if (files) {
      setDroppedFiles(files);
    }
  };

  const fetchDocumentsData = useCallback(async () => {
    try {
      setLoading(true);
      if (userDetailsId) {
        const response = await getDocumentsData({
          userDetailsId,
          page,
          limit: itemsPerPage,
          status: filters.status === "all" ? "" : filters.status,
        });
        if (response) {
          const validDocuments = response.data.filter(
            (document) => document.documents?.documents
          );

          setDocumentsData(validDocuments);

          const totalItems = response.meta.totalCount;
          setTotalPages(Math.ceil(totalItems / itemsPerPage));
        }
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [page, userDetailsId, filters.status]);

  useEffect(() => {
    fetchDocumentsData();
  }, [fetchDocumentsData]);

  return (
    <PageContainer>
      <Form {...form}>
        <form className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
                      <SelectItem value="all" className="cursor-pointer">
                        All
                      </SelectItem>
                      <SelectItem value="pending" className="cursor-pointer">
                        Pending
                      </SelectItem>
                      <SelectItem value="Completed" className="cursor-pointer">
                        Completed
                      </SelectItem>
                      <SelectItem value="reviewed" className="cursor-pointer">
                        Reviewed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className="flex flex-col gap-3">
        {loading && <TableShimmer />}
        {!loading && documentsData ? (
          <DefaultDataTable
            title={
              <div className="flex flex-row gap-5 items-center">
                <div>Patient Documents</div>
                <UploadDocumentDialog
                  userDetailsId={userDetailsId}
                  open={isOpen}
                  droppedFiles={droppedFiles}
                  onFileSelected={(status: boolean) =>
                    handleOpenUploadDialog(status)
                  }
                  onFetchDocuments={fetchDocumentsData}
                />
              </div>
            }
            columns={columns()}
            data={documentsData}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        ) : (
          <DragAndDrop
            onFilesDropped={(status: boolean, files: File[]) =>
              handleOpenUploadDialog(status, files)
            }
          />
        )}
      </div>
    </PageContainer>
  );
}

export default ViewPatientDocuments;
