var express = require('express');
var router = express.Router();

var db = require('./connection');
var roomdb = db.sublevel('room');
var sequencedb = db.sublevel('sequencenumberroom');



router.post('/room/create', function (req, res) {

    var generateid = "";
    var listobj = [];
    sequencedb.get('sequencenumberroom',function(err,id)
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
        else{
            generateid = id+1;
        }

    var parent;
    if( req.body.roomobj.parent != null)
    {
        parent =req.body.roomobj.parent;
    }
    else
    {
        parent = "";
    }
    var room = {
        uuid : generateid,
        name: req.body.roomobj.name,
        parent :parent,
        datecreated : req.body.roomobj.datacreated,
        datemodified : "",
        changeby : "",
        changebyname :"",
        areatype : req.body.roomobj.areatype,
        shortaddress: req.body.roomobj.shortaddress,
        fulladdress:req.body.roomobj.fulladdress,
        Location :"",
        disable : false
    }

    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                listobj.push(room);
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            if(rooms.length > 0)
            {
                listobj = rooms;
                listobj.push(room);
            }
            else
            {
                
              listobj.push(room);
                
            }
        }

        roomdb.put('room',listobj,function(err)
        {
            if(err)
            {
                res.json(500,err);
            }
            else
            {
               sequencedb.put('sequencenumberroom',generateid,function(err)
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
    });
});
});

router.get('/room/getall',function(req,res)
{
    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database" )
            {
                res.json({"success": true , "obj": []});
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            res.json({"success": true , "obj": rooms});
        }
    })
})

router.get('/room/get/:_id',function(req,res)
{
    var id = req.params._id;
    roomdb.get('room',function(err,rooms)
    {
        if(err)
        {
            if(err.message == "Key not found in database")
            {
                res.json(404,err);
            }
            else
            {
                res.json(500,err);
            }
        }
        else
        {
            var selected;
            for(var i = 0 ; i < rooms.length;i++)
            {
                if(rooms[i].uuid == id)
                {
                    selected = rooms[i];
                }
            }
            if(selected != null)
            {
                res.json({"success":true, "obj": selected});
            }
            else
            {
                res.json({"success":true,"message":"not found"})
            }
        }
    })
});


module.exports = router;