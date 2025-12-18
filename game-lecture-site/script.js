// ===============================
// 헤더 스크롤 축소
// ===============================
let isShrink = false, ticking = false;
function handleHeaderShrink() {
  const header = document.querySelector('header');
  const shrinkPoint = 120;
  const expandPoint = 80; // Hysteresis point

  if (!header) return;

  const scrollY = window.scrollY;

  if (!isShrink && scrollY > shrinkPoint) {
    header.classList.add('shrink');
    isShrink = true;
  } else if (isShrink && scrollY < expandPoint) {
    header.classList.remove('shrink');
    isShrink = false;
  }
  
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(handleHeaderShrink);
    ticking = true;
  }
});

// ===============================
// 섹션 전환
// ===============================
function showOnly(sectionId) {
  ['about','courses','instructors','contact'].forEach(id=>{
    const el = document.getElementById(id);
    if (el) el.style.display = (id===sectionId)?'block':'none';
  });
  document.body.classList.toggle('is-inner', sectionId!=='about');
  const firstHeading = document.querySelector(`#${sectionId} h2, #${sectionId} h1`);
  if (firstHeading) {
    firstHeading.setAttribute('tabindex','-1');
    firstHeading.focus();
  }
}

// ===============================
// 버튼 리플
// ===============================
function attachRipples(root=document){
  root.querySelectorAll('[data-ripple]').forEach(btn=>{
    btn.addEventListener('pointerdown', (e)=>{
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--rx', `${((e.clientX-rect.left)/rect.width)*100}%`);
      btn.style.setProperty('--ry', `${((e.clientY-rect.top)/rect.height)*100}%`);
      btn.classList.add('is-rippling');
      setTimeout(()=>btn.classList.remove('is-rippling'), 350);
    });
  });
}

// ===============================
// e스포츠 코스 데이터
// ===============================
const COURSES = [
  { id:'val-aim-master', title:'발로란트 에임 마스터: 감도·크로스헤어·트래킹/플릭', tag:['FPS','Valorant','Aim'], level:'전 레벨', duration:4, rating:4.9, students:2180, updated:'2025-08-20', desc:'감도/크로스헤어 고정, 트래킹/플릭 드릴, 스프레이 컨트롤로 헤드샷률을 끌어올립니다.', syllabus:['감도·크로스헤어 셋업','트래킹/플릭 루틴','스프레이 컨트롤','각도/피킹','개인 루틴 설계'], media:{kind:'thumb', label:'AIM'} },
  { id:'val-utility-lineups', title:'발로란트 유틸/라인업: 맵별 실행 루틴', tag:['FPS','Valorant','Team'], level:'중급', duration:5, rating:4.7, students:1260, updated:'2025-08-12', desc:'에이전트별 유틸 라인업과 기본/변형 세트플레이로 라운드 승률을 안정화합니다.', syllabus:['맵 이해(Ascent/Bind 등)','기본 세트(기본기)','변형 세트(페이크/리테이크)','타이밍 콜','리뷰 체크리스트'], media:{kind:'thumb', label:'UTIL'} },
  { id:'val-igl-midround', title:'발로란트 IGL & 미드라운드 콜', tag:['FPS','Valorant','Team'], level:'중급', duration:4, rating:4.6, students:820, updated:'2025-07-30', desc:'초반 플랜·인포 압축·리택·클러치 의사결정으로 미드라운드 승계를 완성합니다.', syllabus:['라운드 플랜 수립','인포 수집/압축','미드라운드 스위칭','리테이크/클러치','스크림 적용'], media:{kind:'thumb', label:'IGL'} },
  { id:'lol-laning-roles', title:'LoL 라인전 핵심: 포지션별 기본기(탑/미드/바텀)', tag:['MOBA','LoL','Micro'], level:'전 레벨', duration:4, rating:4.8, students:1740, updated:'2025-08-08', desc:'웨이브 관리·교환각·시야/로밍 타이밍으로 라인전 지표를 끌어올립니다.', syllabus:['웨이브/미니언 관리','교환 각 계산','시야와 로밍','정글러 연계','VOD 피드백'], media:{kind:'thumb', label:'LINE'} },
  { id:'lol-jg-path-obj', title:'LoL 정글 동선 & 오브젝트 컨트롤', tag:['MOBA','LoL','Macro'], level:'중급', duration:5, rating:4.7, students:1120, updated:'2025-08-15', desc:'상대 정글 추적, 라인 프리오 기반 오브젝트 타이밍으로 스노우볼을 굴립니다.', syllabus:['초반 동선 템플릿','카운터 정글/추적','용/전령 타이밍','라인 프리오 연계','리플레이 리뷰'], media:{kind:'thumb', label:'JGL'} },
  { id:'lol-draft-macro', title:'LoL 드래프트 & 매크로 운영', tag:['MOBA','LoL','Macro','Team'], level:'중급', duration:5, rating:4.6, students:980, updated:'2025-07-22', desc:'조합 상성·파워스파이크·사이드 운영으로 중후반 매크로를 체계화합니다.', syllabus:['조합 상성 이해','파워스파이크 맵핑','사이드/당김 운영','오브젝트 교환','사례 분석'], media:{kind:'thumb', label:'DRAFT'} },
  { id:'ow2-teamfight-ults', title:'오버워치2 팀파이트: 궁 관리 & 타겟 포커스', tag:['OW2','Team'], level:'전 레벨', duration:3, rating:4.5, students:540, updated:'2025-07-05', desc:'궁 트래킹과 포커스 콜, 타이밍 설계로 팀파이트 승률을 개선합니다.', syllabus:['궁 트래킹 시트','한타 설계','타겟 포커스/스왑','쿨타임 관리','리뷰 스크림'], media:{kind:'thumb', label:'ULT'} },
  { id:'team-comm-shotcall', title:'팀 커뮤니케이션 & 샷콜 부트캠프', tag:['Team','Communication'], level:'전 레벨', duration:3, rating:4.7, students:990, updated:'2025-08-05', desc:'정보 압축, 콜 템포, 역할별 콜 가이드를 통해 팀 합을 극대화합니다.', syllabus:['콜 프레임/룰','초/중/후반 템포','역할별 콜 가이드','리뷰 체크리스트','실전 드릴'], media:{kind:'thumb', label:'CALL'} },
  { id:'mental-tilt-recover', title:'프로 멘탈: 틸트 관리 & 패배 복구', tag:['Mental'], level:'전 레벨', duration:2, rating:4.8, students:1350, updated:'2025-08-18', desc:'프리퍼포먼스 루틴, 집중/호흡, 패배 후 리커버리 루프로 멘탈을 지킵니다.', syllabus:['루틴 설계','집중·호흡·시각화','틸트 트리거 파악','복구 루프','대회 데이 플랜'], media:{kind:'thumb', label:'MIND'} },
  { id:'physio-ergonomics', title:'게이머 피지컬: 자세/손목/시력/회복', tag:['Physio'], level:'전 레벨', duration:2, rating:4.6, students:640, updated:'2025-07-10', desc:'자세·손목·시력 위생과 회복/영양/수면으로 장시간 퍼포먼스를 유지합니다.', syllabus:['자세/손목/목','시력 위생 루틴','스트레칭/회복','영양/수면','대회 주간 컨디션'], media:{kind:'thumb', label:'FIT'} },
];

