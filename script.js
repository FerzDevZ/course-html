const toggleBtn = document.getElementById('theme-toggle');
const setTheme = (theme) => {
  if (theme === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
  toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
};
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
toggleBtn.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(newTheme);
});

// Tutup sidebar setelah klik link di mobile
const sidebar = document.querySelector('.sidebar');
const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 600) {
      sidebar.classList.remove('open');
    }
  });
});

// === Fitur Navigasi Next/Prev Otomatis & Highlight Sidebar ===
const modulList = [
  {file: '01-pengenalan-html.html', title: '1. Pengenalan HTML'},
  {file: '02-struktur-dasar-html.html', title: '2. Struktur Dasar HTML'},
  {file: '03-heading-paragraf.html', title: '3. Heading & Paragraf'},
  {file: '04-list.html', title: '4. List'},
  {file: '05-link-navigasi.html', title: '5. Link & Navigasi'},
  {file: '06-gambar-multimedia.html', title: '6. Gambar & Multimedia'},
  {file: '07-table.html', title: '7. Table'},
  {file: '08-form.html', title: '8. Formulir (Form)'},
  {file: '09-semantic.html', title: '9. Semantic HTML'},
  {file: '10-html5-api.html', title: '10. HTML5 API'},
  {file: '11-best-practice-seo.html', title: '11. Best Practice & SEO Dasar'}
  // Tambahkan modul berikutnya di sini
];

function getCurrentModulIndex() {
  const path = window.location.pathname.split('/').pop();
  return modulList.findIndex(m => m.file === path);
}

function updateSidebarActive() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
    if (link.getAttribute('href') && link.getAttribute('href').endsWith(path)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function updateNextPrevNav() {
  const idx = getCurrentModulIndex();
  if (idx === -1) return;
  const prev = modulList[idx-1];
  const next = modulList[idx+1];
  const navDiv = document.getElementById('modul-nav');
  if (!navDiv) return;
  navDiv.innerHTML = `
    <div style="margin-top:2rem;display:flex;justify-content:space-between;">
      ${prev ? `<a href="${prev.file}">⬅️ ${prev.title}</a>` : '<span></span>'}
      ${next ? `<a href="${next.file}">${next.title} ➡️</a>` : '<span></span>'}
    </div>
  `;
}

if (document.querySelector('.sidebar nav ul')) {
  updateSidebarActive();
}
updateNextPrevNav(); 