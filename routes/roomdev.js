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
    var select = "";
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
                for(var a = 0 ;a< roomdev.length;a++)
                {
                    if(roomdev[a].euid == devices.euid)
                    {
                        select =  roomdev[a].euid;
                    }
                }
               listobj = roomdev;
               listobj.push(devices);
           }
           else
           {
               if(roomdev.euid == devices.euid)
               {
                   select =  roomdev.euid
               }
               listobj.push(devices);
           }
        }
       
      
        if(select == "")
        {
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
        }
        else
        {
            res.json({"success" : false ,"messages": "mac address already exist"  })
        }
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
});

router.post('/roomdev/delete',function(req,res)
{
    var devices = req.body.deviceobj;
   
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
          var listobj = [];
          var listroom = [];
          var result = [];
          for(var j = 0 ; j < roomdev.length;j++)
          {
            if(roomdev[j].euid != devices.euid)
            {
              listobj.push(roomdev[j])
            }
          }
          roomdevdevicedb.put('roomdevdevice',listobj,function(err)
          {
            if(err)
                res.json(500,err);
            else

            if(devices.type == "fixed")
            {
                roomdevroomdb.get('roomdevroom',function(err,roomroom)
                {
                    var roomdata = {
                        room : devices.room,
                        version: devices.version,
                        device :[]
                    }
                   if(roomroom.length > 0)
                    {
                        for(var i = 0 ; i < roomroom.length; i++)
                        {
                            if(roomroom[i].room == devices.room)
                            {
                                for(var j = 0 ; j < roomroom[i].device.length;j++)
                                {
                                    if(roomroom[i].device[j] != devices.euid)
                                    {
                                         roomdata.device.push(roomroom[i].device[j]);
                                    }
                                }
                            }
                        }

                        for(var i = 0 ; i < roomroom.length;i++)
                        {
                            if(roomroom[i].room == roomdata.room)
                            {
                                roomroom[i].device = roomdata.device;
                            }
                        }
                        }
                else
                {
                    if(roomroom.room == devices.room)
                    {
                        for(var i  = 0 ; i < roomroom.device.length;i++)
                            {
                                if(roomroom.device[i] != devices.euid)
                                  {
                                      roomdata.device.push(roomroom.device[i]);
                                  }
                              }
                              roomroom.device = roomdata.device;
                    }
                }
                
                roomdevroomdb.put('roomdevroom',roomroom,function(err)
                    {
                        if(err)
                        res.json(500,err);
                        else
                        res.json({"success": true })
                    });

                });
            }
            else
            {
                res.json({"success":true});
            }

          });
          

        }
        
        
    });
});

router.post('/roomdev/update',function(req,res)
{
    var devices = req.body.deviceobj;
   
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
          var listobj = [];
          var listroom = [];
          var result = [];
          for(var j = 0 ; j < roomdev.length;j++)
          {
            if(roomdev[j].euid == devices.euid)
            {
              roomdev[j].room = devices.room;
              roomdev[j].type = devices.type;
            
            }
          }
          roomdevdevicedb.push('roomdevdevice',roomdev,function(err)
          {
            if(err)
                res.json(500,err);
            else

            if(devices.type == "fixed")
            {
                roomdevroomdb.get('roomdevroom',function(err,roomroom)
                {
               
                   if(roomroom.length > 0)
                    {
                        for(var i = 0 ; i < roomroom.length; i++)
                        {
                            if(roomroom[i].room == devices.room)
                            {
                                for(var j = 0 ; j < roomroom[i].device.length;j++)
                                {
                                    if(roomroom[i].device[j] == devices.euid)
                                    {
                                        roomroom[i].device[j] = devices.euid;
                                    }
                                }
                            }
                        }

                        
                }
                else
                {
                    if(roomroom.room == devices.room)
                    {
                        for(var i  = 0 ; i < roomroom.device.length;i++)
                        {
                                if(roomroom.device[i] == devices.euid)
                                  {
                                      roomroom.device[i] = devices.euid;
                                  }
                        
                        }
                    }
                }
                
                roomdevroomdb.put('roomdevroom',roomroom,function(err)
                    {
                        if(err)
                        res.json(500,err);
                        else
                        res.json({"success": true })
                    });

                });
            }
            else
            {
                res.json({"success":true});
            }

          });
          

        }
        
        
    });
});


module.exports = router;