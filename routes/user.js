var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./connection');
var sequencedb = db.sublevel('sequencenumberuser');
var userdb = db.sublevel('user');

var users = [
    {
        id: "",
        username:'qwe',
        password:'123',
        pages: [],
        role:{}
    },
    
]
router.post('/user/create', function (req, res) {

    var generateid ="";
    sequencedb.get('sequencenumberuser',function(err,no)
    {
         if (err)
         {
          if (err.message == "Key not found in database") {
                var no = 0;
                sequencedb.put('sequencenumberuser', no, function (err, id) {
                    if (err) res.json(500, err)
                    else 
                    generateid = id + 1;
                });
            }
            else {
                res.json(500, err);
            }
         }
        else
        {
            generateid = no +1;
        }

        if(generateid != "")
        {
        var user = {
            id : generateid,
            username: req.body.username,
            password : req.body.password,
            role : req.body.role,
            pages : req.body.pages
        }  
        var listobj = [];
        userdb.get('user',function(err,obj)
        {
            if(err)
            if(err.message == "Key not found in database")
            {
               listobj.push(user);
            }
            else
            {
                res.json(500,err);
            }
            else
            if(obj.lenght != 0)
            {
                listobj = obj;
                listobj.push(user);

            }
            else
            {
                listobj.push(user);
            }

            userdb.put('user', listobj, function (err) {
            if (err) res.json(500, err);
            else res.json({ success: true });
        });
     });
    }
});
        
});

router.post('/user/login',function(req,res)
{
    var user = {"username": req.body.username,"password":req.body.password};
    userdb.get('user',function(err,datauser)
    {
        var result = {};
        for(var i = 0 ; i < datauser.lenght;i++)
        {
            var element = datauser[i];
            if(element.username == user.username && element.password == user.password)
            {
                result = element;
            }
        }
        if(result!= null || result!= "")
        {
          
            req.session.authorized = "authorized";
            res.json({"success": true,"obj": session});
        }
        else
        {
            var message ="username or password not correct";
            res.json({"success": false, "obj": message})
        }
    })
});

router.get('/user/session',function(req,res)
{
    
    if(req.session.authorized)
    {
        res.json({"result": req.session.authorized})
    }
    else
    {
        res.json({"result": "unauthorized"});
    }
})



module.exports = router;


