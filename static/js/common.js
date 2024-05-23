// 숫자가 10보다 작을때 앞에 0 붙이는 함수
var leadingZero = (num) => (num < 10) ? '0' + num : num;

// 지금 시간 구하는 함수 (yyyy-mm-dd hh:mm)
function getNow() {
    var now = new Date();
    var year = now.getFullYear();
    var month = leadingZero(now.getMonth() + 1);
    var date = leadingZero(now.getDate());
    var hour = leadingZero(now.getHours());
    var minute = leadingZero(now.getMinutes());

    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
}

// 스토리지에서 아이템 로드
function getFromStorage(key) {
    var storedItem = localStorage.getItem(key);
    if (storedItem == null) {
        return null;
    } else if (storedItem !== null) {
        return JSON.parse(localStorage.getItem(key));
    }
}

// 스토리지에 배열 저장
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// URL을 기반으로 기본 언어 설정
function getDefaultLanguage() {
    const url = window.location.href;
    let defaultLanguage = 'english'; // 기본값을 영어로 설정

    if (url.includes('/study_english')) {
        defaultLanguage = 'english';
    } else if (url.includes('/study_chinese')) {
        defaultLanguage = 'chinese';
    } else if (url.includes('/study_japanese')) {
        defaultLanguage = 'japanese';
    } else if (url.includes('/study_spanish')) {
        defaultLanguage = 'spanish';
    }

    return defaultLanguage;
}

// 게시판 로드 함수
async function loadBoard(language) {
    $('#boardTitle').text(`${language.charAt(0).toUpperCase() + language.slice(1)} 게시판`);

    // 비동기로 게시판 데이터 로드 (서버와 연동 필요)
    const posts = await fetchPosts(language);

    const contentList = $('#contentList');
    contentList.empty();

    const fragment = $(document.createDocumentFragment());
    posts.forEach(post => {
        fragment.append(`
            <div class="content-box">
                <div class="title"><a href="/view?id=${post.id}">${post.title}</a></div>
                <div class="author">${post.author}</div>
            </div>
        `);
    });
    contentList.append(fragment);
}

// 예제 데이터를 반환하는 함수
async function fetchPosts(language) {
    // 예제 데이터
    const posts = {
        english: [
            { id: 1, title: 'Hello, this is an English board.', author: 'User1', content: 'This is the content of the first English post.' },
            { id: 2, title: 'Welcome to the English board.', author: 'User2', content: 'This is the content of the second English post.' },
            { id: 3, title: 'How to learn English effectively.', author: 'User3', content: 'This is the content of the third English post.' },
            { id: 4, title: 'English board announcements.', author: 'Admin', content: 'This is the content of the fourth English post.' },
            { id: 5, title: 'Join our English study group.', author: 'User4', content: 'This is the content of the fifth English post.' }
        ],
        japanese: [
            { id: 1, title: 'こんにちは、日本語の掲示板です。', author: 'User1', content: 'これは最初の日本語の投稿の内容です。' },
            { id: 2, title: '日本語の掲示板へようこそ。', author: 'User2', content: 'これは2番目の日本語の投稿の内容です。' },
            { id: 3, title: '効果的に日本語を学ぶ方法。', author: 'User3', content: 'これは3番目の日本語の投稿の内容です。' },
            { id: 4, title: '日本語掲示板の通知。', author: 'Admin', content: 'これは4番目の日本語の投稿の内容です。' },
            { id: 5, title: '日本語の勉強会に参加しよう。', author: 'User4', content: 'これは5番目の日本語の投稿の内容です。' }
        ],
        chinese: [
            { id: 1, title: '你好，这是一个中文公告板。', author: 'User1', content: '这是第一篇中文帖子。' },
            { id: 2, title: '欢迎来到中文公告板。', author: 'User2', content: '这是第二篇中文帖子。' },
            { id: 3, title: '如何有效地学习中文。', author: 'User3', content: '这是第三篇中文帖子。' },
            { id: 4, title: '中文公告板公告。', author: 'Admin', content: '这是第四篇中文帖子。' },
            { id: 5, title: '加入我们的中文学习小组。', author: 'User4', content: '这是第五篇中文帖子。' }
        ],
        spanish: [
            { id: 1, title: 'Hola, este es un tablero de anuncios en español.', author: 'User1', content: 'Este es el contenido de la primera publicación en español.' },
            { id: 2, title: 'Bienvenido al tablero de anuncios en español.', author: 'User2', content: 'Este es el contenido de la segunda publicación en español.' },
            { id: 3, title: 'Cómo aprender español efectivamente.', author: 'User3', content: 'Este es el contenido de la tercera publicación en español.' },
            { id: 4, title: 'Anuncios del tablero de español.', author: 'Admin', content: 'Este es el contenido de la cuarta publicación en español.' },
            { id: 5, title: 'Únete a nuestro grupo de estudio de español.', author: 'User4', content: 'Este es el contenido de la quinta publicación en español.' }
        ]
    };
    return posts[language];
}

