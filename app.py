from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)

# CORS 설정
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/join')
def join_page():
    return render_template('login_sign.html')

@app.route('/')
def main_page():
    return render_template('main.html')

@app.route('/mypage')
def mypage():
    return render_template('mypage.html')

@app.route('/signin')
def signin_page():
    return render_template('sign_in.html')

@app.route('/study')
def study_page():
    return render_template('study.html')

@app.route('/study_chinese')
def study_chnese():
    return render_template('study_chinese.html')

@app.route('/study_english')
def study_english():
    return render_template('study_english.html')

@app.route('/view')
def view_page():
    return render_template('view.html')

@app.route('/write')
def write_page():
    return render_template('write.html')

@app.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')

    responses = {
        'message': 'Login이 성공적으로 처리되었습니다.',
        'email' : email,
        'password' : password
    }

    return jsonify(responses)


@app.route('/create-post', methods=['POST'])
def create_post():
    data = request.get_json()
    # 여기서 데이터 처리를 수행합니다.
    response = {
        'data': data,
        'message': 'POST 요청이 성공적으로 처리되었습니다.'
    }
    print(jsonify(response), ' ')
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=8000)
