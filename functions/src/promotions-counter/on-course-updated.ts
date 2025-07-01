import * as functions from "firebase-functions";
import { FieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "../init";
import { FirestoreEvent } from "firebase-functions/firestore";

export default (event: FirestoreEvent<functions.Change<QueryDocumentSnapshot> | undefined, functions.ParamsOf<string>>) => {
    functions.logger.debug("Running update course trigger for courseId", event.params.courseId);

    if (event.params.courseId == "stats") {
        return;
    }

    const newCourse = event.data?.after.data();
    const oldCourse = event.data?.before.data();
    
    let increment = 0;

    if (!oldCourse?.promo && newCourse?.promo) {
        increment = 1;
    }
    else if (oldCourse?.promo && !newCourse?.promo) {
        increment = -1;
    }

    if (increment == 0) {
        return;
    }
    
    return db.doc(`courses/stats`).update({
        totalPromo: FieldValue.increment(increment)
    });
}
