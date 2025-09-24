let isShrink = false;
let ticking = false;

function handleHeaderShrink() {
    const header = document.querySelector('header');
    const shrinkPoint = 120;
    if (window.scrollY > shrinkPoint) {
        if (!isShrink) {
            header.classList.add('shrink');
            isShrink = true;
        }
    } else {
        if (isShrink) {
            header.classList.remove('shrink');
            isShrink = false;
        }
    }
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(handleHeaderShrink);
        ticking = true;
    }
});

// 화면 전환 기능 (버튼 섹션도 모두 숨김)
function showOnly(sectionId) {
    // 모든 섹션 숨김
    document.getElementById('about').style.display = 'none';
    document.getElementById('courses').style.display = 'none';
    document.getElementById('contact').style.display = 'none';

    // 모든 버튼 섹션 숨김
    const buttonSections = document.querySelectorAll('.button-section');
    buttonSections.forEach(sec => sec.style.display = 'none');

    // 해당 섹션만 보이게
    const target = document.getElementById(sectionId);
    if (target) target.style.display = 'block';

    // 소개화면일 때만 버튼 섹션 보이게
    if (sectionId === 'about') {
        buttonSections.forEach(sec => sec.style.display = 'flex');
    }
}

// 메뉴 버튼 클릭 시
document.getElementById('navCoursesBtn').addEventListener('click', function() {
    showOnly('courses');
});
document.getElementById('navContactBtn').addEventListener('click', function() {
    showOnly('contact');
});

// 메인 버튼 클릭 시
document.getElementById('goCoursesBtn').addEventListener('click', function() {
    showOnly('courses');
});
document.getElementById('goContactBtn').addEventListener('click', function() {
    showOnly('contact');
});

// 게임강의사이트(제목) 클릭 시 소개화면으로
document.getElementById('homeBtn').addEventListener('click', function() {
    showOnly('about');
});

// 처음엔 소개만 보이게
window.onload = function() {
    showOnly('about');
};
// ...existing code...
document.getElementById('homeBtn').addEventListener('click', function() {
    showOnly('about');
});