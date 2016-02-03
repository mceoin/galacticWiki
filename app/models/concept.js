/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Imager = require('imager');
var config = require('../../config/config');

var imagerConfig = require(config.root + '/config/imager.js');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

/**
 * Getters
 */

var getTags = function (tags) {
    return tags.join(',');
};

/**
 * Setters
 */

var setTags = function (tags) {
    return tags.split(',');
};

/**
 * Article Schema
 */

var ConceptSchema = new Schema({
        title: {type : String, default : ''},
        body: {type : String, default : ''},
        user: {type : Schema.ObjectId, ref : 'User'},
        createdAt: {type : Date, default : Date.now},
        from:{type : Schema.ObjectId, ref : 'Site'},
        annotation:{type : Schema.ObjectId, ref : 'Site'},
        to:{type : Schema.ObjectId, ref : 'Site'}
    });

/**
 * Validations
 */

ConceptSchema.path('title').required(true, 'Article title cannot be blank');
ConceptSchema.path('body').required(true, 'Article body cannot be blank');

/**
 * Pre-remove hook
 */

ConceptSchema.pre('remove', function (next) {
    var imager = new Imager(imagerConfig, 'S3');
    var files = this.image.files;

    // if there are files associated with the item, remove from the cloud too
    imager.remove(files, function (err) {
        if (err) return next(err);
    }, 'article');

    next();
});

/**
 * Methods
 */

ConceptSchema.methods = {

    /**
     * Save article and upload image
     *
     * @param {Object} images
     * @param {Function} cb
     * @api private
     */

    uploadAndSave: function (images, cb) {
        if (!images || !images.length) return this.save(cb)

        var imager = new Imager(imagerConfig, 'S3');
        var self = this;

        this.validate(function (err) {
            if (err) return cb(err);
            imager.upload(images, function (err, cdnUri, files) {
                if (err) return cb(err);
                if (files.length) {
                    self.image = {cdnUri : cdnUri, files : files};
                }
                self.save(cb);
            }, 'article');
        });
    },

    /**
     * Add comment
     *
     * @param {User} user
     * @param {Object} comment
     * @param {Function} cb
     * @api private
     */

    addComment: function (user, comment, cb) {
        var notify = require('../mailer');

        this.comments.push({
            body: comment.body,
            user: user._id
        });

        if (!this.user.email) this.user.email = 'email@product.com';
        notify.comment({
            article: this,
            currentUser: user,
            comment: comment.body
        });

        this.save(cb);
    },

    /**
     * Remove comment
     *
     * @param {commentId} String
     * @param {Function} cb
     * @api private
     */

    removeComment: function (commentId, cb) {
        var index = utils.indexof(this.comments, {id: commentId});
        if (~index) this.comments.splice(index, 1);
        else return cb('not found');
        this.save(cb);
    }
}

/**
 * Statics
 */

ConceptSchema.statics = {

    /**
     * Find article by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */

    load: function (id, cb) {
        this.findOne({_id : id})
          .populate('user', 'name email username')
          .populate('comments.user')
          .exec(cb);
    },

    /**
     * List articles
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function (options, cb) {
        var criteria = options.criteria || {}

        this.find(criteria)
          .populate('user', 'name username')
          .sort({'createdAt': -1}) // sort by date
          .limit(options.perPage)
          .skip(options.perPage * options.page)
          .exec(cb);
    }
}

mongoose.model('Concept', ConceptSchema);