import axios from 'axios';
import api from "~/api/api";
const {
  list_messages,
    add_message
}=api
export function listMessages() {
  return axios.get(list_messages);
}
export  function  addMessage(data:{user:string,message:string}) {
  console.log(data)
  return axios.post("/v1/message/add",data);
}