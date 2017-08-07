import { Component, OnInit } from '@angular/core';
import { Problem } from './../../data-structure/problem';
import { DataService } from './../../service/data.service'

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})

export class ProblemListComponent implements OnInit {
  problems: Problem[]
  constructor(private dataService: DataService) { }

  ngOnInit() {
    //this.problems = this.dataService.getProblems();
    this.dataService.getProblems()
      .subscribe(problems => this.problems = problems);
  }

}
