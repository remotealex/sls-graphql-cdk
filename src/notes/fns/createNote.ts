import * as AWS from "aws-sdk";

import { NotesTableName } from "../constants";
import { Note } from "../interfaces/Note";

const docClient = new AWS.DynamoDB.DocumentClient();

export async function createNote(note: Note) {
  const params = { TableName: NotesTableName, Item: note };

  try {
    await docClient.put(params).promise();
    return note;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}
