import * as AWS from "aws-sdk";

import { NotesTableName } from "../constants";

const docClient = new AWS.DynamoDB.DocumentClient();

export async function deleteNote(noteId: string) {
  const params = {
    TableName: NotesTableName,
    Key: {
      id: noteId,
    },
  };

  try {
    await docClient.delete(params).promise();
    return noteId;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}