// ===============================
// 코스 카드 렌더링
// ===============================
function createCourseCard(course) {
  const el = document.createElement('article');
  el.className = 'course-card';
  el.innerHTML = `
    <div class="thumb ${course.media.kind}" style="background-image: linear-gradient(135deg, var(--brandA), var(--brandB));">
        <span>${course.media.label}</span>
    </div>
    <div class="course-body">
        <div class="course-top">
            <span class="badge">${course.level}</span>
            <div class="meta">
                <span aria-label="평점">★ ${course.rating.toFixed(1)}</span>
                <span aria-label="수강생">${course.students.toLocaleString()}명</span>
            </div>
        </div>
        <h3 class="course-title">${course.title}</h3>
        <div class="tags">${course.tag.map(t => `<span class="pill">${t}</span>`).join('')}</div>
        <p class="course-desc">${course.desc}</p>
        <div class="course-bottom">
            <span class="muted small-text">Last updated: ${course.updated}</span>
            <div class="bottom-actions">
                <button type="button" class="btn tiny secondary" data-action="preview" data-id="${course.id}" data-ripple>자세히</button>
                <button type="button" class="btn tiny primary" data-action="enroll" data-ripple>코칭 신청</button>
            </div>
        </div>
    </div>`;
  return el;
}

let page = 1;
const PAGE_SIZE = 8;
let activeFilter = 'all', query = '', sortKey = 'popular';

function applyFilterSortSearch(data){
  let arr=[...data];
  if (activeFilter!=='all') arr=arr.filter(c=>c.tag.includes(activeFilter));
  if (query.trim()){
    const q=query.toLowerCase();
    arr=arr.filter(c=>
      c.title.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.tag.join(' ').toLowerCase().includes(q)
    );
  }
  arr.sort((a,b)=>{
    switch (sortKey){
      case 'rating': return b.rating-a.rating;
      case 'new': return new Date(b.updated)-new Date(a.updated);
      case 'duration': return a.duration-b.duration;
      default: return b.students-a.students; // popular
    }
  });
  return arr;
}

