document.addEventListener('DOMContentLoaded', function() {
  // 회원가입 기능
  const registerBtn = document.querySelector('#login-up .login__button');
  
  registerBtn.addEventListener('click', function(event) {
    event.preventDefault();
    console.log('회원가입 버튼 클릭됨'); // 이벤트 리스너가 작동하는지 확인하기 위한 로그
    const email = document.querySelector('#login-up input[type="email"]').value;
    const username = document.querySelector('#login-up input[type="text"]').value;
    const password = document.querySelector('#login-up input[type="password"]').value;
  
    if (email && username && password) {
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      alert('회원가입이 완료되었습니다!');
      // 자동으로 로그인 후 main.html로 이동
      window.location.href = '/';
    } else {
      alert('모든 필드를 채워주세요.');
    }
  });
  
  // 로그인 기능
  const loginBtn = document.querySelector('#login-in .login__button');
  
  loginBtn.addEventListener('click', function(event) {
    event.preventDefault();
    console.log('로그인 버튼 클릭됨'); // 이벤트 리스너가 작동하는지 확인하기 위한 로그
    const enteredEmail = document.querySelector('#login-in input[type="text"]').value;
    const enteredPassword = document.querySelector('#login-in input[type="password"]').value;
  
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
  
    if (enteredEmail === storedEmail && enteredPassword === storedPassword) {
      alert('로그인 성공!');
      // 로그인 성공 후 메인 페이지로 리디렉션
      window.location.href = '/';
    } else {
      alert('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  });
});
