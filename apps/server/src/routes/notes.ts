import { Router, Request, Response } from 'express';
import { db } from '../lib/db';
import type { Note } from '../models/note';

const router = Router();
const notesCollection = db.collection('notes');

// Map db doc to Note interface
const mapNote = (doc: any): Note => ({
  id: doc._id,
  title: doc.title,
  content: doc.content,
  createdAt: doc.createdAt,
});

// GET /api/notes
router.get('/', async (req: Request, res: Response) => {
  try {
    const docs = await notesCollection.find();
    // Sort by createdAt descending (newest first)
    const notes = docs.map(mapNote).sort((a, b) => b.createdAt - a.createdAt);
    res.json({ data: notes });
  } catch (error: any) {
    console.error('[notes route] Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Valid title is required' });
    }

    const newNote = {
      title: title.trim(),
      content: content ? content.trim() : '',
      createdAt: Date.now(),
    };

    const insertedId = await notesCollection.insertOne(newNote);
    const createdNote = mapNote({ _id: insertedId, ...newNote });
    
    res.status(201).json({ data: createdNote });
  } catch (error: any) {
    console.error('[notes route] Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const existingNote = await notesCollection.findById(id as string);
    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updatedFields: Record<string, any> = {};
    if (title !== undefined) updatedFields.title = title.trim();
    if (content !== undefined) updatedFields.content = content.trim();

    await notesCollection.updateOne(id as string, updatedFields);
    
    const updatedNote = mapNote({ ...existingNote, ...updatedFields });
    res.json({ data: updatedNote });
  } catch (error: any) {
    console.error('[notes route] Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await notesCollection.deleteOne(id as string);
    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ data: { success: true } });
  } catch (error: any) {
    console.error('[notes route] Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;