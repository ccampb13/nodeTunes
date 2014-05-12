'use strict';

var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');

exports.index = (req, res)=>{
      artists.find().toArray((err,artists)=>{
      albums.find().toArray((err, albums)=>{
      res.render('home/index', {artists: artists, albums: albums, title: 'nodeTunes: Home'});
    });
  });
};

exports.help = (req, res)=>{
  res.render('home/help', {title: 'Node.js: Help'});
};
