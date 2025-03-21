import { useToast } from "@/hooks/use-toast";
import {
  createStickyNotes,
  deleteStickyNotes,
  getStickyNotesData,
  updateStickyNotesData,
} from "@/services/chartDetailsServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { StickyNoteColor } from "@/components/ui/stickyNote/stickyNote";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useCallback, useEffect, useState } from "react";
import { StickyNotesResponseInterface } from "@/types/stickyNotesInterface";
import { showToast } from "@/utils/utils";
import AccordionShimmerCard from "@/components/custom_buttons/shimmer/AccordionCardShimmer";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { StickyNote } from "@/components/ui/stickyNote/stickyNote";

const StickyNotes = ({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<StickyNotesResponseInterface>();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Pagination State
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const { toast } = useToast();
  const providerDetails = useSelector((state: RootState) => state.login);

  const fetchStickyNotes = useCallback(async () => {
    if (!patientDetails.chart?.id) return;
    
    setLoading(true);
    try {
      const response = await getStickyNotesData({
        chartId: patientDetails.chart.id,
        page: page,
        limit: limit,
      });
      if (response) {
        setData(response);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (e) {
      console.log("Error", e);
      showToast({ toast, type: "error", message: "Failed to load sticky notes" });
    } finally {
      setLoading(false);
    }
  }, [patientDetails.chart?.id, page, limit, toast]);

  useEffect(() => {
    fetchStickyNotes();
  }, [fetchStickyNotes]);

  const handleDeleteStickyNote = async (id: string) => {
    console.log("Deleting note with id:", id);
    setLoading(true);
    try {
      await deleteStickyNotes({ chartId: id });
      showToast({
        toast,
        type: "success",
        message: "Sticky Note deleted successfully",
      });
      // Close the active note if we just deleted it
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
      fetchStickyNotes();
    } catch (e) {
      console.log("Error deleting note:", e);
      showToast({ toast, type: "error", message: "Error deleting note" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStickyNote = async (
    id: string, 
    title: string, 
    description: string, 
    color: StickyNoteColor
  ) => {
    try {
      console.log("Updating note:", { id, title, description, color });
      await updateStickyNotesData({
        id,
        requestData: {
          title,
          note: description,
          color: color.toString(),
        },
      });
      fetchStickyNotes();
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: "Error updating note" });
    }
  };

  const handleTogglePin = async (id: string) => {
    const note = data?.data.find(note => note.id === id);
    if (!note) {
      console.error("Cannot find note with id:", id);
      return;
    }

    const newPinnedStatus = !note.isPinned;
    console.log("Toggling pin for note:", id, "to", newPinnedStatus);

    try {
      await updateStickyNotesData({
        id,
        requestData: {
          isPinned: newPinnedStatus,
        },
      });
      fetchStickyNotes();
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: "Error toggling pin status" });
    }
  };

  const addNewNote = async () => {
    if (!patientDetails.chart?.id) return;
    
    const newNote = {
      chartId: patientDetails.chart.id,
      title: "",
      note: "",
      providerId: providerDetails.providerId,
      color: "yellow",
      isPinned: false,
    };

    try {
      const response = await createStickyNotes({ requestData: newNote });
      console.log("Created new note:", response);
      fetchStickyNotes();
      
      // Set the new note as active
      if (response && response.id) {
        setActiveNoteId(response.id);
      }
    } catch (e) {
      console.log("Error:", e);
      showToast({ toast, type: "error", message: "Error creating new note" });
    }
  };

  // Sort notes with pinned ones at the top
  const sortedNotes = data?.data 
    ? [...data.data].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      })
    : [];

  return (
    <div className="flex flex-col gap-3 group">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="sticky-notes">
          <div className="flex justify-between items-center">
            <AccordionTrigger>Sticky Notes</AccordionTrigger>
            <Button
              variant="ghost"
              className="invisible group-hover:visible"
              onClick={addNewNote}
            >
              <Plus />
            </Button>
          </div>
          <AccordionContent>
            {loading ? (
              <AccordionShimmerCard />
            ) : sortedNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                {sortedNotes.map((note) => {
                  // Handle missing fields for backward compatibility
                  const noteColor = note.color || "yellow";
                  const validColor = ["yellow", "blue", "green", "pink", "purple", "orange"].includes(noteColor) 
                    ? noteColor as StickyNoteColor 
                    : "yellow";
                  
                  return (
                    <StickyNote
                      key={note.id}
                      id={note.id}
                      title={note.title || ""}
                      description={note.note || ""}
                      color={validColor}
                      isPinned={!!note.isPinned}
                      isExpanded={activeNoteId === note.id}
                      onOpen={() => setActiveNoteId(note.id)}
                      onClose={() => setActiveNoteId(null)}
                      onUpdate={handleUpdateStickyNote}
                      onDelete={handleDeleteStickyNote}
                      onTogglePin={handleTogglePin}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-4">
                <p>No sticky notes found</p>
                <Button 
                  onClick={addNewNote} 
                  className="mt-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            )}

            {data && data.total > limit && (
              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StickyNotes;
