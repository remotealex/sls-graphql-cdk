import { listUsers } from "./fns";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {};
};

export async function handler(event: AppSyncEvent) {
  switch (event.info.fieldName) {
    case "listUsers":
      return await listUsers();
    default:
      return null;
  }
}
