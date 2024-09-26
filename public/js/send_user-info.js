document.getElementById('sign-up-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 폼 제출 방지

    //const site = document.getElementById('site').value;
    const accesskey = document.getElementById('accesskey').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const phone = document.getElementById('phone').value;

    // 아이디 길이 확인
    if (username.length < 6 || username.length > 20) {
        Swal.fire({
            icon: 'error',
            title: '아이디 길이 오류',
            text: '아이디는 6자 이상 20자 이하여야 합니다.',
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
        return;
    }

    // 비밀번호 길이 확인
    if (password.length < 8 || password.length > 20) {
        Swal.fire({
            icon: 'error',
            title: '비밀번호 길이 오류',
            text: '비밀번호는 8자 이상 20자 이하여야 합니다.',
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
        return;
    }

    // 비밀번호 확인
    if (password !== passwordConfirm) {
        Swal.fire({
            icon: 'error',
            title: '비밀번호 불일치',
            text: '비밀번호가 일치하지 않습니다.',
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ accesskey, username, password, phone })
    })
    .then(response => response.text())
    .then(data => {
        Swal.fire({
            icon: data === '회원가입 성공!' ? 'success' : 'error',
            title: data === '회원가입 성공!' ? '회원가입 성공' : '회원가입 실패',
            text: data,
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        }).then(() => {
            if (data === '회원가입 성공!') {
                window.location.href = 'index.html'; // 로그인 페이지로 리디렉션
            }
        });
    })
    .catch(error => {
        console.error('회원가입 오류:', error);
        Swal.fire({
            icon: 'error',
            title: '오류',
            text: '회원가입 중 문제가 발생했습니다.',
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
    });
});

// 인증 키 검증 함수
function verifyAccessKey(accesskey) {
    if (!accesskey) {
        Swal.fire({
            icon: 'warning',
            title: '입력 필요',
            text: '인증 키를 입력하세요!',
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
        return; // 입력 값이 없으면 함수 종료
    }

    return fetch('/verify-access-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ accesskey })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '인증 완료',
                text: data.message,
                confirmButtonText: '확인',
                heightAuto: false  // 스크롤 문제 방지
            });
            // 버튼 텍스트 변경 및 비활성화
            const verifyButton = document.getElementById('verify-button');
            verifyButton.textContent = '인증 완료';
            verifyButton.disabled = true;
            verifyButton.style.display = 'block';
            verifyButton.style.textAlign = 'center';
            verifyButton.style.width = '100%';
            verifyButton.style.padding = '10px 0';
            verifyButton.style.borderRadius = '30px';
            verifyButton.style.color = '#00b7ff';
            verifyButton.style.fontSize = '16px';
            verifyButton.style.background = '#f0f0f0';
            verifyButton.style.textDecoration = 'none';
            verifyButton.style.transition = 'background 0.3s ease';
            verifyButton.style.cursor = 'not-allowed';

            // 텍스트 input 상자 비활성화
            const accessKeyInput = document.getElementById('accesskey');
            accessKeyInput.type = 'password';
            accessKeyInput.disabled = true;
        } else {
            Swal.fire({
                icon: 'error',
                title: '인증 실패',
                text: data.message,
                confirmButtonText: '확인',
                heightAuto: false  // 스크롤 문제 방지
            });
        }
    })
    .catch(error => {
        console.error('인증 오류:', error);
        Swal.fire({
            icon: 'error',
            title: '오류',
            text: '인증 중 문제가 발생했습니다.',
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
    });
}

// '인증 하기' 버튼 클릭 이벤트에 함수 연결
document.querySelector('#verify-button').addEventListener('click', function() {
    const accesskey = document.getElementById('accesskey').value;
    verifyAccessKey(accesskey); // 함수 호출
});

// 아이디 중복 체크
function checkUsername() {
    const username = document.getElementById('username').value;

    if (!username) {
        Swal.fire({
            icon: 'error',
            title: '아이디 입력',
            text: '아이디를 입력해주세요.',
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
        return;
    }

    fetch('/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username })
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            icon: data.exists ? 'error' : 'success',
            title: data.exists ? '아이디 중복' : '아이디 사용 가능',
            text: data.message,
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
    })
    .catch(error => {
        console.error('아이디 중복 확인 오류:', error);
        Swal.fire({
            icon: 'error',
            title: '오류',
            text: '아이디 중복 확인 중 문제가 발생했습니다.',
            confirmButtonText: '확인',
            heightAuto: false  // 스크롤 문제 방지
        });
    });
}

document.getElementById('phone').addEventListener('input', function (event) {
    this.value = this.value.replace(/[^0-9]/g, '');  // 숫자 이외의 문자를 모두 제거
});
