import { Component, OnInit, Input } from '@angular/core';
import { ProjectInterface } from 'src/app/shared/interfaces/user-data.interface';

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

  @Input() project: ProjectInterface;

  constructor() { }

  ngOnInit() { }

}
