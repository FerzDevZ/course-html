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