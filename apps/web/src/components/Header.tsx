import React from "react";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNoteStore } from "@/store/noteStore";

export default function Header() {
  const searchQuery = useNoteStore((state) => state.searchQuery);
  const setSearchQuery = useNoteStore((state) => state.setSearchQuery);

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            My Notes
          </h1>
        </div>

        <div className="relative w-full max-w-sm ml-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-9 w-full rounded-full bg-muted/50 border-transparent focus-visible:bg-background"
            value={searchQuery ?? ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}