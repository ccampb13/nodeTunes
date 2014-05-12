/* jshint unused:false */

'use strict';

var multiparty = require('multiparty');
var fs = require('fs');
var songs = global.nss.db.collection('songs');
var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');
var Mongo = require('mongodb');

exports.index = (req, res)=>{
    artists.find().toArray((err, artists)=>{
      albums.find().toArray((err, albums)=>{
        songs.find().toArray((err, songs)=>{
          res.render('songs/index', {songs: songs, artists: artists, albums: albums, title: 'nodeTunes: Songs'});
        });
      });
    });
};

exports.create = (req, res)=>{
  var path = require('path');
  var form = new multiparty.Form();

    form.parse(req, (err, fields, files)=>{
       var name       = fields.songName[0];
       var normalized = name.split(' ').map(w=>w.trim()).map(w=>w.toLowerCase()).join('');
       var genres     = fields.genres[0].split(',').map(w=>w.trim()).map(w=>w.toLowerCase());
       var artistId   = fields.name[0];
       var albumId    = fields.albumName[0];
       var extension  = path.extname(files.audioFile[0].path);
       var newPathRel = `/audios/${artistId}/${albumId}/${normalized}${extension}`;

       var bseDir     = `${__dirname}/../static/audios`;
       var artDir     = `${bseDir}/${artistId}`;
       var albDir     = `${artDir}/${albumId}`;
       var newPathAbs = `${albDir}/${normalized}${extension}`;
       var oldPathAbs = files.audioFile[0].path;


        if(!fs.existsSync(artDir)){fs.mkdirSync(artDir);}
        if(!fs.existsSync(albDir)){fs.mkdirSync(albDir);}
        fs.renameSync(oldPathAbs, newPathAbs);

        var song      = {};

        song.name     = name;
        song.genres   = genres;
        song.artistId = artistId;
        song.albumId  = albumId;
        song.file     = newPathRel;

        songs.save(song, ()=>res.redirect('/songs'));

        console.log(fields);
        console.log(files);
        console.log(song);


  });
};
