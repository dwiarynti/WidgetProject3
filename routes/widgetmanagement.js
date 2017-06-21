var express = require('express');
var router = express.Router();



router.get('/widgetmanagement/datasource',function(req,res)
{

   var datasource = [
       {
           "sourcename": "Person",
           "field": [
               "uuid",
               "version",
               "name",
               "nick"
           ]
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





module.exports = router;