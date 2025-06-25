import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  course: Course;
  lessons: Lesson[]; //<mat-table class="lessons-table mat-elevation-z8" [dataSource]="lessons">

  loading = false;

  lastPageLoaded = 0;

  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService) {

  }

  ngOnInit() {
    //data filled by resolvers from app-routing-module.ts
    this.course = this.route.snapshot.data["course"];

    this.loading = true;

    this.coursesService.findLessons(this.course.id)
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe(
      lessons => this.lessons = lessons
    );
  }

  loadMore() {
    this.lastPageLoaded++;

    this.loading = true;

    this.coursesService.findLessons(this.course.id, "asc", this.lastPageLoaded)
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe(
      lessons => this.lessons = this.lessons.concat(lessons)
    );
  }

}
