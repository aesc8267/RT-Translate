import api from "./api";
import axios from "axios";
const {list_history,apiKey_set,update_language}=api;
export function listHistory() {
  return axios.get(list_history);
}
export function updateApiKey(api_key:string){
  return axios.post(apiKey_set,{'api_key':api_key});
}
export async function updateLanguage(src:string,target:string){
  return axios.post(update_language,{'source_language':src,'target_language':target});
}