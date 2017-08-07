const redisClient = require('./../modules/redisClient.js');
const TIMEOUT_IN_SECONDS = 3600;

module.exports = function(io){
    const socketIdToSessionId = {};   //每个用户目前所协同的题目
    const collaborations = {};  //所有正在写作的项目
    const sessionPath = '/ojserver/';   //for redis
    io.on("connection", (socket) => {
        //set up connection
        const sessionId = socket.handshake.query['sessionId'];
        socketIdToSessionId[socket.id] = sessionId; 
        
        //判断是否第一个人进入该题目
        if(sessionId in collaborations){
            //no, add a new id
            collaborations[sessionId]['participants'].push(socket.id);
        }else {
            //yes, set up a participant list
            redisClient.get(sessionPath + sessionId, function(data){
                if(data){
                    //曾经有人进入过，记录还存在
                    collaborations[sessionId] = {
                        participants: [],
                        cachedInstructions: JSON.parse(data)
                    };
                }else{
                    //记录不存在
                    collaborations[sessionId] = {
                        participants: [],
                        cachedInstructions: []
                    };
                }
                //add a new id
                collaborations[sessionId]['participants'].push(socket.id);
            });
        
        }


        socket.on("change", delt => {
            //recevied a event
            //判断当前用户所在的题目
            const sessionId = socketIdToSessionId[socket.id];
            //操作存放入cached中
            if(sessionId in collaborations){
                collaborations[sessionId]['cachedInstructions'].push(
                    ['change', delt, Date.now()]
                );
            }
            //console.log(collaborations[sessionId]['participants']);
            //发送改动给当前所在题目的用户
            forwardEvent(socket.id, "change", delt);
        });

        socket.on("restoreBuffer", () => {
            //using id to get seesionId
            const sessionId = socketIdToSessionId[socket.id];
            if(sessionId in collaborations){
                //geting cache
                const cached = collaborations[sessionId]['cachedInstructions'];
                //循环缓存出发change还原当前缓存信息
                for(ins of cached){
                    //socket.emit("change", delt);
                    socket.emit(ins[0],ins[1]);
                }
            }
        });

        //某个断开链接，在题目中删除该用户
        socket.on("disconnect", () => {
            const sessionId = socketIdToSessionId[socket.id];
            let foundAndRemove = false;
            if(sessionId in collaborations){
                const participants = collaborations[sessionId]['participants'];
                const index = participants.indexOf(socket.id);
                if(index >= 0){//用户存在于该题目的协作中
                    participants.splice(index, 1);
                    foundAndRemove = true;

                    //判断是否人都走光了
                    if(participants.length === 0){
                        const key = sessionPath + sessionId;
                        const value = JSON.stringify(collaborations[sessionId]['cachedInstructions']);
                        //设置缓存
                        redisClient.set(key, value, redisClient.redisPrint);
                        //设置保存时间
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        //删除该题目
                        delete collaborations[sessionId];
                    }
                }
            }else{
                console.log("Don't have this session");
            }

            if(!foundAndRemove){
                console.log("delete user fail, Don't have this participant");
            }
        });

        socket.on("cursorMove", cursor => {
            cursor = JSON.parse(cursor);

            cursor['socketId'] = socket.id;
            //console.log(cursor['socketId']);

            forwardEvent(socket.id, "cursorMove", JSON.stringify(cursor));
        })
    });

    //发送事件给当前题目所有用户（除改动的用户）
    const forwardEvent = function(socketId, eventName, dataString) {
        const sessionId = socketIdToSessionId[socketId];
        if(sessionId in collaborations){
            const participants = collaborations[sessionId]['participants'];
            for(let item of participants){
                if(item != socketId){
                    //console.log("bbbb");
                    io.to(item).emit(eventName, dataString);
                }
            }
        }else{
            console.log("This is sessionId is not include in collaboration");
        }
    }
}