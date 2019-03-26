import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {

    public comment = {
        user: 'Cornelia',
        content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.',
        created: '12.3.2019 13:51',
    };

  public constructor() { }

  public ngOnInit() {
  }

}
