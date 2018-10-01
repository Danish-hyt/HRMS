import { Component, OnInit } from '@angular/core';
import { TimeSheet, Date } from './timeSheet';
import { NgbModal, NgbModalRef, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  modalReference: NgbModalRef;
  closeResult: string;
  timeSheet: TimeSheet[] = [];
  data: TimeSheet;
  now = new Date();
  date: Date;
  options: String;
  mode: string;
  id: string;

  constructor(private modalService: NgbModal, private http: HttpClient, private ngbDateParserFormatter: NgbDateParserFormatter) {
    this.options = 'HR';
    this.mode = 'Save';
    this.data = {
          date: '',
          dateObj: {
            year: this.now.getFullYear(),
            month: this.now.getMonth() + 1,
            day: this.now.getDate()
          },
          project: '',
          task: '',
          hours: 0
        };
    this.date = {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate()
    };
    this.http.get('http://localhost:3000/api/data').toPromise().then(res => {
      this.timeSheet = res['data'][0];
      console.log(this.timeSheet);
    }, err => {
      console.log(err);
    });
    // .toPromise().then(res => {
    //   this.timeSheet = res['data'];
    // });
  }

  ngOnInit() {}

  open(content, arg, d, t, i) {
    this.date = {
      year: this.now.getFullYear(),
      month: this.now.getMonth() + 1,
      day: this.now.getDate()
    };
    if (arg === 'new') {
      this.mode = 'Save';
      this.data = {
        date: '',
        dateObj: {
          year: this.now.getFullYear(),
          month: this.now.getMonth() + 1,
          day: this.now.getDate()
        },
        project: '',
        task: '',
        hours: 0
      };
    } else if (arg === 'edit') {
      this.date = {
        year: t.dateObj.year,
        month: t.dateObj.month,
        day: t.dateObj.day
      };
      this.id = t._id;
      this.mode = 'Update';
      this.data = {
        date: new Date(t.dateObj.year + '-' + t.dateObj.month + '-' + t.dateObj.day).toISOString(),
        dateObj: {
          year: t.dateObj.year,
          month: t.dateObj.month,
          day: t.dateObj.day
        },
        project: t.projects[i].name,
        task: t.task,
        hours: t.projects[i][d].totalHours
      };
    }
    this.modalReference = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  onSubmit(data) {
    console.log(data.value);
    this.modalReference.close('Save click');
    this.timeSheet = [{
      date: new Date(data.value.dp.year + '-' + data.value.dp.month + '-' + data.value.dp.day).toISOString(),
      dateObj: {
        year: data.value.dp.year,
        month: data.value.dp.month,
        day: data.value.dp.day
      },
      project: data.value.project,
      task: data.value.task,
      hours: data.value.hours
    }];
    if (this.mode === 'Save') {
      this.http.post('http://localhost:3000/api/save', this.timeSheet[0]).subscribe(res => {
        this.timeSheet = res['data'];
      }, err => {
        console.log(err);
      });
    } else if (this.mode === 'Update') {
      this.http.post('http://localhost:3000/api/edit/' + this.id, this.timeSheet[0]).subscribe(res => {
        this.timeSheet = res['data'];
      }, err => {
        console.log(err);
      });
    }
  }

}
