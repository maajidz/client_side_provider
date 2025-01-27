import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { getDocumentsData } from "@/services/documentsServices";
import { DocumentsInterface } from "@/types/documentsInterface";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";
import DragAndDrop from "./DragAndDrop";
import UploadDocumentDialog from "./UploadDocumentDialog";

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
  }, [userDetailsId]);

  useEffect(() => {
    fetchDocumentsData();
  }, [fetchDocumentsData]);

  const paginatedData = documentsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <div className="flex justify-end">
        <UploadDocumentDialog
          userDetailsId={userDetailsId}
          open={isOpen}
          droppedFiles={droppedFiles}
          onFileSelected={(status: boolean) => handleOpenUploadDialog(status)}
          onFetchDocuments={fetchDocumentsData}
        />
      </div>
      {paginatedData ? (
        <DataTable
          searchKey="Documents"
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
    </>
  );
}

export default ViewPatientDocuments;
