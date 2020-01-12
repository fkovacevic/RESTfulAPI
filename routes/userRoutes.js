
var documentation  = require('../models/methodsDocumentation')
var users = require('../models/dummyUsers');
var stories = require('../models/dummyStories');
const jwt = require('jsonwebtoken');
const privateKey = 'privateKey';
var tools = require('../common/utils');



module.exports = (app) => {
  
    app.set('views', './views/');
    app.set('view engine', 'ejs');
    
    
    app.get('/api', (req, res) => {
        res.render('homepage', {results : documentation});
    });

    app.get('/api/user',(req,res) => {
        userNames = [];
        users.forEach((element) => userNames.push(element.username));
        res.json(userNames);
    });

    app.post('/api/user',(req,res) => {
        if((Object.keys(req.body).length || Object.values(req.body).length) != 4  ||
        !(Object.keys(req.body).includes("username"&&"password"&&"firstName"&&"lastName"))) {
            console.log('ERROR: Wrong parameters');
            res.sendStatus(400);
            res.end();
        }
        else {
            const newUser = Object.assign(req.body,{id :tools.getCurrentUsersId()});
            users.push(newUser);
            res.sendStatus(201);
            res.end();
        }
    });

    app.get('/api/user/:id',checkToken,(req,res) => {
        jwt.verify(req.token, privateKey, (err) => {
            if(err){
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                var user = null;
                users.forEach((element) => {
                    user = req.params.id == element.id ? element : user;
                });
                user != null ? res.status(200).json(user) : res.status(400);
                res.end();
            }
        })
    });


    app.put('/api/user/:id',checkToken ,(req,res) => {
        jwt.verify(req.token, privateKey, (err) => {
            if(err){
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                users.forEach((name, index) => {
                    if (users[index].id == req.params.id)
                        users[index].password = req.body.newPassword;
                    });
                    res.sendStatus(201);
                    res.end();
            }
        })
    });

    app.delete('/api/user/:id',checkToken, (req,res) => {
        jwt.verify(req.token, privateKey, (err) => {
            if(err){
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                var user = null;
                users.forEach((element) => {
                    user = req.params.id == element.id ? element : user;
                });
                var index = users.indexOf(user);
                if (index > -1) {
                    users.splice(index, 1);
                    res.sendStatus(200);
                }
            }
        })
    });

    app.get('/api/stories', (req,res) => {
        var titles = [];
        stories.forEach((element) => {
            element['stories'].forEach((story) => titles.push(story.title));
        });
        res.json(titles);
        res.end();
    });

    app.get('/api/user/:id/stories',checkToken, (req,res) => {
        jwt.verify(req.token, privateKey, (err) => {
            if(err){
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                var userStories = [];
                console.log(req.params.id);
                
                stories.forEach((element) => {
                    if(req.params.id == element.id) {
                        element['stories'].forEach((story) => {
                                userStories.push(story)
                                console.log(story);
                                
                            });

                    }
                });
                res.send(userStories);
                res.end();
            }
        })
    });

    app.put('/api/stories/:id',checkToken,(req,res) => {
        jwt.verify(req.token, privateKey, (err) => {
            if(err){
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                stories.forEach((name, index) => {
                    if (stories[index].id == req.params.id)
                        stories[index].storiesType = req.body.newType;
                    });
                    res.sendStatus(201);
                    res.end();
        
            }
        })
      
    });

    app.delete('/api/stories/:id',checkToken,(req,res) => {
        jwt.verify(req.token, privateKey, (err) => {
            if(err){
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                 var story = null;
                 stories.forEach((element) => {
                     story = req.params.id == element.id ? element : story;
                 });
                 var index = stories.indexOf(story);
                 if (index > -1) {
                     stories.splice(index, 1);
                     res.sendStatus(200);
                 }
            }
        })
      
    });
    
    app.post('/api/login', (req, res, next) => {
        var foundUser = null;      
        users.forEach((user) => {
            if(req.body.username == user.username
                 && req.body.password == user.password)
                    foundUser = user;
                
        });
        
        if(foundUser != null) { 
           jwt.sign({foundUser}, privateKey, { expiresIn: '1h' },(err, token) => {
               if(err) { console.log(err) }   

               res.json({token : token, tokenSuccessfullySent : true});
           });
           
       } else {
           console.log('ERROR: Could not log in');
           res.sendStatus(403);
       }
     });
        
       
};

//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}