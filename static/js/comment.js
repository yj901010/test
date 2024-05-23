$(document).ready(function() {
    // 전역변수 등록
    var commentInput = $('#commentInput');
    var commentList = $('#commentList');
    var commentSaveBtn = $('#commentSaveBtn');

    var commentArr = [];

    function getCommentSeq() {
        var storedComments = JSON.parse(localStorage.getItem('comments'));

        if (storedComments == null) {
            return 0;
        } else if (storedComments !== null) {
            var currentCommentArr = [];
            storedComments.forEach(function(e) {
                if (e.column_seq === (window.location.href.split('?seq=')[1]) * 1) {
                    currentCommentArr.push(e);
                }
            });
            if (currentCommentArr.length == 0) {
                return 0;
            } else if (currentCommentArr.length > 0) {
                return currentCommentArr.pop().seq;
            }
        }
    }

    // 새로운 코멘트 등록
    function addNewComment() {
        var comment = {
            column_seq: (window.location.href.split('?seq=')[1]) * 1,
            seq: getCommentSeq() + 1,
            content: commentInput.val(),
            date: getNow()
        };

        if (comment.content.length == 0) {
            alert('내용을 입력해주세요!');
        } else if (comment.content.length > 0) {
            commentArr.push(comment);
        }

        // 스토리지에 저장하고 렌더링
        saveToStorage('comments', commentArr);
        renderComment();

        // 입력창 초기화하고 포커스
        commentInput.val('');
        commentInput.focus();
    }

    commentSaveBtn.click(addNewComment);

    function getCommentTemplate(seq, content, date) {
        return '<li class="comment-item"><div class="comment-num">댓글' + seq + '</div><div class="comment-content">' + content + '</div><div class="comment-date">' + date + '</div><button class="btn btn-remove-comment" data-index="' + seq + '">삭제</button></li>';
    }

    // 코멘트 렌더링
    function renderComment() {
        commentList.html('');
        var storedComments = JSON.parse(localStorage.getItem('comments'));
        if (storedComments !== null) {
            commentArr = storedComments;
            storedComments.forEach(function(e) {
                if (e.column_seq == (window.location.href.split('?seq=')[1]) * 1) {
                    commentList.append(getCommentTemplate(e.seq, e.content, e.date));
                }
            });
        }
    }

    // 코멘트 삭제
    $(document).on('click', '.btn-remove-comment', function() {
        var index = $(this).attr('data-index');
        for (var i = 0; i < commentArr.length; i++) {
            if (commentArr[i].seq == index) {
                commentArr.splice(commentArr.indexOf(commentArr[i]), 1);
            }
        }
        saveToStorage('comments', commentArr);
        renderComment();
    });

    // 초기 렌더링
    renderComment();
});
