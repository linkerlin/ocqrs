export declare enum CommandType {
    CREATE_POST = "CREATE_POST",
    UPDATE_POST = "UPDATE_POST",
    DELETE_POST = "DELETE_POST",
    CREATE_PAGE = "CREATE_PAGE",
    UPDATE_PAGE = "UPDATE_PAGE",
    DELETE_PAGE = "DELETE_PAGE",
    CREATE_USER = "CREATE_USER",
    UPDATE_USER = "UPDATE_USER",
    DELETE_USER = "DELETE_USER"
}
export interface Command {
    id: string;
    type: CommandType;
    timestamp: number;
    responseKey: string;
    data: any;
}
export declare enum QueryType {
    GET_POST = "GET_POST",
    LIST_POSTS = "LIST_POSTS",
    GET_PAGE = "GET_PAGE",
    LIST_PAGES = "LIST_PAGES",
    GET_USER = "GET_USER",
    LIST_USERS = "LIST_USERS"
}
export interface Query {
    type: QueryType;
    params: any;
}
export interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
    tags: string[];
}
export interface Page {
    id: string;
    title: string;
    content: string;
    slug: string;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
}
export interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'author' | 'subscriber';
    createdAt: string;
}
export interface CommandResponse {
    success: boolean;
    data?: any;
    error?: string;
}
export interface QueryResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
