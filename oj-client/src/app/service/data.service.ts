import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx'

import 'rxjs/add/operator/toPromise'
import { Problem } from './../data-structure/problem';
import { PROBLEMS } from './../mock-problems';

@Injectable()
export class DataService {
  //problems: Problem[] = PROBLEMS;
  private _problemSource = new BehaviorSubject<Problem[]>([]);
  constructor(private http: Http) { }

  //get all problem function
  getProblems(): Observable<Problem[]>{
    //return this.problems;
    this.http.get("api/v1/problems")
      .toPromise()
      .then((res: Response) => {
        this._problemSource.next(res.json());
      })
      .catch(this.handleError);
    return this._problemSource;
    
  }

  //get one of problems function
  getOneProblem(id: number){
    // ES6 feature
    //return this.problems.find( (problem) => problem.id === id );

    return this.http.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: Response) => {
        this.getProblems();
        return res.json();
      })
      .catch(this.handleError);
  }  

  addProblem(problem: Problem){
    // problem.id = this.problems.length + 1;
    // this.problems.push(problem);
    const headers = new Headers({'content-type': 'application/json'});
    return this.http.post('api/v1/problem', problem, headers)
      .toPromise()
      .then((res: Response) => {
        this.getProblems();
        return res.json();
      })
      .catch(this.handleError);
  }

  buildAndRun(code: any){
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('api/v1/build_and_run', code, headers)
      .toPromise()
      .then((res:Response) => {
        console.log(res.json().text);
        return res.json();
      })
  }

  handleError(error: any): Promise<any>{
      console.error("An error occured", error);
      alert(error._body);
      return Promise.reject(error);
  }

}