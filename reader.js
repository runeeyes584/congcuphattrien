const STORY_URL = './stories/sample_story.json';

let state = { story: null, idx: 0, fs: 'fs-normal', dark: true };

const el = {
  storyTitle: document.getElementById('storyTitle'),
  chapterTitle: document.getElementById('chapterTitle'),
  contentArea: document.getElementById('contentArea'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  prevBtnBottom: document.getElementById('prevBtnBottom'),
  nextBtnBottom: document.getElementById('nextBtnBottom'),
  increaseFS: document.getElementById('increaseFS'),
  decreaseFS: document.getElementById('decreaseFS'),
  themeSwitch: document.getElementById('themeSwitch'),
  progressText: document.getElementById('progressText'),
  tocBtn: document.getElementById('tocBtn'),
  tocModal: document.getElementById('tocModal'),
  tocList: document.getElementById('tocList'),
  closeToc: document.getElementById('closeToc'),
  root: document.getElementById('root')
};

function applyPreferences(){
  document.body.setAttribute('data-theme', state.dark ? 'dark' : 'light');
  el.contentArea.classList.remove('fs-small','fs-normal','fs-large');
  el.contentArea.classList.add(state.fs);
  if(el.themeSwitch) el.themeSwitch.checked = state.dark;
}

function renderChapter(){
  const story = state.story;
  if(!story) return;
  const ch = story.chapters[state.idx];
  el.storyTitle.textContent = story.title;
  el.chapterTitle.textContent = ch.title;
  // set content and bring to top
  el.contentArea.innerHTML = ch.content;
  el.contentArea.scrollTop = 0;
  el.progressText.textContent = `${state.idx+1} / ${story.chapters.length}`;
  if(el.prevBtn) el.prevBtn.disabled = el.prevBtnBottom.disabled = (state.idx === 0);
  if(el.nextBtn) el.nextBtn.disabled = el.nextBtnBottom.disabled = (state.idx === story.chapters.length -1);
  // highlight current in TOC if open
  highlightToc();
}

function prev(){ if(state.idx>0){ state.idx--; saveState(); renderChapter(); } }
function next(){ if(state.story && state.idx < state.story.chapters.length-1){ state.idx++; saveState(); renderChapter(); } }

function increaseFS(){ if(state.fs === 'fs-small') state.fs='fs-normal'; else if(state.fs==='fs-normal') state.fs='fs-large'; saveState(); applyPreferences(); }
function decreaseFS(){ if(state.fs === 'fs-large') state.fs='fs-normal'; else if(state.fs==='fs-normal') state.fs='fs-small'; saveState(); applyPreferences(); }

function toggleTheme(){ state.dark = !state.dark; saveState(); applyPreferences(); }

function saveState(){ try{ localStorage.setItem('reader.state', JSON.stringify({idx:state.idx, fs:state.fs, dark:state.dark})); }catch{} }
function loadState(){ try{ const s = JSON.parse(localStorage.getItem('reader.state')); if(s){ state.idx = (typeof s.idx === 'number') ? s.idx : 0; state.fs = s.fs||'fs-normal'; state.dark = !!s.dark; } }catch{} }

async function loadStory(){
  try{
    const res = await fetch(STORY_URL);
    if(!res.ok) throw new Error('Không thể tải truyện');
    state.story = await res.json();
    loadState();
    applyPreferences();
    renderChapter();
    renderToc();
  }catch(err){ el.contentArea.innerHTML = `<p style="color:#c00">Lỗi: ${err.message}</p>` }
}

/* TOC handling */
function renderToc(){
  if(!state.story) return;
  el.tocList.innerHTML = '';
  state.story.chapters.forEach((c, i) =>{
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${c.title}`;
    li.dataset.idx = i;
    li.addEventListener('click', ()=>{ state.idx = i; saveState(); renderChapter(); closeToc(); });
    el.tocList.appendChild(li);
  });
  highlightToc();
}

function highlightToc(){
  if(!el.tocList) return;
  Array.from(el.tocList.children).forEach(li => li.style.background = '');
  const cur = el.tocList.querySelector(`li[data-idx="${state.idx}"]`);
  if(cur) cur.style.background = 'rgba(37,99,235,0.08)';
}

function openToc(){ el.tocModal.setAttribute('aria-hidden','false'); }
function closeToc(){ el.tocModal.setAttribute('aria-hidden','true'); }

// Event bindings
if(el.prevBtn) el.prevBtn.addEventListener('click', prev);
if(el.nextBtn) el.nextBtn.addEventListener('click', next);
if(el.prevBtnBottom) el.prevBtnBottom.addEventListener('click', prev);
if(el.nextBtnBottom) el.nextBtnBottom.addEventListener('click', next);
if(el.increaseFS) el.increaseFS.addEventListener('click', increaseFS);
if(el.decreaseFS) el.decreaseFS.addEventListener('click', decreaseFS);
if(el.themeSwitch) el.themeSwitch.addEventListener('change', toggleTheme);
if(el.tocBtn) el.tocBtn.addEventListener('click', openToc);
if(el.closeToc) el.closeToc.addEventListener('click', closeToc);

// Keyboard: Left/Right arrows for navigation, +/- for font size, t for theme, Esc to close TOC
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowLeft') prev();
  if(e.key === 'ArrowRight') next();
  if(e.key === '+' || e.key === '=') increaseFS();
  if(e.key === '-') decreaseFS();
  if(e.key.toLowerCase() === 't') toggleTheme();
  if(e.key === 'Escape') closeToc();
});

loadStory();
