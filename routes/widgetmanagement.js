var express = require('express');
var router = express.Router();
var db = require('./connection');
var person = require('./person');
var persondb = db.sublevel('person');

router.get('/widgetmanagement/datasource',function(req,res)
{

    persondb.get('person', function (err, person) {
        if (err)
            if (err.message == "Key not found in database") {
                res.json({ "success": true, "message": "no data", "obj": [] });
            }
            else {
               
                res.json(500, err);
            }
        
        else 
         var listobj = [];
                for(var i = 0 ; i < person.length;i++)
                {
                    if(person[i].disable == false)
                    {
                        listobj.push(person[i])
                    }
                }

         var datasource = [
       {
           "sourcename": "Person",
           "field": [
               "uuid",
               "version",
               "name",
               "nick"
           ],
           "data" : listobj
       },
       {
           "sourcename": "Room",
           "field": [
               "uuid",
               "name",
               "parentname",
               "location"
           ]
       }

   ]
     res.json({"success": true, "obj": datasource});   
});
});

router.get('/widgetmanagement/datasourcedetail',function(req,res)
{
  
    
});





module.exports = router;