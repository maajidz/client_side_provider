import { useToast } from "@/hooks/use-toast";
import {
  deleteStickyNotes,
  getStickyNotesData,
} from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  PlusCircle,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useCallback, useEffect, useState } from "react";
import StickyNotesDialog from "./StickyNotesDialog";
import { StickyNotesResponseInterface } from "@/types/stickyNotesInterface";
import FormLabels from "@/components/custom_buttons/FormLabels";
import { showToast } from "@/utils/utils";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";

const StickyNotes = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<StickyNotesResponseInterface>();
  const [editData, setEditData] = useState<{ note: string; id: string } | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 3;

  const { toast } = useToast();

  const fetchStickyNotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getStickyNotesData({
        chartId: patientDetails.chart?.id,
        page: page,
        limit: limit,
      });
      if (response) {
        setData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [patientDetails?.chart?.id, page]);

  useEffect(() => {
    fetchStickyNotes();
  }, [fetchStickyNotes]);

  const handleDeleteStickyNotes = async (chartId: string) => {
    setLoading(true);
    try {
      await deleteStickyNotes({ chartId: chartId });
      showToast({
        toast,
        type: "success",
        message: "Sticky Note deleted successfully",
      });
      fetchStickyNotes();
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="alerts">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Sticky Notes</AccordionTrigger>
            <Button
              variant="ghost"
              className="invisible group-hover:visible"
              onClick={() => {
                setEditData(null);
                setIsDialogOpen(true);
              }}
            >
              <PlusCircle />
            </Button>
            <StickyNotesDialog
              chartId={patientDetails?.chart?.id}
              stickyNotesData={editData}
              onClose={() => {
                setIsDialogOpen(false);
                fetchStickyNotes();
              }}
              isOpen={isDialogOpen}
            />
          </div>
          <AccordionContent>
            {loading ? (
              <AccordionShimmerCard />
            ) : data?.total ? (
              data?.data && (
                <div className="flex flex-col gap-2">
                  <div className="space-x-2 self-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                  {data.data.flatMap((stickyNote, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border rounded-lg p-2"
                    >
                      <div className="flex justify-between items-center">
                        <FormLabels
                          label="Created on"
                          value={stickyNote.createdAt.split("T")[0]}
                        />
                        <div className="flex">
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setEditData({
                                note: stickyNote.note,
                                id: stickyNote.id,
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit2 color="#84012A" />
                          </Button>
                          <Button
                            variant={"ghost"}
                            onClick={() =>
                              handleDeleteStickyNotes(stickyNote.id)
                            }
                          >
                            <Trash2Icon color="#84012A" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 ">
                        <p className="text-base font-semibold">
                          {stickyNote.note}
                        </p>
                        <FormLabels
                          label="Created on"
                          value={stickyNote.createdAt.split("T")[0]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center">No Sticky notes found!</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StickyNotes;
