import fetch from "node-fetch";

import { apiUrl } from "../constants";

export async function listUsers() {
  try {
    const response = await fetch(apiUrl + "/users");
    const users = await response.json();
    return users;
  } catch (err) {
    console.log("Fetch error: ", err);
    return null;
  }
}
