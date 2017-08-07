import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import { Problem } from './../../data-structure/problem'
import { DataService } from './../../service/data.service'

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem;
  problems: Problem[];
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      //Add a plus before a variable, Changing this variable become number type
      this.dataService.getOneProblem(+params.id)
        .then(problem => this.problem = problem)
        .catch(error => console.log(error.body));
    })
  }

}
