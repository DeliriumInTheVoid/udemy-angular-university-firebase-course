import * as functions from "firebase-functions";
import { FieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "../init";
import { FirestoreEvent } from "firebase-functions/firestore";

export default (event: FirestoreEvent<QueryDocumentSnapshot | undefined, functions.ParamsOf<string>>) => {
    functions.logger.debug("Running delete course trigger for courseId", event.params.courseId);

    if (event.params.courseId == "stats") {
        return;
    }

    const course = event.data?.data();

    if (!course?.promo) {
        return;
    }
    
    return db.doc(`courses/stats`).update({
        totalPromo: FieldValue.increment(-1)
    });
}
