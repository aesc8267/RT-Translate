let api_host='/v1'
export default {
    //test
    list_history:`${api_host}/history/list`,
    list_message:`${api_host}/message/list`,
    add_message:`${api_host}/message/add`,
    delete_message:`${api_host}/message/delete`,
    update_message:`${api_host}/message/update`,
    get_message:`${api_host}/message/get`,
    get_message_by_id:`${api_host}/message/get_by_id`,
    get_message_by_user_id:`${api_host}/message/get_by_user_id`,
    apiKey_set:`${api_host}/api_key/set`,
    update_language:`${api_host}/language/update`,
    
}