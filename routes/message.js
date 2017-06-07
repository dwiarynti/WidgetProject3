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
                    if(messages.length > 0)
                    {
                        if(sites.length > 0)
                        {
                            for(var i = 0 ; i < sites.length;i++)
                            {
                                for(var j = 0 ; j < messages.length; j++)
                                {
                                    if(sites[i].id == messages[j].siteid)
                                    {
                                        messages[j].sitename = sites[i].sitename;
                                    }
                                }
                            }
                        }
                        else
                        {
                            for(var i = 0 ; i < messages.length; i++)
                            {
                                if(messages[i].siteid == sites.id)
                                {
                                      messages[j].sitename = sites.sitename;
                                }
                            }
                        }
                    }
                    else
                    {
                        if(sites.length > 0)
                        {
                            for(var i = 0 ; i < sites.length; i++)
                            {
                                if(messages.siteid == sites[i].id)
                                {
                                    messages.sitename = sites[i].sitename;
                                }
                            }
                        }
                        else
                        {
                            if(messages.siteid == sites.id)
                            {
                                messages.sitename = sites.sitename;
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
                            if(locations.length > 0)
                            {
                                if(messages.length > 0)
                                {
                                for(var i = 0 ; i < locations.length;i++)
                                {
                                    for(var j = 0 ; j < messages.length; j++)
                                    {
                                        if(locations[i] != null)
                                        {   
                                        if(locations[i].id == messages[j].locationid)
                                        {
                                            messages[j].locationname = locations[i].locationname;
                                        }
                                        }
                                    }
                                 }
                                }
                                else
                                {
                                    for(var i = 0 ; i < locations.length;i++)
                                    {
                                        if(locations[i] !=null)
                                        {
                                            if(locations[i].id == messages.locationid)
                                            {
                                                messages.locationname = locations[i].locationname;
                                            }
                                        }
                                        
                                    }
                                }
                            }
                            else
                            {
                                if(messages.length > 0)
                                {
                                    for(var i = 0 ; i < messages.length; i++)
                                    {
                                        if(messages[i].locationid == locations.id)
                                        {
                                            messages[j].locationname = locations.locationname;
                                        }
                                    }
                                }
                                else
                                {
                                    if(messages.locationid == locations.id)
                                    {
                                        messages.locationname = locations.locationname;
                                    }
                                    
                                }
                            }
                            var result = [];
                            result.push(messages);
                            res.json({"success":true,"obj":result[0]});
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
    var listmessage =[];
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
        if(sites.length > 0)
        {
            for (var i = 0; i < sites.length; i++) {
            var element = sites[i];
            if (element.id == id)
            sitename = element.sitename;
            }
        }
        else
        {
            if(sites.id == id)
            {
                sitename = sites.sitename;
            }
        }
        if(sitename != "")
        {
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
                    if(messages.length > 0)
                    {
                    for(var i = 0 ; i < messages.length; i++)
                    {
                        if(messages[i].siteid == id)
                        {
                            messages[i].sitename = sitename; 
                            listmessage.push(messages[i]);                         
                        }
                    }
                    messages = [];
                    messages = listmessage;
                    }
                    else
                    {
                        if(messages.siteid == id)
                        {
                            messages.sitename = sitename;
                            listmessage.push(messages);
                        }
                        messages = [];
                        messages = listmessage;

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
                            if(locations.length > 0)
                            {
                                if(messages.length > 0)
                                {
                                for(var i = 0 ; i < locations.length;i++)
                                {
                                    for(var j = 0 ; j < messages.length; j++)
                                    {
                                        if(locations[i] != null)
                                        {   
                                        if(locations[i].id == messages[j].locationid)
                                        {
                                            messages[j].locationname = locations[i].locationname;
                                        }
                                        }
                                    }
                                 }
                                }
                                else
                                {
                                    for(var i = 0 ; i < locations.length;i++)
                                    {
                                        if(locations[i] != null)
                                        {
                                            if(locations[i].id == messages.locationid)
                                            {
                                                messages.locationname = locations[i].locationname;
                                            }
                                        }
                                        
                                    }
                                }
                            }
                            else
                            {
                                if(messages.length > 0)
                                {
                                    for(var i = 0 ; i < messages.length; i++)
                                    {
                                        if(messages[i].locationid == locations.id)
                                        {
                                            messages[j].locationname = locations.locationname;
                                        }
                                    }
                                }
                                else
                                {
                                    if(messages.locationid == locations.id)
                                    {
                                        messages.locationname = locations.locationname;
                                    }
                                    
                                }
                            }
                            var result = [];
                            result.push(messages);
                            res.json({"success":true,"obj":result[0]});
                        }


                    });
                }
            })

        }
        else
        {
            res.json({"success":true, "obj":[],"message": "no data"})
        }
    }
    });

})

