export function generateWords(sentence, length, temperature, topP){
    return new Promise((resolve, reject) => {
    $.ajax(
        {
            url:"http://api.vicgalle.net:5000/generate",
            type: "POST",
            headers: {
                Accept: "application/json"
            },
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