//var view = require('./view.js'),
var mysql = require('mysql'), config = require('./../config.js');
var crypto = require('crypto');
var mysql = require('mysql');

var DATABASE = config.database;


var EDITOR_TABLE = 'editor';
var POST_TABLE='posts';
var jsdom = require('jsdom');
    //htmlparser=require('htmlparser');
var client = mysql.createClient({

		user: config.db_user,
      password: config.db_pass
});

// If no callback is provided, any errors will be emitted as `'error'`
// events by the client
client.query('USE '+DATABASE);
//exports.insertNewUser= 

var controller = function() {};
 
controller.prototype = {


  retreiveAllPosts : function (callback)
  {
         client.query('SELECT * FROM '+POST_TABLE+' ORDER BY time DESC', function (err, results, fields) {
                if(err==null)
              {
                
                //console.log(results);
                var blue = JSON.stringify(results);
                var json = JSON.parse(blue);
                if(json[0]==null||json[0]==undefined)
                  {
                    console.log("Something's wrong with the posts table!");
                    callback(null);
                
                  }
                else
                  { 
                    console.log("phew!just retreived all the articles from the db");
                    callback(json);
                  }
                       
                  
              } 
        
              
              
              else
              {
                              
                  console.log(err);
                  callback(null);
              }
        });



  },

  findNumber : function(callback)
  {
    
             client.query('SELECT COUNT(pid) FROM '+POST_TABLE, function (err, results) {
                if(err==null)
              {
                callback(results);
                  
              } 
        
              
              
              else
              {
                              
                  console.log(err);
                  callback(null);
              }
        });

  }, 
  retreivePosts : function(number, callback)
          {
                  client.query('SELECT * FROM '+POST_TABLE+' ORDER BY time DESC LIMIT '+ number*5 + ' ,5', function (err, results, fields) {
                if(err==null)
              {
                
                //console.log(results);
                var blue = JSON.stringify(results);
                var json = JSON.parse(blue);
                if(json[0]==null||json[0]==undefined)
                  {
                    console.log("Something's wrong with the posts table!");
                    callback(null);
                
                  }
                else
                  { 
                    console.log("phew!just retreived some articles from the db");
                    callback(json);
                  }
                       
                  
              } 
        
              
              
              else
              {
                              
                  console.log(err);
                  callback(null);
              }
        });
            
                  
                                 
    
  
  
         }, 
  
  insertNewUser : function (id, name, password,callback) {  
        

    var text = null;                
    client.query('SELECT * FROM '+EDITOR_TABLE+' WHERE name=?',[name], function (err, results, fields) {
                if(err==null)
              {
                
                console.log("results are: " + results);
                var blue = JSON.stringify(results);
                var json = JSON.parse(blue);
                console.log("json is : "+json);
                if(json[0]==null||json[0]==undefined)
              {
                      console.log("This username is free!Inserting...");
                      client.query('INSERT INTO '+EDITOR_TABLE+' '+'SET id= ?, name = ?, password = ?, articles = ?',[id, name,password,null],        function(err, info)
          {
                     if(err==null)
                    {
                        console.log("inserted new user: " + name); 
                        text ="success";
                    }
                    else 
                        console.log(err);
                  
                 
  
          }
          );


                
              }
                else
            
                console.log("this username already exists!redirecting...");
               
             // var err = require("./../public/javascripts/error.js");
             // console.log(err.reason("uua")); 
              
            
        
              }
              
                else
                
                  console.log(err); 
              });
              
              
              setTimeout(function () {
                  console.log("end of if. ");
            
                  if(text=="success")
                  {
                      console.log("calling back with success");
                      callback("success");
                  }
                  else
                  {
                      console.log("calling back with null");
                      callback(null);
                  }
              }, 1000);
      },



    hash: function hash(text){
                    return crypto.createHash('sha1').update(crypto.createHash('md5').update(text).digest('hex')).digest('hex');
                      },
    login : function(session, callback) {
              var username = session.username;
              var password = session.password;
              client.query('SELECT * FROM '+EDITOR_TABLE+' WHERE name=?',[username], function (err, results, fields) {
                if(err==null)
              {
                
                console.log(results);
                var blue = JSON.stringify(results);
                var json = JSON.parse(blue);
                                      if(json[0]==null||json[0]==undefined||results==null||results==undefined)
                    {   
                      console.log("user not found!");
                      callback(null);
                    }   
                    else
                    { 
                      if(json[0].password==password)
                          callback(json[0].id);
                      else 
                      {
                        console.log("Passwords don't match!");
                        callback(null);
                      }     
                   }      
              }
                else
                console.log(err);
              });
            },


    error : function(data)
            {
              var err = require("./../public/javascripts/error.js");
              err.text = err.reason(data);
              console.log(err.text);
            },
        

     post : function(article,author,callback)
                {
                        
                        
                          
                        var findTitle = function (title,pid)
                        { 
                                 client.query('INSERT INTO '+POST_TABLE+' '+'SET pid= ?, title = ?, author = ?,contents = ?',[pid, title, author, article], function( err, info)
                                    {
                                      if(err==null)
                                       { 
                                          console.log("inserted new article: " + title);
                                          /*client.query('SELECT articles FROM ' + EDITOR_TABLE + ' WHERE name = ? ', [author], function(err, results)
                                            {
                                                  if(err)
                                                  {
                                                    console.log("error retreiving articles from the editor table!");
                                                    console.log(err);
                                                  }
                                                  else
                                                  {
                                                      var string = results[0]['articles'];
                                                      console.log(typeof string);
                                                      var json = JSON.parse(string);
                                                      string = string + results[0]['articles']+','+ title;
                                                      console.log(author + " has written these articles so far: " + string);
                                                      client.query('UPDATE ' + EDITOR_TABLE + ' SET articles=? WHERE name =? ',[string,author],function(err, results)
                                                        {
                                                          if(err)
                                                            console.log("couldn't update articles!");
                                                          else
                                                            console.log("updated articles written by " + author);
                                                        });
                                                }
                                            }
                                          );*/
                                          callback(info);
                                      }
                                      else 
                                      {
                                        console.log(err);
                                        callback(null);
                                      }
                                    } 
            
                                            );};


                        jsdom.env(article, [ './../public/javascripts/js/libs/jquery-1.7.1.min.js'], function (errors, window)
                            {
                              var title = window.$("h4").text();
                              console.log("title of the post is : "+ window.$("h4").text());
                             
                              var pid = crypto.createHash('sha1').update(crypto.createHash('md5').update(title).digest('hex')).digest('hex');
                              console.log(pid);  
                              findTitle(title,pid);

                            }
                                );

             
              
                
                
                
                },

      updatePost : function(pid,article,author,callback)
                {
                        
                        
                          
                        var findTitle = function (title)
                        { 
                                 client.query('UPDATE '+POST_TABLE+' SET title = ?, author = ?,contents = ? WHERE pid = ?',[title, author, article, pid], function( err, info)
                                    {
                                      if(err==null)
                                       { 
                                          console.log("inserted new article: " + title);
                                          /*client.query('SELECT articles FROM ' + EDITOR_TABLE + ' WHERE name = ? ', [author], function(err, results)
                                            {
                                                  if(err)
                                                  {
                                                    console.log("error retreiving articles from the editor table!");
                                                    console.log(err);
                                                  }
                                                  else
                                                  {
                                                      var string = results[0]['articles'];
                                                      console.log(typeof string);
                                                      var json = JSON.parse(string);
                                                      string = string + results[0]['articles']+','+ title;
                                                      console.log(author + " has written these articles so far: " + string);
                                                      client.query('UPDATE ' + EDITOR_TABLE + ' SET articles=? WHERE name =? ',[string,author],function(err, results)
                                                        {
                                                          if(err)
                                                            console.log("couldn't update articles!");
                                                          else
                                                            console.log("updated articles written by " + author);
                                                        });
                                                }
                                            }
                                          );*/
                                          callback(info);
                                      }
                                      else 
                                      {
                                        console.log(err);
                                        callback(null);
                                      }
                                    } 
            
                                            );};

                                              jsdom.env(article, [ './../public/javascripts/js/libs/jquery-1.7.1.min.js'], function (errors, window)
                            {
                              var title = window.$("h4").text();
                              console.log("title of the post is : "+ window.$("h4").text());
                             
                              //var pid = crypto.createHash('sha1').update(crypto.createHash('md5').update(title).digest('hex')).digest('hex');
                              //console.log(pid); 
                              findTitle(title);

                            }
                                );

             
              
                
                
                
                },


 

    getPost : function (pid,callback)
              {
                   client.query('SELECT * FROM '+POST_TABLE+' WHERE pid= ? ', [pid], function (err, results, fields) {
                if(err==null)
              {
                
                //console.log(results);
                var blue = JSON.stringify(results);
                var json = JSON.parse(blue);
                if(json[0]==null||json[0]==undefined)
                  {
                    console.log("Something's wrong with the posts table!");
                    callback(null);
                
                  }
                else
                  { 
                    console.log("phew!just retreived specific article from the db");
                    callback(json);
                  }
                       
                  
              } 
        
              
              
              else
              {
                              
                  console.log(err);
                  callback(null);
              }
        });
  }


};
 
module.exports = new controller();
