import React, { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNoteStore } from "@/store/noteStore";

export default function NoteViewDialog() {
  const selectedNoteId = useNoteStore((state) => state.selectedNoteId);
  const setSelectedNoteId = useNoteStore((state) => state.setSelectedNoteId);
  const updateNote = useNoteStore((state) => state.updateNote);
  const deleteNote = useNoteStore((state) => state.deleteNote);
  const notes = useNoteStore((state) => state.notes);

  // Find the selected note from the reactive notes array
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync local state when a note is selected or changed externally
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || "");
      setContent(selectedNote.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedNote]);

  const isOpen = selectedNoteId !== null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedNoteId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNoteId || !title.trim()) return;
    
    setIsSubmitting(true);
    try {
      await updateNote(selectedNoteId, { title: title.trim(), content });
      setSelectedNoteId(null);
    } catch (error) {
      console.error("Failed to update note", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNoteId) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      setIsSubmitting(true);
      try {
        await deleteNote(selectedNoteId);
        setSelectedNoteId(null);
      } catch (error) {
        console.error("Failed to delete note", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px] flex flex-col max-h-[90vh]">
        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <DialogHeader>
            <DialogTitle>View & Edit Note</DialogTitle>
            <DialogDescription>
              Update your note's title and contents below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-5 py-4 overflow-y-auto px-1">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid gap-2 flex-1">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content here..."
                disabled={isSubmitting}
                className="min-h-[250px] resize-none"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedNote && (
                <p>Created: {new Date(selectedNote.createdAt).toLocaleString()}</p>
              )}
            </div>
          </div>

          <Separator className="my-4" />
          
          <DialogFooter className="flex items-center sm:justify-between w-full gap-2 sm:gap-0">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="gap-2 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedNoteId(null)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="gap-2 flex-1 sm:flex-none"
                disabled={!title.trim() || isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}