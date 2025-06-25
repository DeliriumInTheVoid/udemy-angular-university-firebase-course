import {Component, OnInit} from '@angular/core';


import 'firebase/firestore';

import {AngularFirestore} from '@angular/fire/firestore';
import {COURSES, findLessonsForCourse} from './db-data';
import { take } from 'rxjs/operators';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    constructor(private db: AngularFirestore) {
    }

    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = {...data};
        delete newData.id;
        return newData;
    }


    onReadDoc() {
        this.db.doc("/courses/4iOhNuucRZVdPYQCO6GV")
        .get()
        .subscribe(snap => {
            console.log(snap.id);
            console.log(snap.data());
        });
    }

    onWatchDoc() {
        this.db.doc("/courses/4iOhNuucRZVdPYQCO6GV")
        .snapshotChanges()
        // same as get(), dies after receiving first responce 
        // .pipe(
        //     take(1) // or first()
        // )
        .subscribe(snap => {
            console.log(snap.payload.id);
            console.log(snap.payload.data());
        });

        this.db.doc("/courses/4iOhNuucRZVdPYQCO6GV")
        .valueChanges()
        .subscribe(doc => {
            console.log(doc);
        });
    }

    onReadCollection() {
        this.db.collection(
            "courses",
            ref => ref
            .where("seqNo", "<=", 20)
            .where("url", "==", "angular-forms-course")
            .orderBy("seqNo")
        ).get()
        .subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            })
        });

        /*
        Firestore ensures that every query that we run against the database is going to be backed by one index,
        and that's where the performance guarantees of the Firestore database come from, because every single

        .where("seqNo", "<=", 20)
        .where("url", "==", "angular-forms-course")

        ERROR FirebaseError: The query requires an index. You can create it here: 
        https://console.firebase.google.com/v1/r/project/udemy-firebase-in-depth...
        */


        /*
        .where("seqNo", "<=", 5)
        .where("lessonCount", "<=", 10)

        ERROR FirebaseError: Invalid query.
        All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field.
        But you have inequality filters on 'seqNo' and 'lessonCount'
        */
    }

    onReadLessons() {
        this.db.collection(
            "/courses/6HKzBrdpYMorwSeTMW1n/lessons",
            //ref => ref.where("seqNo", "==", 1)
            ref => ref.where("seqNo", "<=", 5).orderBy("seqNo")
        ).get()
        .subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            })
        });
    }

    onReadCollectionGroup() {
        this.db.collectionGroup(
            "lessons",
            ref => ref.where("seqNo", "==", 1)
        )
        .get()
        .subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data());
            })
        });
    }
}
















