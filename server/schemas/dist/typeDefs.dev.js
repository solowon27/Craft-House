"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\nscalar Upload\n\ntype Query {\n    me: User\n    users: [User]\n    DIY(_id: ID!): DIY\n    DIYs: [DIY]\n    allDIYs: [DIY]\n    popular_DIYS: [DIY]\n\n    searchDIYs(searchTerm: String): [DIY]\n\n    getSavedDIYs: [DIY]\n    getLikedUsers(DIYId: ID!): [User] \n    getLikes(DIYId: ID!): [Like]    \n    getComments(DIYId: ID): [Comment]\n}\n\ntype Mutation {\n    addUser(username: String!, email: String!, password: String!): Auth\n    login(email: String!, password: String!): Auth\n    addDIY(title: String!, description: String!, materialsUsed: [String], instructions: [String], images: [String] ): DIY\n    \n    addComment(DIYId: ID!, content: String!): DIY\n    addLike(DIYId: ID!): Like\n    saveDIY(DIYId: ID!): User\n\n    removeDIY(DIYId: ID!): User\n    removeComment(commentId: ID!): DIY\n    removeLike(DIYId: ID!): DIY\n    removeSavedDIY(DIYId: ID!): User\n\n    uploadDIYImage(file: Upload!, DIYId: ID!): File!\n\n}\n\ntype Subscription {\n    newDIY: DIY\n    newComment(DIYId: ID!): Comment\n    newLike(DIYId: ID!): Like\n    savedDIY(DIYId: ID!): DIY\n}\n\ntype Auth {\n    token: ID!\n    user: User\n}\n\ntype User {\n    _id: ID\n    username: String\n    email: String\n    DIYs: [DIY]\n    comments: [Comment]\n    likes: [Like]\n    savedDIYs: [DIY]\n    DIYCount: Int\n}\n\ntype DIY {\n    _id: ID\n    title: String\n    description: String\n    materialsUsed: [String]\n    instructions: [String]\n    images: [String]\n    user: User!\n    comments: [Comment]\n    likes: [Like]\n}\n\ntype Comment {\n    _id: ID\n    content: String\n    user: User\n    DIY: DIY\n}\n\ntype Like {\n    _id: ID!\n    user: User!\n    DIY: DIY!\n  }\n\n  type File {\n    filename: String!\n    urlPath: String!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('apollo-server'),
    gql = _require.gql;

var typeDefs = gql(_templateObject());
module.exports = typeDefs;