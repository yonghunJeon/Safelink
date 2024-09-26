// 그리드 아이템 클릭 이벤트
function setupGridItemToggle() {
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', function() {
            const openItem = document.querySelector('.grid-item.active');
            if (openItem && openItem !== this) {
                openItem.classList.remove('active');
                openItem.querySelector('.sub-menu').style.maxHeight = null;
            }

            this.classList.toggle('active');
            const subMenu = this.querySelector('.sub-menu');
            if (this.classList.contains('active')) {
                subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            } else {
                subMenu.style.maxHeight = null;
            }
        });
    });
}

// 모든 grid-item에 대해 토글 기능 적용
setupGridItemToggle();

// 설정 메뉴 버튼 전체 제어
document.getElementById('all-alerts').addEventListener('change', function() {
    const allChecked = this.checked;
    const individualAlerts = document.querySelectorAll('.individual-alert');
    individualAlerts.forEach(function(alert) {
        alert.checked = allChecked;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const allAlert = document.getElementById('all-alerts');
    const individualAlerts = document.querySelectorAll('.individual-alert');

    // 페이지 로드 시, 저장된 상태를 불러옴
    const allAlertStatus = localStorage.getItem('all-alerts');
    if (allAlertStatus !== null) {
        allAlert.checked = JSON.parse(allAlertStatus);
    }

    individualAlerts.forEach(function(alert, index) {
        const alertStatus = localStorage.getItem(`individual-alert-${index}`);
        if (alertStatus !== null) {
            alert.checked = JSON.parse(alertStatus);
        }
    });
});

document.querySelector('.save-btn').addEventListener('click', function() {
    // SweetAlert2를 이용한 확인 대화상자 표시
    Swal.fire({
        title: '저장하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오',
        confirmButtonColor: '#00b7ff', // 확인 버튼 색깔
        cancelButtonColor: '#aaa' // 취소 버튼 색깔
    }).then((result) => {
        if (result.isConfirmed) {
            const allAlert = document.getElementById('all-alerts');
            const individualAlerts = document.querySelectorAll('.individual-alert');

            // 저장 버튼을 눌렀을 때 상태를 localStorage에 저장
            localStorage.setItem('all-alerts', allAlert.checked);

            individualAlerts.forEach(function(alert, index) {
                localStorage.setItem(`individual-alert-${index}`, alert.checked);
            });

            Swal.fire({
                title: '저장되었습니다!',
                icon: 'success',
                confirmButtonColor: '#00b7ff' // 저장 후 확인 버튼 색깔
            });
        } else {
            Swal.fire({
                title: '저장 취소됨',
                icon: 'info',
                confirmButtonColor: '#00b7ff' // 취소 후 확인 버튼 색깔
            });
        }
    });
});

