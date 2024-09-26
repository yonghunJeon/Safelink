// 모바일 장치 감지 함수
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 화면 방향 감지 함수
const detectOrientation = () => {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

// 화면 방향에 따른 클래스 적용 함수
const applyOrientationClass = (container) => {
    const orientation = detectOrientation();

    if (orientation === 'landscape') {
        container.classList.remove('portrait');
        container.classList.add('landscape');
    } else {
        container.classList.remove('landscape');
        container.classList.add('portrait');
    }
};

// 클래스 적용 함수
const applyResponsiveClass = () => {
    // 각 HTML 파일에서 사용할 컨테이너 클래스명 목록
    const containerClasses = ['.login-container', '.container-background', '.signup-container'];

    containerClasses.forEach(containerClass => {
        const container = document.querySelector(containerClass);

        if (container) {
            // 컨테이너가 존재할 경우 모바일/데스크탑 클래스를 적용
            if (isMobile()) {
                container.classList.add('mobile');
                applyOrientationClass(container);  // 초기 화면 방향에 따른 클래스 적용

                // 화면 회전 시 클래스 적용
                window.addEventListener('resize', () => applyOrientationClass(container));
            } else {
                container.classList.add('desktop');
            }
        }
    });
};

// 페이지 로드 후 클래스 적용
window.addEventListener('load', applyResponsiveClass);
