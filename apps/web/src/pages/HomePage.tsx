import React, { useMemo, useEffect } from "react";
import Header from "@/components/Header";
import NoteForm from "@/components/NoteForm";
import NoteCard from "@/components/NoteCard";
import NoteViewDialog from "@/components/NoteViewDialog";
import { useNoteStore } from "@/store/noteStore";
import { FileText, Search, Loader2 } from "lucide-react";

export default function HomePage() {
  const notes = useNoteStore((state) => state.notes);
  const searchQuery = useNoteStore((state) => state.searchQuery);
  const isLoading = useNoteStore((state) => state.isLoading);
  const fetchNotes = useNoteStore((state) => state.fetchNotes);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Compute filtered notes purely derived from state variables
  const filteredNotes = useMemo(() => {
    const safeNotes = notes ?? [];
    if (!searchQuery.trim()) return safeNotes;
    
    const lowerQuery = searchQuery.toLowerCase();
    return safeNotes.filter((note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      (note.content && note.content.toLowerCase().includes(lowerQuery))
    );
  }, [notes, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          
          {/* Left Column: Add Note Form */}
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24">
              <NoteForm />
            </div>
          </aside>
          
          {/* Right Column: Notes List */}
          <section className="md:col-span-8 lg:col-span-9">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Your Notes</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {!isLoading && `${filteredNotes.length} ${filteredNotes.length === 1 ? 'note' : 'notes'}`}
                  {isLoading && "Loading notes..."}
                </p>
              </div>
            </div>

            {/* State: Loading */}
            {isLoading && (!notes || notes.length === 0) ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <h3 className="text-lg font-medium">Loading notes...</h3>
              </div>
            )
            /* State: No Notes Ever Created */
            : (!notes || notes.length === 0) ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center animate-in fade-in-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No notes yet</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Create your first note using the form to get started.
                </p>
              </div>
            )
            /* State: Search yielded no results */
            : filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center animate-in fade-in-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No matching notes found</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  We couldn't find any notes matching "{searchQuery}". Try a different search term.
                </p>
              </div>
            )
            /* State: Normal List Render */
            : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Global Dialog for Viewing/Editing Notes */}
      <NoteViewDialog />
    </div>
  );
}