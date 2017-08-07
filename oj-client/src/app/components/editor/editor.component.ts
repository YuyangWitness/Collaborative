import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CollaborationService } from './../../service/collaboration.service'
import { DataService } from './../../service/data.service'

declare const ace: any
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  sessionId: string
  editor: any;
  languages: string[] = ['Java', 'Python', 'JavaScript'];
  language: string = 'Java';
  defaultContent = {
    'Java': `public class Example {
    public static void main(String[] args) { 
    // Type your Java code here 
    } 
}`,
    'Python': `class Solution: 
    def example(): 
    # Write your Python code here`,
    'JavaScript': `function example(){

}`
  };
  output: string = '';

  constructor(private collaborationservice: CollaborationService,
    private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    //初始化获取题目id
    this.route.params.subscribe(params => {
        this.sessionId = params['id'];
        //console.log(this.sessionId);
        this.initEditor();
    })
    
  }

  //初始化ace
  initEditor(){
    //initEditor, Language='Java'
    this.editor = ace.edit("editor");
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme("ace/theme/eclipse");
    this.restLanguage();
    
    // set mouse focus in ace editor
    document.getElementsByTagName('textarea')[0].focus();

    //init socket
    this.collaborationservice.init(this.sessionId, this.editor);

    //上次改动的信息
    this.editor.lastAppliedChange = null;
        // register change event handler
    this.editor.on('change', e => {
      //console.log(this.editor.getValue());
      //判断当前改动是否不等于上次改动
      if(this.editor.lastAppliedChange != e){
        this.collaborationservice.change(JSON.stringify(e));
      }

    });

    this.editor.getSession().getSelection().on("changeCursor", () => {
      const cursor = this.editor.getSession().getSelection().getCursor();
      //console.log(cursor);
      this.collaborationservice.cursorMove(JSON.stringify(cursor));
    })

    //获取缓存
    this.collaborationservice.restoreBuffer();
  }

  //根据select来change语言
  setLanguage(language: string): void{
    this.language = language;
    this.restLanguage();
  }

  //重新设置语言
  restLanguage(){
    this.editor.getSession().setMode(`ace/mode/${this.language.toLowerCase()}`);
    this.editor.setValue(this.defaultContent[`${this.language}`]);
    this.output = '';
  }

  //重置editor信息
  resetEditor(){
    this.editor.setValue(this.defaultContent[`${this.language}`]);
    this.output = ''
  }

  submit(){
    const code = {
      userCodes: this.editor.getValue(),
      lang: this.language.toLowerCase()
    };
    console.log(code.lang);
    this.dataService.buildAndRun(code)
      .then(res => {
        this.output = res.text;
      });
  }

}
