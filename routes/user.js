var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./connection');
var sequencedb = db.sublevel('sequencenumberuser');
var userdb = db.sublevel('user');

var users = [
    {
        id: 1,
        username:'dwi',
        password:'123',
        pages: [],
        role:{}
    },
    
]
router.post('/user/create', function (req, res) {

    var id = "";
    sequencedb.get('sequencenumberuser',function()
    {
         if (err)
            if (err.message == "Key not found in database") {
                var no = 0;
                sequencedb.put('sequencenumberpersondevice', no, function (err, no) {
                    if (err) res.json(500, err)
                    else id = no + 1;
                });
            }
            else {
                res.json(500, err);
            }
        else
        id = no+1;
        if(id != "")
        {
        var user = {
            id : id,
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


