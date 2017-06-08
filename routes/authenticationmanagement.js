var express = require('express');
var router = express.Router();

var db = require('./connection');

var authmanagementdb = db.sublevel('authmanagement');
var messagedb = db.sublevel('message');
router.get('/auth/init',function(req,res)
{
    var totalnotif =0;
    var auth = false;
    messagedb.get('message',function(err,messages)
    {
     if(err)
     {
        if(err.message == "Key not found in database")
         {
             totalnotif =0;
         }
        else
         {
            res.json(500,err);
        }
      }
      else
      {
          if(req.session.role == "User")
          {
            totalnotif = messages.length;
          }
          else
          {
              totalnotif = messages.length;
          }
          authmanagementdb.get('authmanagement',function(err,data)
          {
            if(err)
            {
                if (err.message == "Key not found in database") {
                auth = true;
                res.json({"success":true,"obj": auth,"totalnotif": totalnotif})
                }
                else {
                    res.json(500, err);
                }
            }
            else
            {
                res.json({"success":true,"obj": data,"totalnotif": totalnotif})
            }
          });
       
      }
    });
})


router.post('/auth/update',function(req,res)
{
    var auth = req.body.auth;
    authmanagementdb.put('authmanagement',auth,function(err)
    {
        if(err) res.json(500,err);
        else
        res.json({"success":true})
    })
});



module.exports = router;