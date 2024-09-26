/****상단 고정 메뉴 바****/
//<li class="active"><a href="#">사용자 정보</a></li>
class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <button class="menu-button"><i class="fas fa-bars"></i></button>
                <hButton><a href="alarm_page.html"><i class="fas fa-bell"></i></a></hButton>
                <hButton1><a href="button_page.html"><i class="fas fa-desktop"></i></a></hButton1>
                <hButton2><a href="setting_page.html"><i class="fas fa-cog"></i></a></hButton2>
                <button class="menu-user"><i class="fas fa-user"></i></button>
            </header>
            <nav id="menu" class="menu">
                <ul>
                    <li><a href="#" id="connection-info-btn">연결 상태</a></li>
                    <li><a href="#" id="help-info-btn">문의 사항</a></li>
                    <li><a href="#" id="version-info-btn">버전 정보</a></li>
                    <li><a href="#" onclick="exitApp()">SAFE LINK 종료</a></li>
                </ul>
            </nav>
            <nav id="menu1" class="menu1">
                <div class="profile-section">
                    <i class="fas fa-user"></i>
                    <h2>화서역 푸르지오 브리시엘</h2>
                    <p><i2 class="fas fa-map-marker-alt"></i2> 경기도 수원</p>
                </div>
                <ul>
                    <li><a href="#" id="user-info-btn">사용자 정보</a></li>
                    <li>
                        <a href="#">
                            푸시 알림
                            <label class="switch">
                                <input type="checkbox" id="alarmSwitch">
                                <span class="slider round"></span>
                            </label>
                        </a>
                    </li>
                </ul>
                <button class="logout-btn" onclick="location.href='index.html'">로그아웃<i class="fas fa-sign-out-alt"></i></button>
            </nav>
        `;
    }
}

customElements.define('header-component', HeaderComponent);

/*document.addEventListener('DOMContentLoaded', function() {
    // HTML 파일을 불러올 대상 요소
    const headerContainer = document.getElementById('header-component');

    // header.html을 불러와서 삽입
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            return response.text();
        })
        .then(data => {
            headerContainer.innerHTML = data;
        })
        .catch(error => {
            console.error('HTML 파일을 불러오는 데 실패했습니다:', error);
            headerContainer.innerHTML = "<p>메뉴를 불러올 수 없습니다.</p>";
        });
});*/

/****menu -> 왼쪽 상단 메뉴, menu1 -> 오른쪽 상단 유저 아이콘 메뉴****/
document.addEventListener('DOMContentLoaded', function () {
    function setupMenuToggle(menuId, buttonClass, otherMenuId) {
        const menu = document.getElementById(menuId);
        const menuButton = document.querySelector(buttonClass);
        const otherMenu = document.getElementById(otherMenuId);

        // 메뉴 버튼 클릭 시 메뉴 열기/닫기
        menuButton.addEventListener('click', function (event) {
            event.stopPropagation(); // 클릭 이벤트가 부모로 전파되는 것을 막음
            
            // 다른 메뉴가 열려있다면 닫기
            if (otherMenu.classList.contains('active')) {
                otherMenu.classList.remove('active');
            }

            // 현재 메뉴 열기/닫기
            menu.classList.toggle('active');
        });

        // 문서의 다른 부분을 클릭하면 메뉴 닫기
        document.addEventListener('click', function (event) {
            if (!menu.contains(event.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
    }

    // 각각의 메뉴와 버튼을 설정
    setupMenuToggle('menu', '.menu-button', 'menu1');
    setupMenuToggle('menu1', '.menu-user', 'menu');
});

// 터치 이벤트 처리를 위한 모바일 지원 코드 추가
/*document.addEventListener('touchstart', function (event) {
    const menu = document.querySelector('.menu.active');
    const menu1 = document.querySelector('.menu1.active');

    // 메뉴 외부를 터치했을 때 메뉴 닫기
    if (menu || menu1 || !menu.contains(event.target)) {
        menu.classList.remove('active');
        menu1.classList.remove('active');
    }
});*/

/****연결 상태****/
document.addEventListener('DOMContentLoaded', function() {
    function showConnectionInfo() {
        Swal.fire({
            title: '네트워크 상태가 양호합니다!',
            icon: 'success',
            confirmButtonText: '확인',
            confirmButtonColor: '#00b7ff'
        });
    }

    const connectionInfoBtn = document.getElementById('connection-info-btn');
    if (connectionInfoBtn) {
        connectionInfoBtn.addEventListener('click', showConnectionInfo);
    }
});

/****문의 사항****/
document.addEventListener('DOMContentLoaded', function() {
    function showHelpInfo() {
        Swal.fire({
            title: '문의 사항',
            html: '<strong>도움이 필요하시다면?</strong><br><br>전화 : 031) 425 - 0830<br>팩스 : 031) 299 - 2261',
            icon: 'info',
            confirmButtonText: '확인',
            confirmButtonColor: '#00b7ff'
        });
    }

    const helpInfoBtn = document.getElementById('help-info-btn');
    if (helpInfoBtn) {
        helpInfoBtn.addEventListener('click', showHelpInfo);
    }
});

/****버전 정보****/
document.addEventListener('DOMContentLoaded', function() {
    function showVersionInfo() {
        Swal.fire({
            title: 'SAFE LINK',
            html: `
                <div style="text-align: left; line-height: 1.6;">
                    <p><strong>버전 정보 :</strong> SAFE LINK 2.0(web)</p>
                    <p><strong>빌드 날짜 :</strong> 2024-08-14 16:30</p>
                </div>
            `,
            icon: 'info',
            confirmButtonText: '확인',
            confirmButtonColor: '#00b7ff'
        });
    }

    const versionInfoBtn = document.getElementById('version-info-btn');
    if (versionInfoBtn) {
        versionInfoBtn.addEventListener('click', showVersionInfo);
    }
});

/****SAFE LINK 종료****/
function exitApp() {
    Swal.fire({
        title: '앱을 종료하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오',
        confirmButtonColor: '#00b7ff', // 확인 버튼 색깔
        cancelButtonColor: '#aaa' // 취소 버튼 색깔
    }).then((result) => {
        if (result.isConfirmed) {
            Android.closeApp(); // Android 네이티브 메서드 호출
        }
    });
}

/****사용자 정보****/
document.addEventListener('DOMContentLoaded', function() {
    function showUserInfo() {
        Swal.fire({
            title: '사용자 정보',
            html: `
                <div style="text-align: left; line-height: 1.6;">
                    <p><strong>사용자 등급 :</strong> 관리자</p>
                    <p><strong>관리 현장명 :</strong> 화서역 푸르지오 브리시엘</p>
                    <p><strong>위치 :</strong> 경기도 수원시 장안구 수성로157번길 60 (정자동)</p>
                    <p><strong>준공 날짜 :</strong> 2023년 9월 26일</p>
                    <p><strong>건설사 :</strong> 대우건설</p>
                </div>
            `,
            icon: 'info',
            confirmButtonText: '확인',
            confirmButtonColor: '#00b7ff'
        });
    }

    const userInfoBtn = document.getElementById('user-info-btn');
    if (userInfoBtn) {
        userInfoBtn.addEventListener('click', showUserInfo);
    }
});

/****푸시 알림 스위치****/
document.addEventListener('DOMContentLoaded', function() {
    const alarmSwitch = document.getElementById('alarmSwitch');

    alarmSwitch.addEventListener('change', function(event) {
        // 스위치의 기본 동작을 막아 상태를 일시적으로 되돌립니다.
        event.preventDefault();

        const isChecked = this.checked;

        // 스위치 상태를 일시적으로 되돌립니다.
        this.checked = !isChecked;

        Swal.fire({
            title: isChecked ? '푸시 알림 활성화' : '푸시 알림 비활성화',
            text: `푸시 알림을 ${isChecked ? '활성화' : '비활성화'}하겠습니까?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오',
            confirmButtonColor: '#00b7ff',
            cancelButtonColor: '#aaa'
        }).then((result) => {
            if (result.isConfirmed) {
                // 사용자가 '예'를 선택한 경우 스위치 상태를 변경
                this.checked = isChecked;
                Swal.fire({
                    title: isChecked ? '푸시 알림이 활성화되었습니다.' : '푸시 알림이 비활성화되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#00b7ff'
                });
            }
        });
    });
});