function renderCourses(reset=false){
  const grid=document.getElementById('courseGrid');
  if (!grid) return;
  if (reset){ grid.innerHTML=''; page=1; }
  const filtered=applyFilterSortSearch(COURSES);
  const slice=filtered.slice(0, page*PAGE_SIZE);
  slice.forEach(course=>{
    if (!grid.querySelector(`[data-course="${course.id}"]`)){
      const card=createCourseCard(course);
      card.setAttribute('data-course',course.id);
      grid.appendChild(card);
    }
  });
  const moreBtn=document.getElementById('loadMoreBtn');
  if (moreBtn) moreBtn.style.display=(slice.length<filtered.length)?'inline-flex':'none';
  attachRipples(grid);
}

// ===============================
// 테마 토글 (단일 소스: html.dark)
// ===============================
function setTheme(mode){ // 'dark' | 'light'
  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  const btn = document.getElementById('toggleThemeBtn');
  if (btn){
    btn.textContent = isDark ? '☀️ 라이트' : '🌙 다크';
    btn.setAttribute('aria-pressed', String(isDark));
  }
}

function initTheme(){
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light'){
    setTheme(saved);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
}

// ===============================
// 초기 바인딩
// ===============================
window.addEventListener('DOMContentLoaded', ()=>{
  // 섹션 초기
  showOnly('about');

  // 테마 초기화 + 버튼 바인딩
  initTheme();
  const themeBtn = document.getElementById('toggleThemeBtn');
  if (themeBtn){
    themeBtn.addEventListener('click', ()=>{
      const nowDark = document.documentElement.classList.contains('dark');
      setTheme(nowDark ? 'light' : 'dark');
    });
  }

  // 네비게이션
  const bind = (id, fn)=>{ const el=document.getElementById(id); if (el) el.addEventListener('click', fn); };
  bind('navCoursesBtn', ()=>showOnly('courses'));
  bind('navInstructorsBtn', ()=>showOnly('instructors'));
  bind('navContactBtn', ()=>showOnly('contact'));
  bind('goCoursesBtn', ()=>showOnly('courses'));
  bind('goContactBtn', ()=>showOnly('contact'));
  bind('homeBtn', ()=>showOnly('about'));

  // 검색/필터/정렬/더보기
  const search=document.getElementById('searchInput');
  if (search) search.addEventListener('input', e=>{ query=e.target.value; renderCourses(true); });

  document.querySelectorAll('.filters .chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filters .chip').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter=btn.dataset.filter;
      renderCourses(true);
    });
  });

  const sortSel=document.getElementById('sortSelect');
  if (sortSel) sortSel.addEventListener('change', e=>{ sortKey=e.target.value; renderCourses(true); });

  const moreBtn=document.getElementById('loadMoreBtn');
  if (moreBtn) moreBtn.addEventListener('click', ()=>{ page+=1; renderCourses(false); });

  // 모달
  const modal=document.getElementById('courseModal');
  const modalClose=modal?.querySelector('.modal-close');
  const modalTitle=document.getElementById('modalTitle');
  const modalMeta=document.getElementById('modalMeta');
  const modalDesc=document.getElementById('modalDesc');
  const modalSyllabus=document.getElementById('modalSyllabus');
  const modalMedia=document.getElementById('modalMedia');
  const modalPreviewBtn=document.getElementById('modalPreviewBtn');

  function openModalById(id){
    const c=COURSES.find(x=>x.id===id); if (!c || !modal) return;
    if (modalTitle) modalTitle.textContent=c.title;
    if (modalMeta) modalMeta.textContent=`${c.level} · ★ ${c.rating.toFixed(1)} · ${c.duration}주 과정`;
    if (modalDesc) modalDesc.textContent=c.desc;
    if (modalSyllabus) modalSyllabus.innerHTML=c.syllabus.map(s=>`<li>${s}</li>`).join('');
    if (modalMedia) modalMedia.innerHTML=`<div class="thumb big">${c.media.label}</div>`;
    modal.showModal();
    if (modalPreviewBtn) modalPreviewBtn.onclick=()=>alert('샘플 VOD는 추후 연결됩니다 🙂');
  }
  if (modalClose) modalClose.addEventListener('click', ()=>modal.close());
  if (modal) modal.addEventListener('click', e=>{ if (e.target===modal) modal.close(); });

  const courseGrid=document.getElementById('courseGrid');
  if (courseGrid) courseGrid.addEventListener('click', e=>{
    const btn=e.target.closest('button[data-action]');
    if (!btn) return;
    const action=btn.dataset.action, id=btn.dataset.id;
    if (action==='preview') openModalById(id);
    else if (action==='enroll') alert('코칭 신청은 곧 오픈됩니다! 😊');
  });

  // 초기 렌더 + 리플 바인딩 + 헤더 상태 동기화
  renderCourses(true);
  attachRipples(document);
  handleHeaderShrink();
});
