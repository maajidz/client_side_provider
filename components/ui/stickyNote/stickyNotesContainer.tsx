"use client"

import { useState } from "react"
import { StickyNote, type StickyNoteColor } from "./stickyNote"
import { Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export interface Note {
  id: string
  title: string
  description: string
  color: StickyNoteColor
  isPinned: boolean
}

interface StickyNotesContainerProps {
  initialNotes?: Note[]
}

export function StickyNotesContainer({ initialNotes = [] }: StickyNotesContainerProps) {
  const [notes, setNotes] = useState<Note[]>(
    initialNotes.map((note) => ({
      ...note,
      isPinned: note.isPinned || false,
    })),
  )
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)

  const addNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "",
      description: "",
      color: "yellow",
      isPinned: false,
    }
    const newNotes = [...notes, newNote]
    setNotes(newNotes)
    setActiveNoteId(newNote.id) // Set the new note as active to show overlay
  }

  const closeActiveNote = () => {
    setActiveNoteId(null)
  }

  const updateNote = (id: string, title: string, description: string, color: StickyNoteColor) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, title, description, color } : note)))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const togglePinNote = (id: string) => {
    const note = notes.find((n) => n.id === id)
    if (!note) return

    // If trying to pin and already have 3 pinned notes
    const pinnedCount = notes.filter((n) => n.isPinned).length
    if (!note.isPinned && pinnedCount >= 3) {
      toast({
        title: "Pin limit reached",
        description: "You can only pin up to 3 notes. Unpin a note to pin this one.",
        duration: 3000,
      })
      return
    }

    setNotes(notes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)))
  }

  // Sort notes with pinned ones at the top
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Sticky Notes</h2>
        <button
          onClick={addNote}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/80 hover:bg-white/90 rounded-md text-sm font-medium shadow-sm border border-gray-200"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedNotes.map((note) => (
          <StickyNote
            key={note.id}
            id={note.id}
            title={note.title}
            description={note.description}
            color={note.color}
            isPinned={note.isPinned}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onTogglePin={togglePinNote}
            isExpanded={activeNoteId === note.id}
            onClose={closeActiveNote}
            onOpen={() => setActiveNoteId(note.id)}
          />
        ))}
      </div>
    </div>
  )
}