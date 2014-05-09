'use strict';

var multiparty = require('multiparty');
var fs = require('fs');
var albums = global.nss.db.collection('albums');
// var Mongo = require('mongodb');

exports.index = (req, res)=>{
  res.render('albums/index', {title: 'nodeTunes: Albums'});
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

    form.parse(req, (err, fields, files)=>{

      if(!fs.existsSync(`${__dirname}/../static/img/${fields.albumName[0]}`)){
        var album = {};
        album.albumName = fields.albumName[0];

        files.albumPhoto.forEach(p=>{
            fs.mkdirSync(`${__dirname}/../static/img/${fields.albumName[0]}`);
            fs.renameSync(p.path, `${__dirname}/../static/img/${fields.albumName[0]}/${p.originalFilename}`);
            album.albumPhoto = (p.originalFilename);
        });

          albums.save(album, ()=>res.redirect('/'));
        }else{
            res.redirect('/');
          }
          console.log(fields);
          console.log(files);
  });
};
