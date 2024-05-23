$(document).ready(function() {
    // 기본 언어 설정 (영어)
    loadBoard('chinese');

    // 언어별 게시판 로드
    $('.dropdown-content a').click(function(e) {
        e.preventDefault();
        const language = $(this).data('lang');
        loadBoard(language);
    });

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
                    <div class="title"><a href="/view">${post.title}</a></div>
                    <div class="author">${post.author}</div>
                </div>
            `);
        });
        contentList.append(fragment);
    }

    async function fetchPosts(language) {
        // 예제 데이터
        const posts = {
            english: [
                { id: 1, title: 'Hello, this is an English board.', author: 'User1' },
                { id: 2, title: 'Welcome to the English board.', author: 'User2' }
            ],
            japanese: [
                { id: 1, title: 'こんにちは、日本語の掲示板です。', author: 'User1' },
                { id: 2, title: '日本語の掲示板へようこそ。', author: 'User2' }
            ],
            chinese: [
                { id: 1, title: '你好，这是一个中文公告板。', author: 'User1' },
                { id: 2, title: '欢迎来到中文公告板。', author: 'User2' }
            ],
            spanish: [
                { id: 1, title: 'Hola, este es un tablero de anuncios en español.', author: 'User1' },
                { id: 2, title: 'Bienvenido al tablero de anuncios en español.', author: 'User2' }
            ]
        };
        return posts[language];
    }

    // 로그인 상태 확인
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

    // 글 작성 버튼 클릭 이벤트
    $("#newPostButton").click(function() {
        displayForm("new");
    });

    // 글 수정 버튼 클릭 이벤트
    $(document).on("click", ".editPostButton", function() {
        var postID = $(this).data("postid");
        loadPostData(postID);
    });

    // 글 삭제 버튼 클릭 이벤트
    $(document).on("click", ".deletePostButton", function() {
        var postID = $(this).data("postid");
        deletePost(postID);
    });

    // 글 등록 및 수정 폼 제출 처리
    $("#postForm").submit(function(e) {
        e.preventDefault();
        submitPostForm();
    });

    // 글 데이터 로딩
    async function loadPostData(postID) {
        try {
            const response = await $.ajax({
                url: "/get-post",
                type: "GET",
                data: { id: postID },
                dataType: "json"
            });

            if (response.status) {
                $("#title").val(response.data.title);
                $("#content").val(response.data.content);
                displayForm("edit", postID);
            } else {
                alert("Failed to load post data.");
            }
        } catch (error) {
            alert("Error loading post data.");
        }
    }

    // 폼 표시 (새 글 작성 또는 수정)
    function displayForm(type, postID = null) {
        $("#postID").val(postID);
        $("#formType").val(type);
        $("#newPostForm").show();
    }

    // 글 제출 처리 (생성 및 수정)
    async function submitPostForm() {
        const loggedInUser = localStorage.getItem('username'); // 사용자 이름 가져오기
        const postData = {
            id: $("#postID").val(),
            title: $("#title").val(),
            content: $("#content").val(),
            type: $("#formType").val(),
            author: loggedInUser // 작성자 이름 추가
        };

        try {
            const response = await $.ajax({
                url: postData.type === "new" ? "http://localhost:8000/create-post" : "http://localhost:8000/update-post",
                type: "POST",
                data: JSON.stringify(postData),
                contentType: "application/json"
            });

            if (response.status) {
                alert("Post has been " + (postData.type === "new" ? "created." : "updated."));
                location.reload();  // 페이지 새로고침
            } else {
                alert("Failed to " + (postData.type === "new" ? "create" : "update") + " post.");
            }
        } catch (error) {
            alert("Error processing post.");
        }
    }

    // 글 삭제 처리
    async function deletePost(postID) {
        if (!confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            const response = await $.ajax({
                url: "http://localhost:8000/delete-post",
                type: "POST",
                data: JSON.stringify({ id: postID }),
                contentType: "application/json"
            });

            if (response.status) {
                alert("Post has been deleted.");
                location.reload();  // 페이지 새로고침
            } else {
                alert("Failed to delete post.");
            }
        } catch (error) {
            alert("Error deleting post.");
        }
    }

    // 글 작성 폼 제출 이벤트 처리
    $("#writeForm").submit(function(e) {
        e.preventDefault();
    
        const loggedInUser = localStorage.getItem('username'); // 사용자 이름 가져오기
        const title = $("#title").val();
        const content = $("#content").val();
    
        if (!loggedInUser) {
            alert('로그인 후 글 작성이 가능합니다.');
            window.location.href = '/join';
            return;
        }
    
        const postData = {
            title: title,
            content: content,
            author: loggedInUser
        };
    
        $.ajax({
            url: "http://localhost:8000/create-post",  // 서버의 주소로 수정
            type: "POST",
            data: JSON.stringify(postData),
            contentType: "application/json",
            success: function(response) {
                if (response.status) {
                    alert("글이 성공적으로 작성되었습니다.");
                    window.location.href = document.referrer;  // 이전 페이지로 이동
                } else {
                    alert("글 작성에 실패했습니다.");
                }
            },
            error: function() {
                alert("글 작성 중 오류가 발생했습니다.");
            }
        });
    });
});
