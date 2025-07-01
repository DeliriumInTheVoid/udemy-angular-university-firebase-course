import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../init";

export default (event) => {
    functions.logger.debug("Running add course trigger for courseId", event.params.courseId);

    const course = event.data?.data();

    if (course?.promo) {
        db.runTransaction(async transaction => {
            // const couterRef = db.doc("courses/stats");
            // const snap = await transaction.get(couterRef);
            // const stats = snap.data() ?? {totalPromo: 0};
            // stats.totalPromo += 1;
            // transaction.set(couterRef, stats);

            //the same as "update()"

            return db.doc("courses/stats").update({
                totalPromo: FieldValue.increment(1)
            });
        });
    }
    
}