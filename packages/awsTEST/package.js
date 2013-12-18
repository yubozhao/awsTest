Package.describe({
  summary: 'AWS package'
});

Package.on_use(function (api) {
  Npm.depends({
    'aws-sdk':'2.0.0-rc3',
    'mime': '1.2.11'
  });

  api.use('underscore');

  api.add_files('aws.js', 'server');

  api.export(['AWS', 'mime'], 'server');
});
