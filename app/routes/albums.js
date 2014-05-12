'use strict';

var multiparty = require('multiparty');
var fs = require('fs');
var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');
// var Mongo = require('mongodb');

exports.index = (req, res)=>{
  artists.find().toArray((err, artists)=>{
    albums.find().toArray((err, albums)=>{
      res.render('albums/index', {artists: artists, albums: albums, title: 'nodeTunes: Albums'});
    });
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

    form.parse(req, (err, fields, files)=>{

      if(!fs.existsSync(`${__dirname}/../static/img/${fields.name[0]}/${fields.albumName[0]}`)){
        var album = {};
        album.albumName = fields.albumName[0];

        files.albumPhoto.forEach(p=>{
            fs.mkdirSync(`${__dirname}/../static/img/${fields.name[0]}/${fields.albumName[0]}`);
            fs.renameSync(p.path, `${__dirname}/../static/img/${fields.name[0]}/${fields.albumName[0]}/${p.originalFilename}`);
            album.albumPhoto = (p.originalFilename);
        });

          albums.save(album, ()=>res.redirect('/albums'));
        }else{
            res.redirect('/');
          }
          console.log(fields);
          console.log(files);
  });
};
