import { io } from "socket.io-client";

const SOCKET_URL = "https://api.joinpomegranateapi.com";
export const socket = io(SOCKET_URL);
