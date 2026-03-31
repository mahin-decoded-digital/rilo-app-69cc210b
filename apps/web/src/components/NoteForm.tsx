import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNoteStore } from "@/store/noteStore";
import { Plus, Loader2 } from "lucide-react";

export default function NoteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addNote = useNoteStore((state) => state.addNote);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setIsSubmitting(true);
    try {
      await addNote(trimmedTitle, content.trim());
      // Reset form fields after successful submission
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to add note", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
          className="text-base"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your note here... (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          className="min-h-[100px] resize-y text-base"
        />
      </div>

      <Button 
        type="submit" 
        disabled={!title.trim() || isSubmitting} 
        className="self-start sm:w-auto w-full"
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {isSubmitting ? "Adding..." : "Add Note"}
      </Button>
    </form>
  );
}