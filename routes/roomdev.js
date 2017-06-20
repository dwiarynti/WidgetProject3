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
        euid : req.body.euid,
        room : req.body.room,
        type : req.body.type
    }

    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message != "Key not found in database")
            {
                res.json(500,err);
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
    roomdevroomdb.get('roomdevdevice',function(err,roomdev)
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
            
        });
    });
});

module.exports = router;