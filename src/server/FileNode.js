import Node from "./../Node";

//! This file is assumed to be run on the server side of NodeJS and leverages scripts accordingly
//TODO Create a file reading and writing event system that can be invoked with <Message>
export default class FileNode extends Node {
    constructor(state) {
        super(state);
    }
}