router.get('/message/getbyid/:_id',function(req,res)
{
    var id = req.params._id;
    var selectedmessage = {};
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
            if(messages.length > 0)
            {
                for(var i = 0 ; i < messages.length;i++)
                {
                    if(messages[i].id == id)
                    {
                        selectedmessage = messages[i];
                    }
                }
            }
            else{
                if(messages.id == id)
                {
                    selectedmessage = messages;
                }

            }

            sitedb.get('site',function(err,sites)
            {
                if(sites.length > 0)
                {
                    for(var a = 0 ; a < sites.length;a++)
                    {
                       
                        if(selectedmessage.siteid == sites[a].id)
                        {
                            selectedmessage.sitename = sites[a].sitename;
                        }
                    }
                }
                else
                {
                    if(selectedmessage.siteid == sites.id)
                    {
                        selectedmessage.sitename = sites.sitename;
                    }
                }

                locationdb.get('locationsite',function(err,locations)
                {
                    if(locations.length > 0)
                    {
                        for(var a = 0 ; a < locations.length;a++)
                        {
                          if(locations[a] != null)
                          {
                            if(selectedmessage.locationid == locations[a].id)
                            {
                                selectedmessage.locationname = locations[a].locationname;
                            }
                          }
                        }
                    }
                    else
                    {
                        if(selectedmessage.locationid == locations.id)
                        {
                            selectedmessage.locationname = locations.locationname;
                        }
                    }
                    res.json({"success": true, "obj": selectedmessage})
                })
                
            })
            
        }
    });
});


router.post('/message/update/',function(req,res)
{
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
            if(messages.length > 0)
            {
                for(var i = 0 ; i < messages.length;i++)
                {
                    if(messages[i].id == req.body.id)
                    {
                       messages[i].datetime = req.body.datetime;
                       messages[i].topic = req.body.topic;
                       messages[i].siteid = req.body.siteid;
                       messages[i].locationid = req.body.locationid;
                    }
                }
            }
            else{
            if (messages.id == req.body.id)
             {
                    messages.datetime = req.body.datetime;
                    messages.topic = req.body.topic;
                    messages.siteid = req.body.siteid;
                    messages.locationid = req.body.locationid;
             }
            }

            messagedb.put('message',messages,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else
                {
                     res.json({ "success": true });
                }
            })
        }
    });
        
});


router.post('/message/update/',function(req,res)
{
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
            if(messages.length > 0)
            {
                for(var i = 0 ; i < messages.length;i++)
                {
                    if(messages[i].id == req.body.id)
                    {
                       messages[i].datetime = req.body.datetime;
                       messages[i].topic = req.body.topic;
                       messages[i].siteid = req.body.siteid;
                       messages[i].locationid = req.body.locationid;
                    }
                }
            }
            else{
            if (messages.id == req.body.id)
             {
                    messages.datetime = req.body.datetime;
                    messages.topic = req.body.topic;
                    messages.siteid = req.body.siteid;
                    messages.locationid = req.body.locationid;
             }
            }

            messagedb.put('message',messages,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else
                {
                     res.json({ "success": true });
                }
            })
        }
    });
        
});

router.post('/message/delete/',function(req,res)
{
    var listmessage = [];
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
            if(messages.length > 0)
            {
                for(var i = 0 ; i < messages.length;i++)
                {
                    if(messages[i].id != req.body.id)
                    {
                       listmessage.push(messages[i]);
                    }
                }
            }
            else{
            if (messages.id != req.body.id)
             {
                   listmessage.push(messages);
             }
            }

            messagedb.put('message',listmessage,function(err)
            {
                if(err)
                {
                    res.json(500,err);
                }
                else
                {
                     res.json({ "success": true });
                }
            })
        }
    });
        
});



module.exports = router;