"use strict";

var _require = require('apollo-server-express'),
    AuthenticationError = _require.AuthenticationError;

var _require2 = require('../models'),
    User = _require2.User,
    _DIY = _require2.DIY,
    Comment = _require2.Comment,
    Like = _require2.Like;

var _require3 = require('../utils/auth'),
    signToken = _require3.signToken;

var _require4 = require('graphql-subscriptions'),
    PubSub = _require4.PubSub;

var pubsub = new PubSub();
var resolvers = {
  Query: {
    // get a user by username
    me: function me(parent, args, context) {
      var userData;
      return regeneratorRuntime.async(function me$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!context.user) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return regeneratorRuntime.awrap(User.findById(context.user._id).select('-__v -password').populate('DIYs').populate({
                path: 'comments',
                populate: {
                  path: 'DIY'
                }
              }).populate('likes') // Populate the likes field in users
              .populate('savedDIYs') // Populate the savedDIYs field in users
              .exec());

            case 3:
              userData = _context.sent;
              return _context.abrupt("return", userData);

            case 5:
              throw new AuthenticationError('Not logged in');

            case 6:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    // get all users
    users: function users() {
      var usersData;
      return regeneratorRuntime.async(function users$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(User.find().select('-__v -password').populate('DIYs').populate({
                path: 'comments',
                populate: {
                  path: 'DIY'
                }
              }).populate('likes') // Populate the likes field in users
              .populate('savedDIYs') // Populate the savedDIYs field in users
              .exec());

            case 3:
              usersData = _context2.sent;
              return _context2.abrupt("return", usersData);

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              console.error('Error fetching users data:', _context2.t0);
              throw new Error('Unable to fetch users data');

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 7]]);
    },
    //get a single DIY by _id
    DIY: function DIY(parent, _ref) {
      var _id, DIYData;

      return regeneratorRuntime.async(function DIY$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _id = _ref._id;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_DIY.findById(_id).populate('user').populate('comments').populate('likes').exec());

            case 3:
              DIYData = _context3.sent;
              return _context3.abrupt("return", DIYData);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      });
    },
    //this one filters by username //but if username is not provided, it will return all DIYs
    DIYs: function DIYs(parent, _ref2) {
      var username, params, DIYsData;
      return regeneratorRuntime.async(function DIYs$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              username = _ref2.username;
              params = username ? {
                username: username
              } : {};
              _context4.next = 4;
              return regeneratorRuntime.awrap(_DIY.find(params).sort({
                createdAt: -1
              }).populate('user').populate('comments').populate('likes').exec());

            case 4:
              DIYsData = _context4.sent;
              return _context4.abrupt("return", DIYsData);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      });
    },
    //and here we get all DIYs without filtering any particular user
    allDIYs: function allDIYs() {
      var allDIYsData;
      return regeneratorRuntime.async(function allDIYs$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_DIY.find().populate('user'));

            case 3:
              allDIYsData = _context5.sent;
              return _context5.abrupt("return", allDIYsData);

            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5["catch"](0);
              console.error('Error fetching all DIYs:', _context5.t0);
              throw new Error('Unable to fetch DIYs data');

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 7]]);
    },
    popular_DIYS: function popular_DIYS() {
      var popularDIYs;
      return regeneratorRuntime.async(function popular_DIYS$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(_DIY.aggregate([{
                $lookup: {
                  from: 'likes',
                  localField: '_id',
                  foreignField: 'DIYId',
                  as: 'likes'
                }
              }, {
                $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
                  images: 1,
                  likes: {
                    $size: '$likes'
                  } // Count the number of likes

                }
              }, {
                $sort: {
                  likes: -1
                } // Sort in descending order of likes

              }, {
                $limit: 8 // Limit the result to the top 5

              }]));

            case 3:
              popularDIYs = _context6.sent;
              return _context6.abrupt("return", popularDIYs);

            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6["catch"](0);
              throw new Error('Failed to fetch popular DIYs: ' + _context6.t0.message);

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 7]]);
    },
    //search DIYs by title or description
    searchDIYs: function searchDIYs(parent, _ref3) {
      var searchTerm, searchResults, allDIYs;
      return regeneratorRuntime.async(function searchDIYs$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              searchTerm = _ref3.searchTerm;

              if (!searchTerm) {
                _context7.next = 6;
                break;
              }

              _context7.next = 4;
              return regeneratorRuntime.awrap(_DIY.find({
                $or: [{
                  title: {
                    $regex: searchTerm,
                    $options: 'i'
                  }
                }, {
                  description: {
                    $regex: searchTerm,
                    $options: 'i'
                  }
                }]
              }, null, {
                sort: {
                  createdAt: -1
                }
              }).populate('user'));

            case 4:
              searchResults = _context7.sent;
              return _context7.abrupt("return", searchResults);

            case 6:
              _context7.next = 8;
              return regeneratorRuntime.awrap(_DIY.find().populate('user'));

            case 8:
              allDIYs = _context7.sent;
              return _context7.abrupt("return", allDIYs);

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      });
    },
    getSavedDIYs: function getSavedDIYs(parent, args, context) {
      var user;
      return regeneratorRuntime.async(function getSavedDIYs$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!context.user) {
                _context8.next = 5;
                break;
              }

              _context8.next = 3;
              return regeneratorRuntime.awrap(User.findById(context.user._id).populate('savedDIYs'));

            case 3:
              user = _context8.sent;
              return _context8.abrupt("return", user.savedDIYs);

            case 5:
              throw new AuthenticationError('Error!');

            case 6:
            case "end":
              return _context8.stop();
          }
        }
      });
    },
    //get all comments by DIY id
    getComments: function getComments(parent, _ref4) {
      var DIYId, comments;
      return regeneratorRuntime.async(function getComments$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              DIYId = _ref4.DIYId;
              _context9.prev = 1;
              _context9.next = 4;
              return regeneratorRuntime.awrap(Comment.find({
                DIY: DIYId
              }).sort({
                createdAt: -1
              }).populate('user') // Populate the user field for each comment
              .exec());

            case 4:
              comments = _context9.sent;
              return _context9.abrupt("return", comments);

            case 8:
              _context9.prev = 8;
              _context9.t0 = _context9["catch"](1);
              console.error('Error fetching comments:', _context9.t0);
              throw new Error('Unable to fetch comments');

            case 12:
            case "end":
              return _context9.stop();
          }
        }
      }, null, null, [[1, 8]]);
    },
    //get all likes by DIY id
    getLikes: function getLikes(parent, _ref5) {
      var DIYId, likes;
      return regeneratorRuntime.async(function getLikes$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              DIYId = _ref5.DIYId;
              _context10.prev = 1;
              _context10.next = 4;
              return regeneratorRuntime.awrap(Like.find({
                DIY: DIYId
              }).sort({
                createdAt: -1
              }).populate('user'));

            case 4:
              likes = _context10.sent;
              return _context10.abrupt("return", likes);

            case 8:
              _context10.prev = 8;
              _context10.t0 = _context10["catch"](1);
              console.error('Error fetching likes:', _context10.t0);
              throw new Error('Unable to fetch likes');

            case 12:
            case "end":
              return _context10.stop();
          }
        }
      }, null, null, [[1, 8]]);
    },
    //get all users who liked a DIY
    getLikedUsers: function getLikedUsers(parent, _ref6) {
      var DIYId, likes, users;
      return regeneratorRuntime.async(function getLikedUsers$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              DIYId = _ref6.DIYId;
              _context11.prev = 1;
              _context11.next = 4;
              return regeneratorRuntime.awrap(Like.find({
                DIY: DIYId
              }).sort({
                createdAt: -1
              }).populate('user'));

            case 4:
              likes = _context11.sent;
              users = likes.map(function (like) {
                return like.user;
              });
              return _context11.abrupt("return", users);

            case 9:
              _context11.prev = 9;
              _context11.t0 = _context11["catch"](1);
              console.error('Error fetching liked users:', _context11.t0);
              throw new Error('Unable to fetch liked users');

            case 13:
            case "end":
              return _context11.stop();
          }
        }
      }, null, null, [[1, 9]]);
    }
  },
  Mutation: {
    addUser: function addUser(parent, _ref7) {
      var username, email, password, user, token;
      return regeneratorRuntime.async(function addUser$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              username = _ref7.username, email = _ref7.email, password = _ref7.password;
              _context12.next = 3;
              return regeneratorRuntime.awrap(User.create({
                username: username,
                email: email,
                password: password
              }));

            case 3:
              user = _context12.sent;
              token = signToken(user);
              return _context12.abrupt("return", {
                token: token,
                user: user
              });

            case 6:
            case "end":
              return _context12.stop();
          }
        }
      });
    },
    // login a user, sign a token
    login: function login(parent, _ref8) {
      var email, password, user, correctPw, token;
      return regeneratorRuntime.async(function login$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              email = _ref8.email, password = _ref8.password;
              _context13.next = 3;
              return regeneratorRuntime.awrap(User.findOne({
                email: email
              }));

            case 3:
              user = _context13.sent;

              if (user) {
                _context13.next = 6;
                break;
              }

              throw new AuthenticationError('No user found with this email address');

            case 6:
              _context13.next = 8;
              return regeneratorRuntime.awrap(user.isCorrectPassword(password));

            case 8:
              correctPw = _context13.sent;

              if (correctPw) {
                _context13.next = 11;
                break;
              }

              throw new AuthenticationError('Incorrect credentials');

            case 11:
              token = signToken(user);
              return _context13.abrupt("return", {
                token: token,
                user: user
              });

            case 13:
            case "end":
              return _context13.stop();
          }
        }
      });
    },
    addDIY: function addDIY(parent, args, context) {
      var title, description, materialsUsed, instructions, images, newDIY, createdDIY, populatedDIY;
      return regeneratorRuntime.async(function addDIY$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              if (!context.user) {
                _context14.next = 13;
                break;
              }

              title = args.title, description = args.description, materialsUsed = args.materialsUsed, instructions = args.instructions, images = args.images;
              newDIY = {
                title: title,
                description: description,
                materialsUsed: materialsUsed,
                instructions: instructions,
                images: images,
                user: context.user._id
              };
              _context14.next = 5;
              return regeneratorRuntime.awrap(_DIY.create(newDIY));

            case 5:
              createdDIY = _context14.sent;
              _context14.next = 8;
              return regeneratorRuntime.awrap(User.findByIdAndUpdate(context.user._id, {
                $push: {
                  DIYs: createdDIY._id
                }
              }));

            case 8:
              _context14.next = 10;
              return regeneratorRuntime.awrap(_DIY.findById(createdDIY._id).populate('user').populate('comments').exec());

            case 10:
              populatedDIY = _context14.sent;
              pubsub.publish('NEW_DIY', {
                newDIY: populatedDIY
              });
              return _context14.abrupt("return", populatedDIY);

            case 13:
              throw new AuthenticationError('You need to be logged in!');

            case 14:
            case "end":
              return _context14.stop();
          }
        }
      });
    },
    addComment: function addComment(_, _ref9, context) {
      var DIYId, content, newComment, populatedComment;
      return regeneratorRuntime.async(function addComment$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              DIYId = _ref9.DIYId, content = _ref9.content;
              _context15.prev = 1;

              if (!context.user) {
                _context15.next = 15;
                break;
              }

              _context15.next = 5;
              return regeneratorRuntime.awrap(Comment.create({
                content: content,
                user: context.user._id,
                DIY: DIYId
              }));

            case 5:
              newComment = _context15.sent;
              _context15.next = 8;
              return regeneratorRuntime.awrap(_DIY.findByIdAndUpdate(DIYId, {
                $push: {
                  comments: newComment._id
                }
              }));

            case 8:
              _context15.next = 10;
              return regeneratorRuntime.awrap(User.findByIdAndUpdate(context.user._id, {
                $push: {
                  comments: newComment._id
                }
              }));

            case 10:
              _context15.next = 12;
              return regeneratorRuntime.awrap(Comment.findById(newComment._id).populate('user').exec());

            case 12:
              populatedComment = _context15.sent;
              //publish the new event
              pubsub.publish("NEW_COMMENT_".concat(DIYId), {
                newComment: populatedComment
              });
              return _context15.abrupt("return", populatedComment);

            case 15:
              throw new AuthenticationError('You need to be logged in to add a comment.');

            case 18:
              _context15.prev = 18;
              _context15.t0 = _context15["catch"](1);
              console.error('Failed to add the comment:', _context15.t0);
              throw new Error('Failed to add the comment.');

            case 22:
            case "end":
              return _context15.stop();
          }
        }
      }, null, null, [[1, 18]]);
    },
    removeComment: function removeComment(_, _ref10, context) {
      var commentId, comment;
      return regeneratorRuntime.async(function removeComment$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              commentId = _ref10.commentId;
              _context16.prev = 1;

              if (!context.user) {
                _context16.next = 15;
                break;
              }

              _context16.next = 5;
              return regeneratorRuntime.awrap(Comment.findById(commentId));

            case 5:
              comment = _context16.sent;

              if (!(comment.user.toString() === context.user._id.toString())) {
                _context16.next = 14;
                break;
              }

              _context16.next = 9;
              return regeneratorRuntime.awrap(_DIY.findByIdAndUpdate(comment.DIY, {
                $pull: {
                  comments: commentId
                }
              }));

            case 9:
              _context16.next = 11;
              return regeneratorRuntime.awrap(Comment.findByIdAndRemove(commentId));

            case 11:
              return _context16.abrupt("return", comment);

            case 14:
              throw new AuthenticationError('You are not authorized to remove this comment.');

            case 15:
              throw new AuthenticationError('You need to be logged in to remove a comment.');

            case 18:
              _context16.prev = 18;
              _context16.t0 = _context16["catch"](1);
              throw new UserInputError('Failed to remove the comment.', {
                errors: _context16.t0.errors
              });

            case 21:
            case "end":
              return _context16.stop();
          }
        }
      }, null, null, [[1, 18]]);
    },
    saveDIY: function saveDIY(parent, _ref11, context) {
      var DIYId, updatedUser;
      return regeneratorRuntime.async(function saveDIY$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              DIYId = _ref11.DIYId;

              if (!context.user) {
                _context17.next = 6;
                break;
              }

              _context17.next = 4;
              return regeneratorRuntime.awrap(User.findOneAndUpdate({
                _id: context.user._id
              }, {
                $push: {
                  savedDIYs: DIYId
                }
              }, {
                "new": true
              }).populate('savedDIYs'));

            case 4:
              updatedUser = _context17.sent;
              return _context17.abrupt("return", updatedUser);

            case 6:
              throw new AuthenticationError('You need to be logged in!');

            case 7:
            case "end":
              return _context17.stop();
          }
        }
      });
    },
    removeDIY: function removeDIY(parent, _ref12, context) {
      var DIYId, DIYToRemove;
      return regeneratorRuntime.async(function removeDIY$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              DIYId = _ref12.DIYId;
              _context18.prev = 1;

              if (!context.user) {
                _context18.next = 15;
                break;
              }

              _context18.next = 5;
              return regeneratorRuntime.awrap(_DIY.findById(DIYId));

            case 5:
              DIYToRemove = _context18.sent;

              if (!(DIYToRemove.user.toString() === context.user._id.toString())) {
                _context18.next = 14;
                break;
              }

              _context18.next = 9;
              return regeneratorRuntime.awrap(_DIY.findByIdAndRemove(DIYId));

            case 9:
              _context18.next = 11;
              return regeneratorRuntime.awrap(User.findByIdAndUpdate(context.user._id, {
                $pull: {
                  DIYs: DIYId
                }
              }));

            case 11:
              return _context18.abrupt("return", DIYToRemove);

            case 14:
              throw new AuthenticationError('You are not authorized to remove this DIY.');

            case 15:
              throw new AuthenticationError('You need to be logged in to remove a DIY.');

            case 18:
              _context18.prev = 18;
              _context18.t0 = _context18["catch"](1);
              throw new UserInputError('Failed to remove the DIY.', {
                errors: _context18.t0.errors
              });

            case 21:
            case "end":
              return _context18.stop();
          }
        }
      }, null, null, [[1, 18]]);
    },
    removeSavedDIY: function removeSavedDIY(parent, _ref13, context) {
      var DIYId, DIYToRemove, user, hasSavedDIY;
      return regeneratorRuntime.async(function removeSavedDIY$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              DIYId = _ref13.DIYId;
              _context19.prev = 1;

              if (!context.user) {
                _context19.next = 17;
                break;
              }

              _context19.next = 5;
              return regeneratorRuntime.awrap(_DIY.findById(DIYId));

            case 5:
              DIYToRemove = _context19.sent;

              if (DIYToRemove) {
                _context19.next = 8;
                break;
              }

              throw new Error('DIY not found');

            case 8:
              _context19.next = 10;
              return regeneratorRuntime.awrap(User.findById(context.user._id));

            case 10:
              user = _context19.sent;
              hasSavedDIY = user.savedDIYs.includes(DIYId);

              if (hasSavedDIY) {
                _context19.next = 14;
                break;
              }

              throw new Error('DIY is not saved by the user');

            case 14:
              _context19.next = 16;
              return regeneratorRuntime.awrap(User.findByIdAndUpdate(context.user._id, {
                $pull: {
                  savedDIYs: DIYId
                }
              }));

            case 16:
              return _context19.abrupt("return", DIYToRemove);

            case 17:
              throw new AuthenticationError('You need to be logged in to remove a saved DIY.');

            case 20:
              _context19.prev = 20;
              _context19.t0 = _context19["catch"](1);
              throw new Error("Failed to remove the saved DIY: ".concat(_context19.t0.message));

            case 23:
            case "end":
              return _context19.stop();
          }
        }
      }, null, null, [[1, 20]]);
    },
    addLike: function addLike(parent, args, context) {
      var DIYId, newLike;
      return regeneratorRuntime.async(function addLike$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              if (!context.user) {
                _context20.next = 13;
                break;
              }

              DIYId = args.DIYId; // Create a new Like document

              _context20.next = 4;
              return regeneratorRuntime.awrap(Like.create({
                user: context.user._id,
                DIY: DIYId
              }));

            case 4:
              newLike = _context20.sent;
              _context20.next = 7;
              return regeneratorRuntime.awrap(_DIY.findOneAndUpdate({
                _id: DIYId
              }, {
                $addToSet: {
                  likes: newLike._id
                }
              }));

            case 7:
              _context20.next = 9;
              return regeneratorRuntime.awrap(User.findOneAndUpdate({
                _id: context.user._id
              }, {
                $addToSet: {
                  likes: newLike._id
                }
              }));

            case 9:
              //publish the new event
              pubsub.publish("NEW_LIKE_".concat(DIYId), {
                newLike: newLike
              });
              _context20.next = 12;
              return regeneratorRuntime.awrap(_DIY.findById(DIYId).populate('likes'));

            case 12:
              return _context20.abrupt("return", _context20.sent);

            case 13:
              throw new AuthenticationError('You need to be logged in!');

            case 14:
            case "end":
              return _context20.stop();
          }
        }
      });
    },
    removeLike: function removeLike(parent, args, context) {
      var DIYId;
      return regeneratorRuntime.async(function removeLike$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              if (!context.user) {
                _context21.next = 11;
                break;
              }

              DIYId = args.DIYId; // Delete the Like document

              _context21.next = 4;
              return regeneratorRuntime.awrap(Like.findOneAndDelete({
                user: context.user._id,
                DIY: DIYId
              }));

            case 4:
              _context21.next = 6;
              return regeneratorRuntime.awrap(_DIY.findOneAndUpdate({
                _id: DIYId
              }, {
                $pull: {
                  likes: {
                    user: context.user._id
                  }
                }
              }));

            case 6:
              _context21.next = 8;
              return regeneratorRuntime.awrap(User.findOneAndUpdate({
                _id: context.user._id
              }, {
                $pull: {
                  likes: {
                    DIY: DIYId
                  }
                }
              }));

            case 8:
              _context21.next = 10;
              return regeneratorRuntime.awrap(_DIY.findById(DIYId).populate('likes'));

            case 10:
              return _context21.abrupt("return", _context21.sent);

            case 11:
              throw new AuthenticationError('You need to be logged in!');

            case 12:
            case "end":
              return _context21.stop();
          }
        }
      });
    },
    uploadDIYImage: function uploadDIYImage(_, _ref14) {
      var file, DIYId, _ref15, createReadStream, filename, stream, urlPath, updatedDIY;

      return regeneratorRuntime.async(function uploadDIYImage$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              file = _ref14.file, DIYId = _ref14.DIYId;
              _context22.prev = 1;
              _context22.next = 4;
              return regeneratorRuntime.awrap(file);

            case 4:
              _ref15 = _context22.sent;
              createReadStream = _ref15.createReadStream;
              filename = _ref15.filename;
              // Destructure the file object returned from the client
              stream = createReadStream();
              _context22.next = 10;
              return regeneratorRuntime.awrap(storeUpload({
                stream: stream,
                filename: filename
              }));

            case 10:
              urlPath = _context22.sent;
              _context22.next = 13;
              return regeneratorRuntime.awrap(_DIY.findByIdAndUpdate(DIYId, {
                $push: {
                  images: urlPath
                }
              }, {
                "new": true
              }));

            case 13:
              updatedDIY = _context22.sent;
              return _context22.abrupt("return", {
                filename: filename,
                urlPath: urlPath,
                updatedDIY: updatedDIY
              });

            case 17:
              _context22.prev = 17;
              _context22.t0 = _context22["catch"](1);
              console.error(_context22.t0);
              throw new Error('Failed to upload DIY image.');

            case 21:
            case "end":
              return _context22.stop();
          }
        }
      }, null, null, [[1, 17]]);
    }
  },
  //Subscription which will be used to notify the client when a new DIY is created/ or instant update
  Subscription: {
    newDIY: {
      subscribe: function subscribe(_, __, _ref16) {
        var pubsub = _ref16.pubsub;
        return pubsub.asyncIterator('NEW_DIY');
      }
    },
    newComment: {
      subscribe: function subscribe(_, _ref17, _ref18) {
        var DIYId = _ref17.DIYId;
        var pubsub = _ref18.pubsub;
        return pubsub.asyncIterator("NEW_COMMENT_".concat(DIYId));
      }
    },
    newLike: {
      subscribe: function subscribe(_, _ref19, _ref20) {
        var DIYId = _ref19.DIYId;
        var pubsub = _ref20.pubsub;
        return pubsub.asyncIterator("NEW_LIKE_".concat(DIYId));
      }
    },
    savedDIY: {
      subscribe: function subscribe(_, __, _ref21) {
        var pubsub = _ref21.pubsub;
        return pubsub.asyncIterator('SAVED_DIY');
      }
    }
  }
};
module.exports = resolvers;