document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');

    // 저장된 아이디와 비밀번호 가져오기
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    const isRememberMeChecked = localStorage.getItem('rememberMe') === 'true';

    if (isRememberMeChecked) {
        // "아이디 / 비밀번호 저장"이 체크된 경우에만 값을 입력 필드에 채우기
        usernameInput.value = savedUsername || '';
        passwordInput.value = savedPassword || '';
        rememberMeCheckbox.checked = true;
    }

    // 로그인 폼 제출 시 처리
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();  // 기본 폼 제출 동작 방지

        if (rememberMeCheckbox.checked) {
            // 아이디와 비밀번호를 localStorage에 저장
            localStorage.setItem('username', usernameInput.value);
            localStorage.setItem('password', passwordInput.value);
            localStorage.setItem('rememberMe', 'true');
        } else {
            // 체크박스가 선택되지 않은 경우 저장된 값 삭제
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            localStorage.setItem('rememberMe', 'false');
        }

        // 서버로 로그인 데이터 전송
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ username: usernameInput.value, password: passwordInput.value })
        })
        .then(response => response.json())
        .then(data => {
            console.log('서버 응답:', data);
            if (data.status === 'success') {
                // 로그인 성공 시 SweetAlert2 알림 표시
                Swal.fire({
                    icon: 'success',
                    title: '로그인 성공!',
                    text: data.message,
                    confirmButtonText: '확인'
                }).then(() => {
                    window.location.href = "alarm_page.html"; // 로그인 성공 시 페이지 이동
                });
            } else {
                // 로그인 실패 시 SweetAlert2 알림 표시
                Swal.fire({
                    icon: 'error',
                    title: '로그인 실패',
                    text: data.message,
                    confirmButtonText: '확인'
                });
            }
        })
        .catch(error => {
            console.error('로그인 오류:', error);
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: '로그인 중 문제가 발생했습니다.',
                confirmButtonText: '확인'
            });
        });
    });
});
