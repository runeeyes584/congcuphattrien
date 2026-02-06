document.getElementById('fetchBtn').addEventListener('click', fetchRepos);
document.getElementById('username').addEventListener('keypress', (e) => { if (e.key === 'Enter') fetchRepos(); });

async function fetchRepos() {
  const user = document.getElementById('username').value.trim();
  const msg = document.getElementById('message');
  const list = document.getElementById('repoList');
  list.innerHTML = '';
  msg.textContent = '';
  if (!user) { msg.textContent = 'Vui lòng nhập username.'; return; }
  msg.textContent = 'Loading...';
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('User not found');
      throw new Error(res.status + ' ' + res.statusText);
    }
    const repos = await res.json();
    if (!Array.isArray(repos)) throw new Error('Unexpected response');
    if (repos.length === 0) { msg.textContent = 'Không có repo công khai.'; return; }
    msg.textContent = `Tìm thấy ${repos.length} repo (sắp xếp theo sao).`;
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    repos.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<div><a href="${r.html_url}" target="_blank" rel="noopener noreferrer">${r.name}</a></div>` +
        `<div class="meta">${r.description || ''} • ★ ${r.stargazers_count} • Forks: ${r.forks_count}</div>`;
      list.appendChild(li);
    });
  } catch (err) {
    msg.textContent = 'Lỗi: ' + err.message;
  }
}
