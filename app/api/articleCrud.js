'use strict';

/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins @jeffj.
*/
const mongoose = require('mongoose')
const Article = mongoose.model('Article');
const _ = require('lodash');
const utils = require('../../lib/utils');
const extract = require('../../lib/extract')
const URLParse =extract.URLParse
const async = require('async');
const Connection = require('../models/connection');

const pageRequester = function(url, article, cb){
  if (article){
    cb(null, url, article)
  } else{
    extract.pageRequester(url, function(err, extractedArticle){
      cb(err, url, extractedArticle)
    });
  }
}


/**
 * Example
 */
exports.example = function (req, res){

// const q = [
//   'CREATE (Page:page {_id:{_idOne}})-[Link:sref {textIndexFrom:{_textIndexFrom},textIndexTo:{_textIndexTo}, pIndexTo:{_pIndexTo},pIndexFrom:{_pIndexFrom} } ]->(Page2:page {_id:{_idTwo}})',
//   'RETURN Page, Link'].join('\n');

// const q = [
//   'MATCH (Page:page {_id:{_idOne}})',
//   'MATCH (Page2:page {_id:{_idTwo}})',
//   'CREATE Page-[Link:sref {textIndexFrom:{_textIndexFrom},textIndexTo:{_textIndexTo}, pIndexTo:{_pIndexTo},pIndexFrom:{_pIndexFrom} } ]->Page2',
//   'RETURN Page, Link, Page2'].join('\n');


//   //
//   Connection.db.cypher({
//       query: q,
//       params: {
//           _idOne: '123a',
//           _idTwo: '456b',
//           _textIndexFrom: [1,2],
//           _pIndexFrom: 1,
//           _textIndexTo: [1,2],
//           _pIndexTo: 1
//       },
//   }, function (err, results) {
//       if (err) throw err;
//       var result = results[0];
//       if (!result) {
//         res.send({
//           err:null,
//           message: 'No Result'
//         })
//       } else {
//         //var user = result['u'];
//         res.send(result)
//       }
//   });
  
};

/**
 * Load
 */
exports.load = function (req, res, next, id){
  Article.load(id, function (err, article) {
    if (!article || (err && err.message==='Cast to ObjectId failed')) return  res.status(404).send(utils.errsForApi('Article not found'));
    if (err) return  res.status(500).send( utils.errsForApi(err.errors || err) );
    req.article = article;
    next();
  });
};

/**
 * List
 */
exports.getListController = function (req, res) {
  var skip = Number(req.query.skip)
  var count = Number(req.query.count)
  const criteria = req.query.tag?{tags:req.query.tag}:null;
  
  skip =  !isNaN(skip) ? skip : 0;
  count =  !isNaN(count) ? count : 30;
  
  var options = {
    count: count,
    skip: skip,
  };

  if (criteria){
    options.criteria = criteria
  }

  Article.list(options, function (err, result) {
    Article.count(criteria).exec(function (errCount, count) {
      if (!err) {
        res.send({
          articles:result,
          total: count
        });
      } else {
        res.status(500).send(utils.errsForApi(err.errors || err));
      }
    });
  });
};

/**
 * Create
 */
exports.getCreateController = function (req, res) {
  const q = req.body.url
  if (!q) return res.status(422).send({errors:utils.errsForApi('No Query or Valid URL')});

  async.waterfall([
      function(cb){
        var url = URLParse(q)
        if (url){
           cb(null, url)
        } else {
          cb({
            status:422,
            errors:utils.errsForApi('No Query or Valid URL'), 
            results:[]
          })
        }       
      },
      pageDBSearch,
      pageRequester,
  ], function(err, url, result){
      if (err){
        const status = err.status || 500;
        res.status(err.status).send({errors:utils.errsForApi(err.errors || err)});
      } else {
        var article = new Article(result);
        if (article.favicon)
        extract.copyAssets(
          article.favicon, 
          article.image, 
          article._id,
          function(err, results){
            article.imageCDN = results[0];
            if (results[1]===null){
              article.favicon = null
            }
            article.faviconCDN = results[1];
            article.save(function(err){
              if(err){
                console.log(err);
              }
            });
        });

        article.save(function(err){
          if(err) return res.status(500).send({errors:utils.errsForApi(err.errors || err)});
          res.send(article);
        });
      }
  });
};




/**
 * Create Connection
 */
exports.getCreateSREFController = function (req, res) {

  const body = req.body;

  const idOne = body.idOne;
  const idTwo = body.idTwo;

  const textIndexFrom = body.textIndexFrom;
  const pIndexFrom = body.pIndexFrom;

  const textIndexTo = body.textIndexTo;
  const pIndexTo = body.pIndexTo;

  Connection.createSREF(
    idOne,
    idTwo,
    textIndexFrom,
    pIndexFrom,
    textIndexTo,
    pIndexTo,
    function(err, result){
      if (!err) {
        res.send(article);
      } else {
        res.status(400).send(utils.errsForApi(err.errors || err));
      }
  })
};

/**
 * @name   pageDBSearch
 * @desc   Searches the DB for the page.
 * @param  {string}      url
 * @param  {Function}    cb  a callback for the data.
 */
function pageDBSearch(url, cb) {
  console.log(url)
  Article
    .findOne({'$or':[{ canonicalLink: url }, { queryLink: url }]})
    .exec(function(err, result){
        if (err){
          cb(err)
        } else if (result!==null) {
          cb(null, url, result);
        } else {
          cb(null, url, null);
        }
    });
}


/**
 * Load
 */
exports.getReadController = function (req, res) {
  var article = req.article
  if (!article) {
    res.status(404).send(utils.errsForApi('Article not found!!'));
  } else if (article) {
    res.send(article);
  }
};

/**
 * Update
 */
exports.getUpdateController = function (req, res) {
  var article = req.article
  var key;
  for (key in req.body) {
    article[key] = req.body[key];
  }
  const images = req.files[0]
    ? [req.files[0].path]
    : [];
  article.uploadAndSave(images, function (err) {
    if (!err) {
      res.send(article);
    } else {
      res.status(400).send(utils.errsForApi(err.errors || err));
    }
  });
};

/**
 * Delete
 */
exports.getDeleteController = function (req, res) {
  var article = req.article
  if (!article) {
    res.status(500).send(utils.errsForApi('Error loading article.'));
  } else {
    article.remove();
    article.save(function (err) {
      if (!err) {
        res.send(article);
      } else {
        res.status(500).send(utils.errsForApi(err.errors || err));
      }
    });
  }
};

/**
 * Create Comment
 */
exports.getCreateCommentController = function (req, res) {
  const article = req.article
  const user = req.user;

  if (!article) return res.status(500).send( utils.errsForApi('There was an error in your request') );
  if (!req.body.body) return res.status(422).send( utils.errsForApi('Requires a comment body'));

  article.addComment(user, req.body, function (err) {
    if (err) return res.status(500).send(errMsg(err));
    
    var articleObj = article.toObject();//Adding the populated comments from a pure JS object.
    var comments = articleObj.comments;
    comments[comments.length-1].user=_.pick(user, ['username', '_id', 'name']); //For security we only send id and username.
    res.send(articleObj);
  });
}
  

/**
 * Delete Comment
 */
exports.getDeleteCommentController = function (req, res) {
  var article = req.article;
  var commentId = req.params.commentId;
  article.removeComment(commentId, function (err) {
    if (err) {
      res.send(utils.errsForApi('There was an error in your request'));
    }
    res.send(article);
  });
};