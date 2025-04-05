
declare interface LLMResponse{
    'request_id':string,
    'usage':object,
    'target_language':any,
    'transcription'?:TranscriptionText,
    'translation'?:TranslationText,
}
declare interface TranscriptionText{
    'sentence_id':number,
    'text':string
}
declare interface TranslationText{
    'sentence_id':number,
    'text':string
}