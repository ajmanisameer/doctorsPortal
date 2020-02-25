var _ = require('underscore'),
AWS = require('aws-sdk'),
fs = require('fs'),
path = require('path'),
flow = require('flow');
// const config = require('../config.json')

configPath = path.join(__dirname, '..', "config.json");

AWS.config.loadFromPath(configPath);

exports.s3 = function(req, res) {
var s3 = new AWS.S3(),
    file = req.file,
    result = {
        error: 0,
        uploaded: []
    };

flow.exec(
    function() { // Read temp File
        fs.readFile(file.path, this);
    },
    function(err, data) { // Upload file to S3
        s3.putObject({
            Bucket: 'medical-images', //Bucket Name
            Key: file.originalname, //Upload File Name, Default the original name
            Body: data
        }, this);
    },
    function(err, data) { //Upload Callback
        if (err) {
            console.error('Error : ' + err);
            result.error++;
        }
        result.uploaded.push(data.ETag);
        this();
    },
    function() {
        res.send({msg: "Uploaded"});
    });
};


(async function(){
    try{

        AWS.config.setPromisesDependency();

        AWS.config.update({
            accessKeyId: "AKIAIT63T5EPJ4OZWALA",
            secretAccessKey: "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",
            region: 'us-east-1'
        });

        const s3 = new AWS.S3();
        const response = await s3.listObjectsV2({
            Bucket: 'medical-images', 
        }).promise();

        console.log(response);

    } catch(e){
        console.log('our error', e)
    }

        debugger;
    
})();

// var awsConfig = require('aws-config');
// // var AWS = require('aws-sdk');

// router.get('/export', function(req, res, next) {
//     var file = 'df.csv';
//     console.log('Trying to download file', fileKey);

//     var s3 = new AWS.S3({});

//     var options = {
//         Bucket: 'your-bucket-name',
//         Key: file,
//     };

//     s3.getObject(options, function(err, data) {
//       res.attachment(file);
//       res.send(data.Body);
//   });
// });
