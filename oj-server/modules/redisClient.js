const redis = require('redis');
const client = redis.createClient();


function set(key, value, callback){
    client.set(key, value, function(err, res){
        if(err){
            console.log(err);
            return;
        }
        callback(res);
    });
}

function get(key, callback){
    client.get(key, function(err, res){
        if(err){
            console.log(err);
            return;
        }

        callback(res);
    });
}

function quit(){
    client.quit();
}

function expire(key, timeInSecond){
    client.expire(key, timeInSecond);
}

module.exports = {
    get,
    set,
    quit,
    expire,
    redisPrint: redis.print
}