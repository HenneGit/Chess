from flask import Flask, render_template, jsonify, request, json, session
from navBarEntry import NavBarEntry
from charsEnum import CharEnum
from flask_cors import CORS, cross_origin
from masterMind import Code, Colors
from random import randint

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
CORS(app)


@app.route('/someContent', methods=['GET'])
def some_content():
    return "Some Content"


@app.route('/aboutMe', methods=['GET'])
def about_me():
    return "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. "


@app.route('/home')
def home():
    return render_template("main.html")


@app.route('/start')
def start():
    return render_template("landingPage.html")


@app.route('/getMenu', methods=['GET'])
def get_menu_bar():
    about_me = NavBarEntry('About_Me', 'aboutMe')
    some_content = ['Some_Content', 'someContent']
    list = (about_me, some_content)

    class ComplexEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, NavBarEntry):
                return [obj._name, obj._route]

            return json.JSONEncoder.default(self, obj)

    return jsonify(json.dumps(list, cls=ComplexEncoder))


@app.route('/getLetters', methods=['GET'])
def get_letters():
    word = [CharEnum.H, CharEnum.E, CharEnum.L, CharEnum.L, CharEnum.O]
    return jsonify(word)


@app.route('/compareCodes', methods=['GET', 'POST'])
def compare_codes():
    if session['code'] is not None:
        server_code = Code(session['code'])
    else:
        return ""

    user_code = Code(request.json)
    return jsonify([server_code.correct_position(user_code), server_code.correct_color(user_code)])


@app.route('/getCode', methods=['GET'])
def set_code():
    all_colors = [Colors.RED, Colors.BLUE, Colors.PURPlE, Colors.GREEN, Colors.YELLOW]
    random_code = list()
    for i in range(5):
        is_duplicate = bool(1)
        while is_duplicate:
            color = all_colors[randint(0, 3)]
            if color not in random_code:
                random_code.append(color)
                is_duplicate = bool(0)
    session['code'] = random_code
    return jsonify(random_code)


if __name__ == '__main__':
    app.run(debug=True)
