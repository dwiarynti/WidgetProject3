var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./connection');
var sequencedb = db.sublevel('sequencenumbermessage');
var messagedb = db.sublevel('message');


router.post('/message/create',function(req,res)
{
    var generateid = "";
    sequencedb.get("sequencenumbermessage",function(err,no)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
               generateid = 1;
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            generateid = no + 1;
        }

        var data = {
            "id" : generateid,
            "datetime" : req.body.datetime,
            "topic" : req.body.topic,
            "siteid" : req.body.siteid,
            "locationid": req.body.locationid
        }
        var listobj =[];
        messagedb.get('message',function(err,obj)
        {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
              listobj.push(data);
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            if(obj.length != 0)
            {
                listobj = obj;
                listobj.push(data);
            }
            else
            {
                listobj.push(data);
            }
        }
        messagedb.put('message',listobj,function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
                sequencedb.put('sequencenumbermessage',generateid,function(err)
                {
                    if(err)
                    {
                        res.json(500,err);
                    }
                    else
                    {
                        res.json({ "success": true })
                    }
                })
            }
        })
        })
    })
});

router.get('/message/getall',function(req,res)
{
    messagedb.get('message',function(err,obj)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json({"success":true , "obj":[]})
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
             res.json({"success":true , "obj":obj})
        }

    })
})



module.exports = router;