import * as AWS from "aws-sdk";

import { NotesTableName } from "../constants";

const docClient = new AWS.DynamoDB.DocumentClient();

export async function getNoteById(noteId: string) {
  const params = { TableName: NotesTableName, Key: { id: noteId } };

  try {
    const { Item } = await docClient.get(params).promise();
    return Item;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}
