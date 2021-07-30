from bottle import get, static_file, route, run, request, default_app
import config
import requests

# Static Routes
@get("/css/<filepath:re:.*\.css>")
def css(filepath):
    return static_file(filepath, root="css")

@get("/dist/<filepath:re:.*\.js>")
def js(filepath):
    return static_file(filepath, root="dist")

@route('/',method='GET')
def main_page():
    return static_file("index.html", root=".")

@route('/finish', method="POST")
def finish_text():
    print("hello everyone")
    payload = {
        "context": request.forms.context,
        "token_max_length": request.forms.token_max_length,
        "temperature": request.forms.temperature,
        "top_p": request.forms.top_p
    }
    responses = []
    for i in range(int(request.forms.response_number)):
        response = requests.post("http://api.vicgalle.net:5000/generate", params=payload).json()
        responses.append({"id": i, "value": response["text"]})
    print(response)
    return {"result": responses}

if (config.isLocal):
    run(host=config.host, port=config.port, reloader=True)
else:
    application = default_app()