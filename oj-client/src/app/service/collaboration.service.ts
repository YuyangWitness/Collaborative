import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/colors'

declare const io: any;
declare const ace: any;
@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  clientsInfo: Object = {};
  clientNum: number = 0;
  constructor() { }

  //初始化
  init(sessionId: string, editor: any){
    //set up connection
    //console.log(sessionId);
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});
    
    //监听socket的change事件
    this.collaborationSocket.on("change", (delt: string) => {
      delt = JSON.parse(delt);
      //更新最后操作
      editor.lastAppliedChange = delt;
      //在editor中进行该操作
      editor.getSession().getDocument().applyDeltas([delt]);
    });

    //监听socket的cursorMove事件
    this.collaborationSocket.on("cursorMove", (delta: string) => {
      const cursor = JSON.parse(delta);
      const session = editor.getSession();
      //获取坐标
      const x = cursor['row'];
      const y = cursor['column'];
      console.log(cursor);
      const changeClientId = cursor['socketId'];
    
      //判断是否存在与socket一致的marker
      if(changeClientId in this.clientsInfo){
        //删除该ID原先的marker
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
      } else {
        //新建一个新的CSS对象
        this.clientsInfo[changeClientId] = {};
        const css = document.createElement("style");
        css.type = 'text/css';
        css.innerHTML = '.editor_cursor_' + changeClientId
           + '{ position: absolute; background: ' + COLORS[this.clientNum] + ';'
          + 'z-index: 100; width: 3px !important; }';
        
        document.body.appendChild(css);
        this.clientNum++;
      }
      //插入新的marker
      const range = ace.require("ace/range").Range;
      const newMarker = session.addMarker(new range(x,y,x,y+1),
                                          'editor_cursor_' + changeClientId,
                                          true);
      this.clientsInfo[changeClientId]['marker'] = newMarker;

    });
  }

  //触发change事件，服务器socket响应
  change(delta: string){
    this.collaborationSocket.emit("change", delta);
  }

  //触发cursorMove事件，服务器socket响应
  cursorMove(delta: string){
    this.collaborationSocket.emit("cursorMove", delta);
  }

  restoreBuffer(): void{
    this.collaborationSocket.emit("restoreBuffer");
  }

}
