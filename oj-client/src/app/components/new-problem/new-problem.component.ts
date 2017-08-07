import { Component, OnInit } from '@angular/core';
import { Problem } from './../../data-structure/problem'
import { DataService } from './../../service/data.service'

//初始化不可更改的对象
const DEFAULT_PROBLEM = Object.freeze({
  id: 0,
  name: 'Problem Name',
  desc: 'Problem Description',
  difficulty: 'easy'
});

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  //完全复制一个对象
  newProblem: Problem = Object.assign({},DEFAULT_PROBLEM);
  difficulties: string[] = ['easy','medium','hard','super'];
  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  addProblem(){
    this.dataService.addProblem(this.newProblem)
      .catch(error => console.log(error.body));
      
    this.newProblem = Object.assign({},DEFAULT_PROBLEM);
  }

}
