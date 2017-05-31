var express = require('express');
var router = express.Router();

var db = require('./connection');

var authmanagementdb = db.sublevel('authmanagement');

router.get('/auth/init',function(req,res)
{
    authmanagementdb.get('authmanagement',function(err,data)
    {
        var auth = false;
        if(err)
        {
            if (err.message == "Key not found in database") {
               auth = true;
               res.json({"success":true,"obj": auth})
            }
            else {
                res.json(500, err);
            }
        }
        else
        {
           
            res.json({"success":true,"obj": data})

        }
    })
})


router.post('/auth/update',function(req,res)
{
   
    var auth = true;
    authmanagementdb.put('authmanagement',auth,function(err)
    {
        if(err) res.json(500,err);
        else
        res.json({"success":true})
    })
})
module.exports = router;