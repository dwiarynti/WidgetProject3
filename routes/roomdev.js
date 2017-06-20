var express = require('express');
var router = express.Router();

var db = require('./connection');
var devicedb = db.sublevel('device');
var sitedb = db.sublevel('site');
var roomdevroomdb = db.sublevel('roomdevroom');
var roomdevdevicedb = db.sublevel('roomdevdevice');
var devownpersondb = db.sublevel('devownperson');
var devowndevicedb = db.sublevel('devowndevice');
var roomdb = db.sublevel('room');


router.post('/roomdev/create',function(req,res)
{
     var listobj = [];
    var device  ={
        euid : req.body.deviceobj.euid,
        room : req.body.deviceobj.room,
        type : req.body.deviceobj.type
    }

    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message != "Key not found in database")
            {
                res.json(500,err);
            }
            else
            {
                res.json({success:true,"obj": []});
            }
        }
        if(roomdev.length > 0)
        {
            listobj= roomdev;
            listobj.push = roomdevdevice;
        }
        else
        {
            listobj.push(roomdevdevice);
        }

        roomdevdevicedb.put('roomdevdevice',listobj,function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
                if(device.type == "fixed")
                {
                    var selected = "";
                    roomdevroomdb.get('roomdevroom',function(err,rooms)
                    {
                        for(var i = 0; i < rooms.length;i++)
                        {
                            if(rooms[i].uuid ==roomdevdevice.room)
                            {
                                rooms[i].devices.push(roomdevdevice.device);
                                selected = rooms[i];
                            }
                           
                        }
                        if(selected !="")
                        {
                            roomdevroomdb.put('roomdevroom',rooms,function(err)
                            {
                                if(err)
                                {
                                    res.json(500,err);
                                }
                                else
                                {
                                    res.json({"success": true});
                                }
                            });
                        }
                        else
                        {
                            var listroom = [];
                            var room = {
                                    room: device.room,
                                    version : 1,
                                    device  : device.euid
                            }
                            if(rooms.length > 0)
                            {
                                
                                listroom = rooms;
                                listroom.push(room);
                            }
                            else
                            {
                                listroom.push(room);
                            }

                            roomdevroomdb.put('roomdevroom',listroom,function(err)
                            {
                                if(err)
                                {
                                    res.json(500,err);
                                }
                                else
                                {
                                    res.json({"success": true});
                                }
                            });
                        }
                    });
                }
                else
                {
                    res.json({"success": true});
                }
            }
        });
    });
});

router.get('/roomdev/getalll',function(req,res)
{
   
    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message != "Key not found in database")
            {
                res.json(500,err);
            }
            else
            {
                res.json({success:true,"obj": []});
            }
        }
        else
        {
           roomdb.get('room',function(err,rooms)
           {
            for(var i = 0 ; i < rooms.length;i++)
            {
                for(var j = 0 ; j < roomdev.length;j++)
                {
                    roomdev[j].roomname = "";
                    if(roomdev[j].room == rooms[i].euid)
                    {
                        roomdev[j].roomname = rooms[i].name;
                    }
                }
            }
            if(roomdev != null)
            {
                 res.json({"success" : true ,"obj": roomdev })
            }
            else
            {
                 res.json({"success" : true ,"obj": [] })
            }
           });
            
        
        }
    });
});

router.get('/roomdev/get/:_id',function(req,res)
{
    var id  = req.params._id;
    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message != "Key not found in database")
            {
                res.json(500,err);
            }
            else
            {
                res.json({success:true,"obj": {}});
            }
        }
        else
        {
        var selected = "";
        for(var i = 0 ; i < roomdev.length;i++)
        {
            if(roomdev[i].euid == id)
            {
                selected = roomdev[i];
            }
        }
        roomdb.get('room',function(err,rooms)
        {
            for(var i = 0 ; i < rooms.length;i++)
            {
                
                
                    if(selected.room == rooms[i].euid)
                    {
                        selected.roomname = rooms[i].name;
                    }
                
            }
            if(selected != "")
            {
                 res.json({"success" : true ,"obj": selected })
            }
            else
            {
                 res.json({"success" : true ,"obj": {} })
            }
           });
            
        
        }
    });
});





module.exports = router;