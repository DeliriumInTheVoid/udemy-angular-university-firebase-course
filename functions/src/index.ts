/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//import {onRequest} from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import { createUserApp } from "./create-user";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => { // by default it's "get" request
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const createUser = functions.https.onRequest(createUserApp);

export const onAddCourseUpdatePromoCounter = functions
    // .runWith({
    //     timeoutSeconds: 300,
    //     memory: "128MB",
    // })
    .firestore.onDocumentCreated("courses/{courseId}",  async event => {
        (await import("./promotions-counter/on-add-course")).default(event);
    });

export const onUpdateCourseUpdatePromoCounter = functions
    .firestore.onDocumentUpdated("courses/{courseId}",  async event => {
        (await import("./promotions-counter/on-course-updated")).default(event);
    });

export const onCoursedeletedUpdatePromoCounter = functions
    .firestore.onDocumentDeleted("courses/{courseId}",  async event => {
        (await import("./promotions-counter/on-delete-course")).default(event);
    });