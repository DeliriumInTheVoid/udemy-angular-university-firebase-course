import { Injectable } from "@angular/core";
import { Course } from "../model/course";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { CoursesService } from "./courses.service";

@Injectable({
    providedIn: "root"
})
//CourseResolver has to be add to the app-routing-module.ts for 'courses/:courseUrl' path
export class CourseResolver implements Resolve<Course> {

    constructor(private coursesService: CoursesService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
        //from app-routing-module.ts
        //{
        //  path: 'courses/:courseUrl', // courseUrl - will be used to get value
        //  component: CourseComponent
        //},
        const courseUrl = route.paramMap.get("courseUrl");

        return this.coursesService.findCourseByUrl(courseUrl);

    }
}