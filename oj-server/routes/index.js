const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", function(res, req){
    req.sendFile("index.html", {root: path.join(__dirname, "../../public/")});
})

module.exports = router;