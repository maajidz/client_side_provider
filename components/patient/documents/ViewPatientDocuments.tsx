import { getDocumentsData } from "@/services/documentsServices";
import { DocumentsInterface } from "@/types/documentsInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import DragAndDrop from "./DragAndDrop";
import UploadDocumentDialog from "./UploadDocumentDialog";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

function ViewPatientDocuments({ userDetailsId }: { userDetailsId: string }) {
  const [documentsData, setDocumentsData] = useState<DocumentsInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const [isOpen, setIsOpen] = useState(false);

  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

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
          userDetailsId: userDetailsId,
          limit: 10,
          page: page
        });
        if (response) {
          setDocumentsData(response.data);
          setTotalPages(Math.ceil(response.meta.totalPages / itemsPerPage));
        }
        setLoading(false);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [page,userDetailsId]);

  useEffect(() => {
    fetchDocumentsData();
  }, [fetchDocumentsData]);

  const paginatedData = documentsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  ).filter(document => document.documents.documents);

  return (
    <div className="flex flex-col gap-3">
      {loading && <TableShimmer />}
      {!loading && paginatedData ? (
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
          data={paginatedData}
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
  );
}

export default ViewPatientDocuments;
