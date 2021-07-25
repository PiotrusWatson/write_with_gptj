export function generateWords(sentence, length, temperature, topP){
    return new Promise((resolve, reject) => {
    $.ajax(
        {
            url:"/finish",
            type: "POST",
            data:{
                context: sentence,
                token_max_length: length,
                temperature: temperature,
                top_p: topP
            },
        success: function(response){
            resolve(response);
        },
        error: function(error){
            reject(error);
        }
        })   
    });

}