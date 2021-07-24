const express = require('express');
var app = express();
var router = express.Router();
var mysql = require('mysql');
var path = require('path');

router.get('/', function(req, res){
    var responseData = {
        "check": true,
        "code": 200,
        "menu":[
            {"일자":"2021-07-01", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-02", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-03", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-04", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-05", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-06", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-07", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-08", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-09", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-10", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-11", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-12", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-13", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-14", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-15", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-16", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-17", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-18", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-19", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-20", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-21", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-22", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-23", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-24", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-25", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-26", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-27", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-28", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-29", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-30", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
            {"일자":"2021-07-31", "아침":[["쌀밥","콩나물국","스팸구이","감자볶음"],["쌀밥","콩나물국","스팸구이","감자볶음"]], "점심":[["쌀밥","된장찌개"," 불고기","배추김치"],["쌀밥","된장찌개"," 불고기","배추김치"]], "저녁":[["보리밥","미역국","계란말이","소세지볶음"],["보리밥","미역국","계란말이","소세지볶음"]]},
        ]  
    };
    res.json(responseData);
});


module.exports = router;









