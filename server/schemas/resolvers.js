const { AuthenticationError } = require('apollo-server-express');
const { User, DIY, Comment, Like } = require('../models');
const { signToken } = require('../utils/auth');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const resolvers = {
    Query: {
        // get a user by username
        me: async (parent, args, context) => {
          if (context.user) {
              const userData = await User.findById(context.user._id)
                  .select('-__v -password')
                  .populate('DIYs')
                  .populate({
                      path: 'comments',
                      populate: { path: 'DIY' },
                  })
                  .populate('likes') // Populate the likes field in users
                  .populate('savedDIYs') // Populate the savedDIYs field in users
                  .exec();
      
              return userData;
          }
          throw new AuthenticationError('Not logged in');
      },
  
        // get all users
        users: async () => {
            try {
              const usersData = await User.find()
                .select('-__v -password')
                .populate('DIYs')
                .populate({
                  path: 'comments',
                  populate: { path: 'DIY' },
                })
                .populate('likes') // Populate the likes field in users
                .populate('savedDIYs') // Populate the savedDIYs field in users
                .exec();
              return usersData;
            } catch (error) {
              console.error('Error fetching users data:', error);
              throw new Error('Unable to fetch users data');
            }
          },

          //get a single DIY by _id
          DIY: async (parent, { _id }) => {
            const DIYData = await DIY.findById(_id)
              .populate('user')
              .populate('comments')
              .populate('likes')
              .exec();
          
            return DIYData;
          },
                    
          //this one filters by username //but if username is not provided, it will return all DIYs
          DIYs: async (parent, { username }) => {
            const params = username ? { username } : {};
            const DIYsData = await DIY.find(params)
              .sort({ createdAt: -1 })
              .populate('user')
              .populate('comments')
              .populate('likes')
              .exec();
          
            return DIYsData;
          },
          
          //and here we get all DIYs without filtering any particular user
          allDIYs: async () => {
            try {
                const allDIYsData = await DIY.find().populate('user');
                return allDIYsData;
            } catch (error) {
                console.error('Error fetching all DIYs:', error);
                throw new Error('Unable to fetch DIYs data');
            }
        },
        popular_DIYS: async () => {
          try {
            //  to get the top 8 DIYs with the most likes
            const popularDIYs = await DIY.aggregate([
              {
                $lookup: {
                  from: 'likes', 
                  localField: '_id',
                  foreignField: 'DIYId',
                  as: 'likes',
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
                  images: 1,
                  likes: { $size: '$likes' }, // Count the number of likes
                },
              },
              {
                $sort: { likes: -1 }, // Sort in descending order of likes
              },
              {
                $limit: 8, // Limit the result to the top 5
              },
            ]);
    
            return popularDIYs;
          } catch (error) {
            throw new Error('Failed to fetch popular DIYs: ' + error.message);
          }
        },
        //search DIYs by title or description
        searchDIYs: async (parent, { searchTerm }) => {
            if (searchTerm) {
              const searchResults = await DIY.find(
                {
                  $or: [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                  ],
                },
                null,
                { sort: { createdAt: -1 } }
              ).populate('user');
      
              return searchResults;
            }
      
            const allDIYs = await DIY.find().populate('user');
            return allDIYs;
          },

          getSavedDIYs: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id).populate('savedDIYs');
                return user.savedDIYs;
            }
            throw new AuthenticationError('Error!');
        },
        
          //get all comments by DIY id
          getComments: async (parent, { DIYId }) => {
            try {
              const comments = await Comment.find({ DIY: DIYId })
                .sort({ createdAt: -1 })
                .populate('user') // Populate the user field for each comment
                .exec();
              return comments;
            } catch (error) {
              console.error('Error fetching comments:', error);
              throw new Error('Unable to fetch comments');
            }
          },

          //get all likes by DIY id
          getLikes: async (parent, { DIYId }) => {
            try {
                const likes = await Like.find({ DIY: DIYId }).sort({ createdAt: -1 }).populate('user');
                return likes;
            } catch (error) {
                console.error('Error fetching likes:', error);
                throw new Error('Unable to fetch likes');
            }
        },
          //get all users who liked a DIY
          getLikedUsers: async (parent, { DIYId }) => {
            try {
                const likes = await Like.find({ DIY: DIYId }).sort({ createdAt: -1 }).populate('user');
                const users = likes.map((like) => like.user);
                return users;
            } catch (error) {
                console.error('Error fetching liked users:', error);
                throw new Error('Unable to fetch liked users');
            }
          },      
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

        // login a user, sign a token
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        
        addDIY: async (parent, args, context) => {
          if (context.user) {
            const { title, description, materialsUsed, instructions, images } = args;
        
            const newDIY = {
              title,
              description,
              materialsUsed,
              instructions,
              images,
              user: context.user._id,
            };
        
            const createdDIY = await DIY.create(newDIY);
        
            // Update the user's DIYs field with the newly created DIY
            await User.findByIdAndUpdate(context.user._id, { $push: { DIYs: createdDIY._id } });
        
            // Populate the created DIY and return it
            const populatedDIY = await DIY.findById(createdDIY._id)
              .populate('user')
              .populate('comments')
              .exec();

              pubsub.publish('NEW_DIY', { newDIY: populatedDIY });
        
            return populatedDIY;
          }
        
          throw new AuthenticationError('You need to be logged in!');
        },        
        
        addComment: async (_, { DIYId, content }, context) => {
          try {
              if (context.user) {
                  // Create a new comment document
                  const newComment = await Comment.create({
                      content,
                      user: context.user._id,
                      DIY: DIYId,
                  });

                  // Update the DIY's comments array
                  await DIY.findByIdAndUpdate(DIYId, { $push: { comments: newComment._id } });

                  // Update the User's comments array
                  await User.findByIdAndUpdate(context.user._id, { $push: { comments: newComment._id } });

                  // Populate the new comment and return it
                  const populatedComment = await Comment.findById(newComment._id).populate('user').exec();

                  //publish the new event
                  pubsub.publish(`NEW_COMMENT_${DIYId}`, { newComment: populatedComment });

                  return populatedComment;
              }
              throw new AuthenticationError('You need to be logged in to add a comment.');
          } catch (error) {
              console.error('Failed to add the comment:', error);
              throw new Error('Failed to add the comment.');
          }
      },
      
     
          removeComment: async (_, { commentId }, context) => {
            try {
              if (context.user) {
                // Find the comment to be removed
                const comment = await Comment.findById(commentId);
      
                // Check if the user trying to remove the comment is the comment's author
                if (comment.user.toString() === context.user._id.toString()) {
                  // Remove the comment from the DIY's comments array
                  await DIY.findByIdAndUpdate(comment.DIY, { $pull: { comments: commentId } });
      
                  // Remove the comment document
                  await Comment.findByIdAndRemove(commentId);
      
                  return comment;
                } else {
                  throw new AuthenticationError('You are not authorized to remove this comment.');
                }
              }
              throw new AuthenticationError('You need to be logged in to remove a comment.');
            } catch (error) {
              throw new UserInputError('Failed to remove the comment.', { errors: error.errors });
            }
          },
    
        saveDIY: async (parent, { DIYId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedDIYs: DIYId } },
                    { new: true }
                ).populate('savedDIYs');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        removeDIY: async (parent, { DIYId }, context) => {
          try {
            if (context.user) {
              // Find the DIY to be removed
              const DIYToRemove = await DIY.findById(DIYId);
    
              // Check if the user trying to remove the DIY is the DIY's author
              if (DIYToRemove.user.toString() === context.user._id.toString()) {
                // Remove the DIY document
                await DIY.findByIdAndRemove(DIYId);
    
                // Remove the DIY from the user's DIYs array
                await User.findByIdAndUpdate(context.user._id, {
                  $pull: { DIYs: DIYId },
                });
    
                return DIYToRemove;
              } else {
                throw new AuthenticationError(
                  'You are not authorized to remove this DIY.'
                );
              }
            }
            throw new AuthenticationError('You need to be logged in to remove a DIY.');
          } catch (error) {
            throw new UserInputError('Failed to remove the DIY.', {
              errors: error.errors,
            });
          }
        },

        removeSavedDIY: async (parent, { DIYId }, context) => {
          try {
            if (context.user) {
              // Find the DIY to be removed from savedDIYs
              const DIYToRemove = await DIY.findById(DIYId);
    
              if (!DIYToRemove) {
                throw new Error('DIY not found');
              }
    
              // Check if the user has saved the DIY
              const user = await User.findById(context.user._id);
              const hasSavedDIY = user.savedDIYs.includes(DIYId);
    
              if (!hasSavedDIY) {
                throw new Error('DIY is not saved by the user');
              }
    
              // Remove the DIY from the user's savedDIYs array
              await User.findByIdAndUpdate(context.user._id, {
                $pull: { savedDIYs: DIYId },
              });
    
              return DIYToRemove;
            }
            throw new AuthenticationError('You need to be logged in to remove a saved DIY.');
          } catch (error) {
            throw new Error(`Failed to remove the saved DIY: ${error.message}`);
          }
        },

        addLike: async (parent, args, context) => {
          if (context.user) {
            const { DIYId } = args;
        
            // Create a new Like document
            const newLike = await Like.create({
              user: context.user._id,
              DIY: DIYId,
            });
        
            // Update the DIY's likes array
            await DIY.findOneAndUpdate(
              { _id: DIYId },
              { $addToSet: { likes: newLike._id } }
            );
        
            // Update the User's likes array
            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $addToSet: { likes: newLike._id } }
            );
            //publish the new event
            pubsub.publish(`NEW_LIKE_${DIYId}`, { newLike: newLike });

            return await DIY.findById(DIYId).populate('likes');
          }
        
          throw new AuthenticationError('You need to be logged in!');
        },     

        removeLike: async (parent, args, context) => {
          if (context.user) {
            const { DIYId } = args;
        
            // Delete the Like document
            await Like.findOneAndDelete({
              user: context.user._id,
              DIY: DIYId,
            });
        
            // Update the DIY's likes array
            await DIY.findOneAndUpdate(
              { _id: DIYId },
              { $pull: { likes: { user: context.user._id } } }
            );
        
            // Update the User's likes array
            await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { likes: { DIY: DIYId } } }
            );
        
            return await DIY.findById(DIYId).populate('likes');
          }
        
          throw new AuthenticationError('You need to be logged in!');
        },

        uploadDIYImage: async (_, { file, DIYId }) => { 
          try {
            const { createReadStream, filename } = await file; // Destructure the file object returned from the client
            const stream = createReadStream();
            const urlPath = await storeUpload({ stream, filename });
    
            // Update the DIY document's images field with the URL path
            const updatedDIY = await DIY.findByIdAndUpdate(
              DIYId,
              { $push: { images: urlPath } },
              { new: true }
            );
    
            return { filename, urlPath, updatedDIY };
          } catch (error) {
            console.error(error);
            throw new Error('Failed to upload DIY image.');
          }
        },
    },
    //Subscription which will be used to notify the client when a new DIY is created/ or instant update
    Subscription: {
      newDIY: {
        subscribe: (_, __, { pubsub }) => {
          return pubsub.asyncIterator('NEW_DIY');
        },
      },
      newComment: {
        subscribe: (_, { DIYId }, { pubsub }) => {
          return pubsub.asyncIterator(`NEW_COMMENT_${DIYId}`);
        },
      },
      newLike: {
        subscribe: (_, { DIYId }, { pubsub }) => {
          return pubsub.asyncIterator(`NEW_LIKE_${DIYId}`);
        },
      },
      savedDIY : {
        subscribe: (_, __, { pubsub }) => {
          return pubsub.asyncIterator('SAVED_DIY');
        },
      },
      },
};

module.exports = resolvers;