import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNoteStore } from "@/store/noteStore";
import { Note } from "@/types/notes";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const deleteNote = useNoteStore((state) => state.deleteNote);
  const setSelectedNoteId = useNoteStore((state) => state.setSelectedNoteId);

  const handleViewEdit = () => {
    setSelectedNoteId(note.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id);
    }
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card
      className="group relative flex h-full flex-col justify-between cursor-pointer overflow-hidden transition-all hover:border-primary/50 hover:shadow-sm"
      onClick={handleViewEdit}
    >
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-2 text-lg leading-tight">
            {note.title}
          </CardTitle>
          <div className="text-xs text-muted-foreground mt-1">
            {formattedDate}
          </div>
        </CardHeader>
        {note.content && (
          <CardContent className="pb-3 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">
              {note.content}
            </p>
          </CardContent>
        )}
      </div>
      <CardFooter className="pt-2 pb-3 px-4 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            handleViewEdit();
          }}
          title="Edit Note"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          title="Delete Note"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}