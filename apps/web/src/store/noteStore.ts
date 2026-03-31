import { create } from 'zustand';
import { Note } from '@/types/notes';
import { api } from '@/lib/api';

export interface NoteState {
  notes: Note[];
  searchQuery: string;
  selectedNoteId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, updatedFields: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedNoteId: (id: string | null) => void;
  getNoteById: (id: string) => Note | undefined;
}

export const useNoteStore = create<NoteState>()((set, get) => ({
  notes: [],
  searchQuery: "",
  selectedNoteId: null,
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get<{ data: Note[] }>('/notes');
      set({ notes: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addNote: async (title, content) => {
    try {
      const { data } = await api.post<{ data: Note }>('/notes', { title, content });
      set((state) => ({
        notes: [data, ...(state.notes ?? [])],
      }));
    } catch (error: any) {
      console.error('Failed to add note:', error);
      throw error;
    }
  },

  updateNote: async (id, updatedFields) => {
    try {
      const { data } = await api.put<{ data: Note }>(`/notes/${id}`, updatedFields);
      set((state) => ({
        notes: (state.notes ?? []).map((note) =>
          note.id === id ? data : note
        ),
      }));
    } catch (error: any) {
      console.error('Failed to update note:', error);
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: (state.notes ?? []).filter((note) => note.id !== id),
        selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId,
      }));
    } catch (error: any) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  getNoteById: (id) => (get().notes ?? []).find((note) => note.id === id),
}));