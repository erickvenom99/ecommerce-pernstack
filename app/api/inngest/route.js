import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { syncUserCreation, syncUserDelete, syncUserUpdate } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDelete
  ],
  signingKey: process.env.INNGEST_SIGNING_KEY,
  
  // This explicitly ensures the framework handles local connection tuning safely
  streaming: "allow",
});