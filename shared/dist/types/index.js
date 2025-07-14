"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryType = exports.CommandType = void 0;
// Command types
var CommandType;
(function (CommandType) {
    CommandType["CREATE_POST"] = "CREATE_POST";
    CommandType["UPDATE_POST"] = "UPDATE_POST";
    CommandType["DELETE_POST"] = "DELETE_POST";
    CommandType["CREATE_PAGE"] = "CREATE_PAGE";
    CommandType["UPDATE_PAGE"] = "UPDATE_PAGE";
    CommandType["DELETE_PAGE"] = "DELETE_PAGE";
    CommandType["CREATE_USER"] = "CREATE_USER";
    CommandType["UPDATE_USER"] = "UPDATE_USER";
    CommandType["DELETE_USER"] = "DELETE_USER";
})(CommandType || (exports.CommandType = CommandType = {}));
// Query types
var QueryType;
(function (QueryType) {
    QueryType["GET_POST"] = "GET_POST";
    QueryType["LIST_POSTS"] = "LIST_POSTS";
    QueryType["GET_PAGE"] = "GET_PAGE";
    QueryType["LIST_PAGES"] = "LIST_PAGES";
    QueryType["GET_USER"] = "GET_USER";
    QueryType["LIST_USERS"] = "LIST_USERS";
})(QueryType || (exports.QueryType = QueryType = {}));
//# sourceMappingURL=index.js.map