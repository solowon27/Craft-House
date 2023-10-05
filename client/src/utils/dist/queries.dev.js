"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET_SAVED_DIYS = exports.GET_LIKED_USERS = exports.GET_LIKES = exports.GET_COMMENTS = exports.SEARCH_DIYS = exports.GET_USER_BY_USERNAME = exports.GET_POPULAR_DIYS = exports.QUERY_DIY = exports.GET_ALL_DIYS = exports.QUERY_USERS = exports.GET_USER = exports.GET_ME = void 0;

var _client = require("@apollo/client");

function _templateObject12() {
  var data = _taggedTemplateLiteral(["\nquery GetSavedDIYs {\n  getSavedDIYs {\n    _id\n    title\n    description\n    images\n  }\n}\n"]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["\n  query GetLikedUsers($DIYId: ID!) {\n    getLikedUsers(DIYId: $DIYId) {\n      _id\n      username\n    }\n  }\n"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["\n  query GetLikes($DIYId: ID!) {\n    getLikes(DIYId: $DIYId) {\n      _id\n      user {\n        _id\n      }\n    }\n  }\n"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["\nquery GetComments($DIYId: ID!) {\n  getComments(DIYId: $DIYId) {\n    _id\n    content\n    user {\n      _id\n      username\n    }\n  }\n}\n"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n  query searchDIYs($searchTerm: String!) {\n    searchDIYs(searchTerm: $searchTerm) {\n      _id\n      title\n      description\n    }\n  }\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\nquery GetDIYsByUsername($username: String!) {\n    DIYs(username: $username) {\n      _id\n      title\n      description\n      materialsUsed\n      instructions\n      images\n      createdAt\n      user {\n        _id\n        username\n      }\n      comments {\n        _id\n        content\n        createdAt\n        user {\n          _id\n          username\n        }\n      }\n    }\n  }\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n  query GetPopularDIYS {\n    popular_DIYS {\n      _id\n      title\n      description\n      images\n    }\n  }\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\nquery GetDIY($id: ID!) {\n    DIY(_id: $id) {\n      _id\n      title\n      description\n      materialsUsed\n      instructions\n      images\n      user {\n        _id\n        username\n      }\n     }\n  }\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  query GetDIYs {\n    DIYs {\n      _id\n      title\n      description\n      materialsUsed\n      instructions\n      images\n      user {\n        _id\n        username\n      }\n    }\n  }\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\nquery GetAllUsers {\n    users {\n      _id\n      username\n      email\n      DIYs {\n        _id\n        title\n        description\n        materialsUsed\n        instructions\n        images\n        createdAt\n        user {\n          _id\n          username\n        }\n        comments {\n          _id\n          content\n          createdAt\n          user {\n            _id\n            username\n          }\n        }\n      }\n    }\n  }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\nquery GetUser($_id: ID!) {\n  user(_id: $_id) {\n    username\n  }\n}\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\nquery Me {\n    me {\n      _id\n      username\n      email\n      DIYs {\n        _id\n        title\n        description\n        materialsUsed\n        instructions\n        images\n        user {\n          _id\n          username\n        }\n      }\n    }\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

//a query to get the logged in user's data
var GET_ME = (0, _client.gql)(_templateObject()); //get single User by _id

exports.GET_ME = GET_ME;
var GET_USER = (0, _client.gql)(_templateObject2()); //a query to get all users

exports.GET_USER = GET_USER;
var QUERY_USERS = (0, _client.gql)(_templateObject3()); //a query to get all DIYs

exports.QUERY_USERS = QUERY_USERS;
var GET_ALL_DIYS = (0, _client.gql)(_templateObject4()); //a query to get a single DIY by its _id

exports.GET_ALL_DIYS = GET_ALL_DIYS;
var QUERY_DIY = (0, _client.gql)(_templateObject5());
exports.QUERY_DIY = QUERY_DIY;
var GET_POPULAR_DIYS = (0, _client.gql)(_templateObject6()); //a query to get a single user by their username

exports.GET_POPULAR_DIYS = GET_POPULAR_DIYS;
var GET_USER_BY_USERNAME = (0, _client.gql)(_templateObject7());
exports.GET_USER_BY_USERNAME = GET_USER_BY_USERNAME;
var SEARCH_DIYS = (0, _client.gql)(_templateObject8()); //get all comments for a single DIY

exports.SEARCH_DIYS = SEARCH_DIYS;
var GET_COMMENTS = (0, _client.gql)(_templateObject9()); // Get all Likes for a single DIY

exports.GET_COMMENTS = GET_COMMENTS;
var GET_LIKES = (0, _client.gql)(_templateObject10()); // Get all liked users for a single DIY

exports.GET_LIKES = GET_LIKES;
var GET_LIKED_USERS = (0, _client.gql)(_templateObject11()); //get all saved DIYs for a single user

exports.GET_LIKED_USERS = GET_LIKED_USERS;
var GET_SAVED_DIYS = (0, _client.gql)(_templateObject12());
exports.GET_SAVED_DIYS = GET_SAVED_DIYS;