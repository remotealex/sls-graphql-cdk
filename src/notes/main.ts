import { Note } from "./interfaces/Note";
import { createNote, deleteNote, getNoteById, updateNote } from "./fns";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    noteId: string;
    note: Note;
  };
};

// This switch statement routes all of the lambda based operations
// for this resolver
export async function handler(event: AppSyncEvent) {
  switch (event.info.fieldName) {
    case "getNoteById":
      return await getNoteById(event.arguments.noteId);
    case "createNote":
      return await createNote(event.arguments.note);
    case "deleteNote":
      return await deleteNote(event.arguments.noteId);
    case "updateNote":
      return await updateNote(event.arguments.note);
    default:
      return null;
  }
}
