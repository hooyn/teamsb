const express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
var fs = require('fs');
const admin = require('firebase-admin')

//DATABASE SETTING
var teamsbDB = {
    host : '13.209.10.30',
    port : 3306,
    user : 'root',
    password : 'owner9809~',
    database : 'teamsb',
    dateStrings : 'date'
  };
  var connection
  function handleDisconnect() {
      connection = mysql.createConnection(teamsbDB); 
      connection.connect(function(err) {            
        if(err) {                            
          console.error('error when connecting to db:' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
          setTimeout(handleDisconnect, 2000); 
        }                                   
      });                                 
                                             
      connection.on('error', function(err) {
        console.error('db error' + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
          return handleDisconnect();                      
        } else {                                    
          throw err;                              
        }
      });
    }
  
handleDisconnect();

//ACCESS ROUTER REPLY
router.post('/write', function(req, res){
    var responseData = {};
    var article_no = req.body.article_no;
    var content = req.body.content;
    var curUser = req.body.curUser;
    var nickname;

    var query = connection.query('select * from user where id=?',[curUser],function(err, rows_u){
        if(err) throw err;
        if(rows_u[0]){
            nickname = rows_u[0].nickname;
            var query = connection.query('select * from articlelist where no=?',[article_no], function(err, rows_a){
                if(err) throw err;
                if(rows_a[0]){
                    var replyCount = rows_a[0].replyCount;
                    var query = connection.query('insert into replylist(article_no, content, userId, userNickname, token) values (?, ?, ?, ?, ?)',[article_no, content, curUser, nickname, rows_u[0].token], function(err, rows){
                        if(err) throw err;
                        connection.query('update articlelist set replyCount=? where no=?',[replyCount+1, article_no],function(err,rows){
                            if(err) throw err;
                        })
                        //----------------<notification DB 저장>-----------------//
                        var sql = 'select distinct(userId) from replylist where article_no=?';


                        //----------------<FCM 알림 보내기>-----------------//
                        var user_tokens = [];
                        var user_id = [];
                        var sql = 'select token, userId from replylist where article_no=? group by token, userId ';
                        connection.query(sql,[article_no],function(err,rows){
                            if(err) throw err;
                            user_tokens.push(rows_a[0].token);
                            user_id.push(rows_a[0].userId)
                            for(var i = 0; i<rows.length;i++){
                                if (rows[i]/*기존 댓글을 단 사용자*/.token==null){ 
                                    continue;
                                } else if (rows[i]/*기존 댓글을 단 사용자*/.token==rows_u[0].token/*현재 댓글을 단 사용자*/){
                                    continue;
                                } else if (rows[i].token==rows_a[0].token){
                                    continue;
                                } else if (rows[i].token==user_tokens[0]){
                                    continue;
                                } else {
                                  user_tokens.push(rows[i].token);
                                  user_id.push(rows[i].userId)
                                }
                            }
                            if(rows_u[0].token/*현재 댓글을 단 사용자*/==rows_a[0]/*글 작성한 사용자*/.token){
                                user_tokens.shift();
                                user_id.shift();
                            }
                            for(var i=0;i<user_id.length;i++){
                                var sql = 'insert into notificationlist(article_no, userId, curUser, nickname, title, content) values(?, ?, ?, ?, ?, ?)';
                                connection.query(sql, [article_no, user_id[i], curUser, nickname, '님이 게시물에 댓글을 작성했습니다', content ], function(err,rows){
                                    if(err) throw err;
                                })
                            }
                            if(user_tokens==""){
                                console.log("[reply/write] [" + curUser + "] 사용자 댓글이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                                responseData.check = true;
                                responseData.code = 200;
                                responseData.message = '댓글이 저장되었습니다.';
                                return res.json(responseData);
                            }
                            else if(user_tokens.length==1){
                                let target_token = user_tokens[0];
                                let message = {
                                    notification: {
                                        title: nickname + '님이 게시물에 댓글을 작성했습니다',
                                        body: content
                                    },
                                    android: {
                                    },
                                    apns: {
                                    headers:{
                                        "apns-collapse-id": nickname + '님이 게시물에 댓글을 작성했습니다',
                                        "content-available": "1",
                                        "apns-priority": "10",
                                        },
                                    payload:{
                                        aps:{
                                            sound: 'default',
                                            badge: 0
                                        }
                                        }
                                    },
                                    data: {
                                        title: nickname + '님이 게시물에 댓글을 작성했습니다',
                                        body: content
                                    },
                                    token: target_token
                                }
                                admin
                                .messaging()
                                .send(message)
                                .then(function (response) {
                                    console.log("[reply/write] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                                })
                                .catch(function (err) {
                                    console.log("[reply/write] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                                })
                                console.log("[reply/write] [" + curUser + "] 사용자 댓글이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                                responseData.check = true;
                                responseData.code = 200;
                                responseData.message = '댓글이 저장되었습니다.';
                                return res.json(responseData);
                            } else {
                                console.log("[reply/write] [token] : " + user_id + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                                let target_token = user_tokens;
                                let message = {
                                    notification: {
                                        title: nickname + '님이 게시물에 댓글을 작성했습니다',
                                        body: content
                                    },
                                    android: {
                                    },
                                    apns: {
                                    headers:{
                                        "apns-collapse-id": nickname + '님이 게시물에 댓글을 작성했습니다',
                                        "content-available": "1",
                                        "apns-priority": "10",
                                        },
                                    payload:{
                                        aps:{
                                            sound: 'default',
                                            badge: 0
                                        }
                                        }
                                    },
                                    data: {
                                        title: nickname + '님이 게시물에 댓글을 작성했습니다',
                                        body: content
                                    },
                                    tokens: target_token
                                }
                                admin
                                .messaging()
                                .sendMulticast(message)
                                .then(function (response) {
                                    console.log("[reply/write] Successfully sent message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , response);
                                })
                                .catch(function (err) {
                                    console.log("[reply/write] Error Sending message" + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " , err);
                                })
                                console.log("[reply/write] [" + curUser + "] 사용자 댓글이 저장되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] ")
                                responseData.check = true;
                                responseData.code = 200;
                                responseData.message = '댓글이 저장되었습니다.';
                                return res.json(responseData);
                            }
                        })
                        //-------------------------------------------------//
                        
                    })
                }
                else{
                    console.log("[reply/write] [" + article_no + "] 번 게시글을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = false;
                    responseData.code = 302;
                    responseData.message = '게시글을 찾을 수 없습니다.';
                    return res.json(responseData);
                }
            })
        }
        else{
            console.log("[reply/write] [" + curUser + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
});

router.post('/modify', function(req, res){
    var responseData = {};
    var reply_no = req.body.reply_no;
    var content = req.body.content;
    var curUser = req.body.curUser;
    var userId;

    var query = connection.query('select * from replylist where reply_no=?',[reply_no],function(err, rows_r){
        if(err) throw err;
        if(rows_r){
            if(!content){
                console.log("[reply/modify] 댓글 내용을 입력해주세요." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " 
)
                responseData.check = false;
                responseData.code = 303
                responseData.message = '댓글 내용을 입력해주세요.';
                return res.json(responseData);
            }
            userId = rows_r[0].userId;
            if(userId==curUser){
                var query = connection.query('update replylist set content=? where reply_no=?', [content, reply_no], function(err, rows){
                    if(err) throw err;
                    console.log("[reply/modify] [" + curUser + "] 사용자 댓글이 수정되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '댓글이 수정되었습니다.';
                    return res.json(responseData);
                })
            }
            else{
                console.log("[reply/modify] [" + curUser + "] 사용자 댓글 작성자가 아닙니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = false;
                responseData.code = 302;
                responseData.message = '댓글 작성자가 아닙니다.';
                return res.json(responseData);
            }
        }
        else{
            console.log("[reply/modify] [" + reply_no + "] 번 댓글을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '댓글을 찾을 수 없습니다.';
            return res.json(responseData);
        }

    })
    
});

router.post('/delete', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var reply_no = req.body.reply_no;


    var query=connection.query('select * from replylist where reply_no=?', [reply_no], function(err, rows){
        if(err) throw err;
        if(rows[0]){
            if(rows[0].userId==curUser){
                var sql = 'delete from replylist where reply_no=?';
                var query = connection.query(sql, [reply_no], function(err, rows){
                    if(err) throw err;
                    console.log("[reply/delete] [" + reply_no + "] 번 댓글이 삭제되었습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                    responseData.check = true;
                    responseData.code = 200;
                    responseData.message = '댓글이 삭제되었습니다.';
                    return res.json(responseData);
                })    
            }
            else{
                console.log("[reply/delete] [" + curUser + "] 사용자 댓글 작성자가 아닙니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = false;
                responseData.code = 301;
                responseData.message = '댓글 작성자가 아닙니다.';
                return res.json(responseData);
            }
        }
        else{
            console.log("[reply/delete] [" + reply_no + "] 번 댓글을 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 302;
            responseData.message = '댓글을 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })
});

router.post('/list', function(req, res){
    var responseData = {};
    var curUser = req.body.curUser;
    var article_no = req.body.article_no;
    var page = req.query.page;

    var query = connection.query('select * from user where id=?',[curUser],function(err,rows_a){
        if(err) throw err;
        if(rows_a[0]){
            var query = connection.query('select * from replylist where article_no=?',[article_no], function(err, rows){
                if(err) throw err;
                var count = rows.length;
                var conArr = [];
                for(var i=(page-1)*20;i<page*20&&i<count;i++){
                    if(rows[i].userId==curUser){
                        rows[i].right=true;
                    }
                    else{
                        rows[i].right=false;
                    }
                    var fileExists = fs.existsSync(__dirname + '/user_profile_image/' + rows[i].userId + '.txt');
                        if(fileExists){
                          var fileRead = fs.readFileSync(__dirname + '/user_profile_image/' + rows[i].userId + '.txt', 'utf8');
                            rows[i].imageSource = fileRead;
                          }
                        else{
                            rows[i].imageSource = null;
                        }
                    conArr.push(rows[i]);
                }
                console.log("[reply/list] [" + article_no + "] 번 게시글의 댓글 목록을 요청했습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
                responseData.check = true;
                responseData.code = 200;
                responseData.message = '게시글의 댓글 목록을 요청했습니다.';
                responseData.content = conArr;
                return res.json(responseData);
                
            })
        }
        else{
            console.log("[reply/list] [" + curUser + "] 사용자 아이디를 찾을 수 없습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
            responseData.check = false;
            responseData.code = 301;
            responseData.message = '아이디를 찾을 수 없습니다.';
            return res.json(responseData);
        }
    })



});

    module.exports = router; 


    