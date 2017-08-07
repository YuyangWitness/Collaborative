const express = require("express");
const router = express.Router();
const problemService = require("./../services/problemService.js");
const bodyParser = require("body-parser");
const nodeRestClient = require("node-rest-client").Client;
const restClient = new nodeRestClient();
const jsonParser = bodyParser.json();

const EXECUTOR_SERVER_URL = 'http://localhost:80/build_and_run';

//注册端口方法
restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');


//GET api/v1/problems
router.get("/problems", function(req, res){
    problemService.getProblems()
        .then(problems => res.json(problems));
});

//GET api/v1/problems/:id
router.get("/problems/:id", function(req, res){
    //+转换成nubmer类型
    problemService.getProblem(+req.params.id)
        .then(problem => res.json(problem));
});

//POST api/v1/problem
router.post("/problem", jsonParser, function(req, res){
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem);
        },error => {
            res.status(400).send('Problem name alreay exist');
        });
});

//POST api/v1/build_and_run
router.post("/build_and_run", jsonParser, function(req, res){
    const userCodes = req.body.userCodes;
    const lang = req.body.lang;
    //console.log(userCodes,lang);
    // res.json({
    //     text: "this response from server"
    // });
    restClient.methods.build_and_run(
        {
            data: {
                code: userCodes,
                lang: lang
            },
            headers: {
                'Content-Type': 'application/json'
            }
        },
        (data, response) => {
            console.log("received response from executor server: ");
            
            const text = `build output: ${data['build']}    executor output: ${data['run']} `;
            console.log('text is...', text);
            data['text'] = text;
            res.json(data);
        }
    );
});
module.exports = router;