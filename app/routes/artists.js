'use strict';

var multiparty = require('multiparty');
var fs = require('fs');
var artists = global.nss.db.collection('artists');
// var Mongo = require('mongodb');

exports.index = (req, res)=>{
  artists.find().toArray((err, artists)=>{
    res.render('artists/index', {artists: artists, title: 'nodeTunes: Artists'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

    form.parse(req, (err, fields, files)=>{

      if(!fs.existsSync(`${__dirname}/../static/img/${fields.name[0]}`)){
        var artist = {};
        artist.name = fields.name[0];

         files.photo.forEach(p=>{
            fs.mkdirSync(`${__dirname}/../static/img/${fields.name[0]}`);
            fs.renameSync(p.path, `${__dirname}/../static/img/${fields.name[0]}/${p.originalFilename}`);
            artist.photo = (p.originalFilename);
        });

          artists.save(artist, ()=>res.redirect('/artists'));
        }else{
            res.redirect('/');
          }
  });
};
