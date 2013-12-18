if (Meteor.isClient) {
  Template.upload.events({
    'change input[type=file]': function (e, tmpl) {
      var file = e.currentTarget.files[0];

      Meteor.call('getSignedUrl', function (err, url) {
        if (err)
          throw err;

        var fd = new FormData;
        fd.append('file', file);

        var req = new XMLHttpRequest();
        req.open('PUT', url, true);
        req.onreadystatechange = function (aEvt) {
          if (req.readyState == 4) {
            if(req.status == 200)
              console.log(req.responseText);
            else
              console.log("Error loading page\n", req.status, req);
          }
        };
        req.onerror = function (e) {
          console.log('ERROR', e);
        };

        req.send(fd);
      });
    }
  });
}

var getSignedUrl = function () {
  return Meteor.call('getSignedUrl');
};

if (Meteor.isServer) {
  var fs = Npm.require('fs');

  s3 = new AWS.S3({
    accessKeyId: 'KEY',
    secretAccessKey:
      fs.readFileSync('PATH', 'utf-8'),
    endpoint: 'https://testBucketUserUpload.s3.amazonaws.com'
  });

  getSignedUrlSync = Meteor._wrapAsync(_.bind(s3.getSignedUrl, s3));

  params = {
    Bucket: 'testBucketUserUpload',
    Key: 'uploads/test'
  };

  Meteor.methods({
    'getSignedUrl': function () {
      return getSignedUrlSync('putObject', params);
    }
  });
}