// 로그인 상태 확인
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
        $('.signin').replaceWith('<a href="/mypage" class="mypage">My Page</a>');
    } else {
        $('.btn a').click(function(e) {
            e.preventDefault();
            alert('로그인 후 글 작성이 가능합니다.');
            window.location.href = '/join';
        });
    }
}

// 글 데이터 로딩
async function loadPostData(postID, callback) {
    try {
        const response = await $.ajax({
            url: "/get-post",
            type: "GET",
            data: { id: postID },
            dataType: "json"
        });

        if (response.status) {
            callback(response.data);
        } else {
            alert("Failed to load post data.");
        }
    } catch (error) {
        alert("Error loading post data.");
    }
}

// 새 게시물 등록
function addNewColumn(titleVal, contentVal, language) {
    var columnArr = getFromStorage(language) || [];
    var column = {
        id: columnArr.length + 1,
        title: titleVal,
        content: contentVal,
        author: localStorage.getItem('username') || 'Anonymous',
        date: getNow()
    };
    columnArr.push(column);
    saveToStorage(language, columnArr);
    return columnArr;
}

// DOM 엘리먼트 템플릿 등록
function getColumnTemplate(url, id, title, date) {
    return `<li class="column-item"><a class="column-item-anchor" href="${url}"><div class="column-item-num"><span>${id}</span></div><div class="column-item-title"><span>${title}</span></div><div class="column-item-date"><span>${date}</span></div></a><button class="btn btn-remove" data-index="${id}">삭제</button></li>`;
}

// url 주소 치환
function replaceUrl(num) {
    var url = window.location.href;
    return (url.replace('board.html', '/view')) + '?id=' + num;
}

// 게시물 삭제
function deletePost(language, id) {
    var columnArr = getFromStorage(language) || [];
    columnArr = columnArr.filter(post => post.id != id);
    saveToStorage(language, columnArr);
    return columnArr;
}

// 초기화 함수
$(document).ready(function() {
    const defaultLanguage = getDefaultLanguage();
    loadBoard(defaultLanguage);
    checkLoginStatus();

    // 언어별 게시판 로드
    $('.dropdown-content a').click(function(e) {
        e.preventDefault();
        const language = $(this).data('lang');
        loadBoard(language);
    });

    // 새 게시물 등록 이벤트
    $('#saveColumn').click(function() {
        var titleVal = $('#inputTitle').val();
        var contentVal = $('#inputContent').val();
        if (titleVal == '') {
            alert('제목을 입력해주세요!');
        } else if (contentVal == '') {
            alert('내용을 입력해주세요!');
        } else {
            var language = getDefaultLanguage();
            var columns = addNewColumn(titleVal, contentVal, language);
            renderCol(columns, language);
        }
    });

    // 게시물 삭제 이벤트
    $(document).on('click', '.btn-remove', function() {
        var id = $(this).attr('data-index');
        var language = getDefaultLanguage();
        var columns = deletePost(language, id);
        renderCol(columns, language);
    });

    // 게시물 렌더링 함수
    function renderCol(columns, language) {
        var colList = $('#colList');
        colList.html('');
        columns.forEach(function(e) {
            colList.append(getColumnTemplate(replaceUrl(e.id), e.id, e.title, e.date));
        });
    }
});
