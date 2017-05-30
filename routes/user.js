var express = require('express');
var router = express.Router();

var db = require('./connection');

var userdb = db.sublevel('user');

var user = [
    {
        id: 1,
        username:'dwi',
        password:'123',
        pages: []
    },
    
]
router.post('/user/create', function (req, res) {
    userdb.put('user', user, function (err) {
        if (err) res.json(500, err);
        else res.json({ success: true });
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
            res.json({"success": true,"obj": result});
        }
        else
        {
            var message ="username or password not correct";
            res.json({"success": false, "obj": message})
        }
    })
})



module.exports = router;


