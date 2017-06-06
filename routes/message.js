var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('./connection');
var sequencedb = db.sublevel('sequencenumbermessage');
var messagedb = db.sublevel('message');
var sitedb = db.sublevel('site');
var locationdb = db.sublevel('locationsite');

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
            if(obj.length > 0)
            {
                
               listobj = obj;
               listobj.push(data);
               
            }
            else
            {  
                if(obj != null)
                {
                 listobj[0] = obj;
                 listobj.push(data);
                }
                else
                {
                     listobj.push(data);
                }
                
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
            sitedb.get('site',function(err,sites)
            {
                if (err)
                {
                    if (err.message == "Key not found in database") {
                        res.json({ "success": true, "message": "no data", "obj": [] });
                    }
                    else {
                        res.json(500, err);
                    }
                }
                else
                {   
                    var listsite = [];
                    listmessage = [];
                    listmessage.push(obj);
                    listsite.push(sites);
                    for(var i = 0 ; i < listsite.length;i++)
                    {
                        for(var j = 0 ; j < listmessage.length; j++)
                        {
                            if(listsite[i].id == listmessage[j].siteid)
                            {
                                listmessage[j].sitename = listsite[i].sitename;
                            }
                        }
                    }
                     locationdb.get('locationsite',function(err,locations)
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
                        
                            for(var i = 0; i < locations.length; i++)
                            {
                                for(var j = 0 ; j < listmessage.length; j++)
                                {
                                    if(locations[i] != null)
                                    {
                                    if(locations[i].id == listmessage[j].locationid)
                                    {
                                        listmessage[j].locationname = locations[i].locationname;
                                    }
                                    }
                                }
                            }
                            res.json({"success":true,"obj":listmessage});
                        }
                     });

                   
                }
            })
            
        }

    })
});

router.get('/message/getbysite/:_id',function(req,res)
{
    var id = req.params._id;
    var sitename = "";
     sitedb.get('site', function (err, sites) {
        if (err)
        {
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
                res.json(500, err);
            }
        }
        else
        {
            for (var i = 0; i < sites.length; i++) {
                var element = sites[i];
                if (element.id == id)
                 sitename = element.sitename;
            }
            messagedb.get('message',function(err,messages)
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
                var countmessage = 0;
                var msg = [];
                msg.push(messages);
                var listmessage = [];

                   for(var i = 0 ; i < msg.length; i++)
                   {
                       if(msg[i].siteid == id)
                       {
                           msg[i].sitename = sitename;
                           listmessage.push(msg[i]);
                       }
                       countmessage+=1;
                   }

                locationdb.get('locationsite',function(err,locations)
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
                    for(var i = 0; i < locations.length; i++)
                    {
                        for(var j = 0 ; j < listmessage.length; j++)
                        {
                            if(locations[i] != null)
                            {
                            if(locations[i].id == listmessage[j].locationid)
                            {
                                listmessage[j].locationname = locations[i].locationname;
                            }
                            }
                        }
                    }
                    res.json({"success":true,"obj":listmessage});
                }
                })
                  
                }
            });
            }
                
        });


})



module.exports = router;