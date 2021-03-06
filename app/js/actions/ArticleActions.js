/**
 * The MIT License (MIT)
 * Copyright (c) 2016, Jeff Jenkins.
*/

const AppDispatcher = require('../dispatcher/AppDispatcher');
const Constants = require('../constants/Constants');
const ArticleApi = require('../api/ArticlesApi');


const Actions = {

  /**
   * @param  {number} start
   * @param  {number} skip
   */
  getList: function(start, skip, clearStore) {
    ArticleApi.getEntityListData(start, skip);
    if (clearStore){
      AppDispatcher.dispatch({actionType: Constants.CLEAR_ALL_ARTICLES_DATA})
    }
  },
  /**
   * @param  {number} start
   * @param  {number} skip
   */
  getListByTag: function(tag, start, skip, clearStore) {
    ArticleApi.getEntityListData(start, skip, tag);
    if (clearStore){
      AppDispatcher.dispatch({actionType: Constants.CLEAR_ALL_ARTICLES_DATA})
    }
  },

  /**
   * @param  {string} id
   */
  getById: function(id) {
    ArticleApi.getEntityDataById(id);
  },

  /**
   * @param  {obj} article data
   */
  create: function(url) {
    ArticleApi.postEntityData(url);
  },

  /**
   * @param  {obj} article data
   */
  createLink: function(id, idTo, pIndexFrom, textIndexFrom, pIndexTo, textIndexTo) {
    ArticleApi.postEntityLinkData(id, idTo, pIndexFrom, textIndexFrom, pIndexTo, textIndexTo);
  },

  /**
   * @param  {string} id
   * @param  {obj} article data
   */
  update: function(id, obj) {
    ArticleApi.putEntityData(id, obj);
  },

  /**
   * @param  {object} update
   */
  destroy: function(id) {
    ArticleApi.deleteEntityData(id);
  },

  /**
   * @param  {string} articleId
   * @param  {obj} comment data
   */
  createComment: function(articleId, obj) {
    ArticleApi.postEntityCommentData(articleId, obj);
  },

  /**
   * @param  {string} articleId
   * @param  {obj} commentId
   */
  destroyComment: function(articleId, commentId) {
    ArticleApi.deleteEntityCommentData(articleId, commentId);
  }

};

module.exports = Actions;
