import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

export * from "./matches";
export * from "./admin";
