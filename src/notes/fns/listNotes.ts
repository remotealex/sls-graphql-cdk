import * as AWS from "aws-sdk";

import { NotesTableName } from "../constants";

const docClient = new AWS.DynamoDB.DocumentClient();

export async function listNotes() {
  const params = { TableName: NotesTableName };

  try {
    const data = await docClient.scan(params).promise();
    return data.Items;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}
