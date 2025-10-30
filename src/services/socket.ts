import { io } from "socket.io-client";
import { api } from "./api";

const URL = api ;

export const socket = io(URL, {
  autoConnect: false, 
});