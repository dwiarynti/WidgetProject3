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
    var listroom = [];
    var selectdevice = "";
    var devices  = {
        euid : req.body.deviceobj.euid,
        room : req.body.deviceobj.room,
        type : req.body.deviceobj.type
    }

    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            listobj.push(devices);
            else
            res.json(500,err);
            
        }
        else
        {
           if(roomdev.length > 0)
           {
               listobj = roomdev;
               listobj.push(devices);
           }
           else
           {
               listobj.push(devices);
           }
        }
      
        roomdevdevicedb.put('roomdevdevice',listobj,function(err)
        {
            if(err)
            res.json(500,err);
            else
            if(devices.type == "fixed")
            {
                var room = {
                    room : devices.room,
                    version : 1,
                    device  :[]
                }
                room.device.push(devices.euid);
                roomdevroomdb.get('roomdevroom',function(err,roomroom)
                {
                    var result = [];
                    
                    if(err)
                    {
                        if(err.message == "Key not found in database")
                        {
                            listroom.push(room);
                        }
                        else
                        {
                            res.json(500,err);
                        }
                    }
                    else
                    {
                        if(roomroom.length > 0)
                        {
                        for(var i = 0 ; i < roomroom.length; i++)
                        {
                            if(roomroom[i].room == devices.room)
                            {
                                roomroom[i].device.push(devices.euid);
                                selectdevice = roomroom[i];
                            }
                        }
                        }
                        else
                        {
                            if(roomroom.room == devices.room)
                            {
                                roomroom.device.push(devices.euid);
                                result.push(roomroom);
                            }
                            else
                            {
                                result[0] = roomroom;
                                result.push(room);
                            }
                            
                            selectdevice = roomroom;
                        }
                    }
                    if(selectdevice != "")
                    {
                        listroom = result;
                    }
                    else
                    {
                        listroom = room;
                    }
                    roomdevroomdb.put('roomdevroom',listroom,function(err)
                    {
                        if(err)
                        res.json(500,err);
                        else
                        res.json({"success": true })
                    });

                })
            }
            else
            {
                res.json({"success": true })
            }
        })
    });
});



router.get('/roomdev/getall',function(req,res)
{
    roomdevdevicedb.get('roomdevdevice',function(err,roomdev)
    {
        if(err)
        {
            if(err.message ==  "Key not found in database")
            res.json({success:true,"obj": {}});
            else
            res.json(500,err);
        }
        else
        {
           roomdb.get('room',function(err,rooms)
           {
            for(var i = 0 ; i < rooms.length;i++)
            {
                for(var j = 0 ; j < roomdev.length;j++)
                {
                  
                    if(roomdev[j].room == rooms[i].uuid)
                    {
                        roomdev[j].roomname = rooms[i].name;
                    }
                    
                }
            }
            res.json({"success" : true ,"obj": roomdev })
           });
        }

    });
});

router.get('/roomdev/getroom',function(req,res)
{
    roomdevroomdb.get('roomdevroom',function(err,data)
    {
        if(err)
        res.json(500,err);
        else
        res.json({"success":true,"obj": data});
    })
})


module.exports = router;