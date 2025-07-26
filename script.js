// ===== THEME MANAGEMENT =====
const toggleBtn = document.getElementById('theme-toggle');
const setTheme = (theme) => {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.body.classList.remove('dark');
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }
  localStorage.setItem('theme', theme);
};

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

toggleBtn.addEventListener('click', () => {
  const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(newTheme);
});

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.querySelector('.hamburger');
  
  if (window.innerWidth <= 1024 && 
      !sidebar.contains(e.target) && 
      !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ===== CODE PLAYGROUND =====
let playgroundEditor = null;
let playgroundOutput = null;

function initializePlayground() {
  // Load Monaco Editor
  if (typeof monaco !== 'undefined') {
    createPlaygroundEditor();
  } else {
    // Load Monaco Editor dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
    script.onload = () => {
      require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
      require(['vs/editor/editor.main'], () => {
        createPlaygroundEditor();
      });
    };
    document.head.appendChild(script);
  }
}

function createPlaygroundEditor() {
  const playgroundContainer = document.getElementById('code-playground');
  if (!playgroundContainer) return;

  // Create editor container
  const editorContainer = document.createElement('div');
  editorContainer.id = 'monaco-editor';
  editorContainer.style.height = '400px';
  editorContainer.style.border = '1px solid var(--border)';
  editorContainer.style.borderRadius = 'var(--border-radius-sm)';
  
  // Create output container
  const outputContainer = document.createElement('div');
  outputContainer.id = 'playground-output';
  outputContainer.style.height = '300px';
  outputContainer.style.border = '1px solid var(--border)';
  outputContainer.style.borderRadius = 'var(--border-radius-sm)';
  outputContainer.style.background = 'white';
  outputContainer.style.padding = '1rem';
  outputContainer.style.overflow = 'auto';
  
  // Create controls
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'playground-controls';
  controlsContainer.innerHTML = `
    <div class="control-group">
      <button id="run-code" class="btn btn-primary">
        <i class="fas fa-play"></i> Run Code
      </button>
      <button id="reset-code" class="btn btn-secondary">
        <i class="fas fa-undo"></i> Reset
      </button>
      <button id="fullscreen-playground" class="btn btn-secondary">
        <i class="fas fa-expand"></i> Fullscreen
      </button>
    </div>
    <div class="control-group">
      <select id="playground-template">
        <option value="basic">Basic HTML</option>
        <option value="styling">CSS Styling</option>
        <option value="layout">Layout Example</option>
        <option value="animation">CSS Animation</option>
        <option value="responsive">Responsive Design</option>
      </select>
    </div>
  `;
  
  // Insert elements
  playgroundContainer.innerHTML = '';
  playgroundContainer.appendChild(controlsContainer);
  playgroundContainer.appendChild(editorContainer);
  playgroundContainer.appendChild(outputContainer);
  
  // Initialize Monaco Editor
  playgroundEditor = monaco.editor.create(editorContainer, {
    value: getDefaultCode('basic'),
    language: 'html',
    theme: document.body.classList.contains('dark') ? 'vs-dark' : 'vs',
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: false,
    cursorStyle: 'line',
    wordWrap: 'on'
  });
  
  playgroundOutput = outputContainer;
  
  // Add event listeners
  document.getElementById('run-code').addEventListener('click', runPlaygroundCode);
  document.getElementById('reset-code').addEventListener('click', resetPlaygroundCode);
  document.getElementById('fullscreen-playground').addEventListener('click', togglePlaygroundFullscreen);
  document.getElementById('playground-template').addEventListener('change', changePlaygroundTemplate);
  
  // Auto-run on code change (with debounce)
  let debounceTimer;
  playgroundEditor.onDidChangeModelContent(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runPlaygroundCode, 1000);
  });
  
  // Initial run
  runPlaygroundCode();
}

function getDefaultCode(template) {
  const templates = {
    basic: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Playground HTML</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    p {
      font-size: 1.2rem;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background: rgba(255,255,255,0.2);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      margin: 10px;
      transition: all 0.3s ease;
    }
    .btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 Selamat Datang di Playground!</h1>
    <p>Edit kode di sebelah kiri dan lihat hasilnya di sini secara real-time.</p>
    <a href="#" class="btn">Mulai Belajar</a>
    <a href="#" class="btn">Lihat Contoh</a>
  </div>
</body>
</html>`,
    
    styling: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Styling Playground</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f0f2f5;
      padding: 20px;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin: 20px auto;
      max-width: 400px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .card h2 {
      color: #1a73e8;
      margin-bottom: 12px;
      font-size: 1.5rem;
    }
    
    .card p {
      color: #5f6368;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    
    .btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .badge {
      display: inline-block;
      background: #e8f5e8;
      color: #2e7d32;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      margin: 8px 4px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>✨ CSS Styling</h2>
    <p>Belajar CSS dengan contoh yang interaktif. Coba ubah warna, ukuran, atau efek hover!</p>
    <button class="btn">Klik Saya</button>
    <div>
      <span class="badge">CSS</span>
      <span class="badge">Styling</span>
      <span class="badge">Modern</span>
    </div>
  </div>
</body>
</html>`,
    
    layout: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Layout Playground</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f8f9fa;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      text-align: center;
    }
    
    .nav {
      background: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav ul {
      list-style: none;
      display: flex;
      justify-content: center;
      gap: 2rem;
    }
    
    .nav a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .nav a:hover {
      color: #667eea;
    }
    
    .main {
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      gap: 2rem;
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    .sidebar {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .content h2 {
      color: #333;
      margin-bottom: 1rem;
    }
    
    .content p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    
    .footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 2rem 0;
      margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
      .main {
        grid-template-columns: 1fr;
      }
      
      .nav ul {
        flex-direction: column;
        gap: 1rem;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>Layout Playground</h1>
  </header>
  
  <nav class="nav">
    <ul>
      <li><a href="#">Beranda</a></li>
      <li><a href="#">Tentang</a></li>
      <li><a href="#">Layanan</a></li>
      <li><a href="#">Kontak</a></li>
    </ul>
  </nav>
  
  <main class="main">
    <aside class="sidebar">
      <h3>Sidebar</h3>
      <p>Area navigasi tambahan atau widget.</p>
    </aside>
    
    <section class="content">
      <h2>Konten Utama</h2>
      <p>Ini adalah area konten utama website. Gunakan CSS Grid dan Flexbox untuk membuat layout yang responsif dan modern.</p>
      <p>Coba ubah grid-template-columns untuk melihat perubahan layout!</p>
    </section>
    
    <aside class="sidebar">
      <h3>Widget</h3>
      <p>Area untuk widget atau informasi tambahan.</p>
    </aside>
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 Layout Playground. All rights reserved.</p>
  </footer>
</body>
</html>`,
    
    animation: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Animation Playground</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(45deg, #667eea, #764ba2);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    
    .container {
      text-align: center;
      color: white;
    }
    
    .animated-box {
      width: 100px;
      height: 100px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      margin: 20px auto;
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      60% {
        transform: translateY(-15px);
      }
    }
    
    .pulse-button {
      background: rgba(255, 255, 255, 0.3);
      border: 2px solid white;
      color: white;
      padding: 15px 30px;
      border-radius: 25px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: pulse 2s infinite;
    }
    
    .pulse-button:hover {
      background: rgba(255, 255, 255, 0.5);
      transform: scale(1.05);
    }
    
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
      }
    }
    
    .rotating-icon {
      font-size: 3rem;
      margin: 20px;
      animation: rotate 3s linear infinite;
    }
    
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    .fade-in {
      opacity: 0;
      animation: fadeIn 2s ease-in forwards;
    }
    
    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }
    
    .slide-in {
      transform: translateX(-100%);
      animation: slideIn 1s ease-out forwards;
    }
    
    @keyframes slideIn {
      to {
        transform: translateX(0);
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="fade-in">🎨 CSS Animation Playground</h1>
    <p class="slide-in">Coba berbagai animasi CSS di sini!</p>
    
    <div class="animated-box"></div>
    
    <button class="pulse-button">Klik Saya!</button>
    
    <div class="rotating-icon">⚡</div>
    
    <p>Coba ubah nilai animation-duration atau keyframes untuk melihat perubahan!</p>
  </div>
</body>
</html>`,
    
    responsive: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsive Design Playground</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f8f9fa;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem 0;
      text-align: center;
    }
    
    .header h1 {
      font-size: clamp(1.5rem, 5vw, 3rem);
      margin-bottom: 1rem;
    }
    
    .header p {
      font-size: clamp(1rem, 3vw, 1.2rem);
      opacity: 0.9;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
    }
    
    .card h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    
    .card p {
      color: #666;
      line-height: 1.6;
    }
    
    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .mobile-menu {
      display: none;
      background: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-menu ul {
      list-style: none;
    }
    
    .mobile-menu li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .mobile-menu a {
      color: #333;
      text-decoration: none;
    }
    
    .desktop-nav {
      background: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .desktop-nav ul {
      list-style: none;
      display: flex;
      justify-content: center;
      gap: 2rem;
    }
    
    .desktop-nav a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .desktop-nav a:hover {
      color: #667eea;
    }
    
    .footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 2rem 0;
      margin-top: 3rem;
    }
    
    /* Mobile First Approach */
    @media (max-width: 768px) {
      .desktop-nav {
        display: none;
      }
      
      .mobile-menu {
        display: block;
      }
      
      .grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .card {
        padding: 1.5rem;
      }
    }
    
    @media (min-width: 769px) {
      .mobile-menu {
        display: none;
      }
    }
    
    /* Tablet */
    @media (min-width: 768px) and (max-width: 1024px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    /* Large Desktop */
    @media (min-width: 1200px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <h1>📱 Responsive Design</h1>
      <p>Coba ubah ukuran browser untuk melihat responsivitas!</p>
    </div>
  </header>
  
  <nav class="desktop-nav">
    <div class="container">
      <ul>
        <li><a href="#">Beranda</a></li>
        <li><a href="#">Fitur</a></li>
        <li><a href="#">Tentang</a></li>
        <li><a href="#">Kontak</a></li>
      </ul>
    </div>
  </nav>
  
  <nav class="mobile-menu">
    <ul>
      <li><a href="#">Beranda</a></li>
      <li><a href="#">Fitur</a></li>
      <li><a href="#">Tentang</a></li>
      <li><a href="#">Kontak</a></li>
    </ul>
  </nav>
  
  <main class="container">
    <div class="grid">
      <div class="card">
        <div class="card-icon">📱</div>
        <h3>Mobile First</h3>
        <p>Design dimulai dari mobile, kemudian scale up untuk desktop.</p>
      </div>
      
      <div class="card">
        <div class="card-icon">🎨</div>
        <h3>Flexible Layout</h3>
        <p>Grid dan Flexbox untuk layout yang adaptif.</p>
      </div>
      
      <div class="card">
        <div class="card-icon">⚡</div>
        <h3>Fast Loading</h3>
        <p>Optimasi untuk performa di semua device.</p>
      </div>
      
      <div class="card">
        <div class="card-icon">🔧</div>
        <h3>Easy Maintenance</h3>
        <p>Kode yang bersih dan mudah dipelihara.</p>
      </div>
    </div>
  </main>
  
  <footer class="footer">
    <div class="container">
      <p>&copy; 2024 Responsive Design Playground</p>
    </div>
  </footer>
</body>
</html>`
  };
  
  return templates[template] || templates.basic;
}

function runPlaygroundCode() {
  if (!playgroundEditor || !playgroundOutput) return;
  
  const code = playgroundEditor.getValue();
  
  // Create iframe for safe execution
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.borderRadius = 'var(--border-radius-sm)';
  
  playgroundOutput.innerHTML = '';
  playgroundOutput.appendChild(iframe);
  
  // Write code to iframe
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(code);
  iframeDoc.close();
}

function resetPlaygroundCode() {
  if (!playgroundEditor) return;
  
  const template = document.getElementById('playground-template').value;
  playgroundEditor.setValue(getDefaultCode(template));
}

function togglePlaygroundFullscreen() {
  const playground = document.getElementById('code-playground');
  if (!playground) return;
  
  if (playground.classList.contains('fullscreen')) {
    playground.classList.remove('fullscreen');
    document.body.style.overflow = '';
  } else {
    playground.classList.add('fullscreen');
    document.body.style.overflow = 'hidden';
  }
  
  // Resize editor
  if (playgroundEditor) {
    playgroundEditor.layout();
  }
}

function changePlaygroundTemplate() {
  if (!playgroundEditor) return;
  
  const template = document.getElementById('playground-template').value;
  playgroundEditor.setValue(getDefaultCode(template));
}

// ===== MODULE DATA =====
const moduleData = {
  html: [
    { id: '01', file: '01-pengenalan-html.html', title: 'Pengenalan HTML', icon: 'fas fa-info-circle' },
    { id: '02', file: '02-struktur-dasar-html.html', title: 'Struktur Dasar HTML', icon: 'fas fa-code' },
    { id: '03', file: '03-heading-paragraf.html', title: 'Heading & Paragraf', icon: 'fas fa-heading' },
    { id: '04', file: '04-list.html', title: 'List (Daftar)', icon: 'fas fa-list' },
    { id: '05', file: '05-link-navigasi.html', title: 'Link & Navigasi', icon: 'fas fa-link' },
    { id: '06', file: '06-gambar-multimedia.html', title: 'Gambar & Multimedia', icon: 'fas fa-image' },
    { id: '07', file: '07-table.html', title: 'Tabel', icon: 'fas fa-table' },
    { id: '08', file: '08-form.html', title: 'Formulir (Form)', icon: 'fas fa-wpforms' },
    { id: '09', file: '09-semantic.html', title: 'Semantic HTML', icon: 'fas fa-tags' },
    { id: '10', file: '10-html5-api.html', title: 'HTML5 API', icon: 'fas fa-cogs' },
    { id: '11', file: '11-best-practice-seo.html', title: 'Best Practice & SEO', icon: 'fas fa-search' },
    { id: '12', file: '12-html-advanced.html', title: 'HTML Lanjutan', icon: 'fas fa-rocket' },
    { id: '13', file: '13-accessibility.html', title: 'Aksesibilitas', icon: 'fas fa-universal-access' },
    { id: '14', file: '14-html-validation.html', title: 'Validasi HTML', icon: 'fas fa-check-circle' }
  ],
  css: [
    { id: '15', file: '15-pengenalan-css.html', title: 'Pengenalan CSS', icon: 'fas fa-palette' },
    { id: '16', file: '16-selector-css.html', title: 'CSS Selector', icon: 'fas fa-crosshairs' },
    { id: '17', file: '17-box-model.html', title: 'Box Model', icon: 'fas fa-square' },
    { id: '18', file: '18-layout-css.html', title: 'Layout CSS', icon: 'fas fa-th-large' },
    { id: '19', file: '19-flexbox.html', title: 'Flexbox', icon: 'fas fa-arrows-alt-h' },
    { id: '20', file: '20-css-grid.html', title: 'CSS Grid', icon: 'fas fa-border-all' },
    { id: '21', file: '21-responsive-design.html', title: 'Responsive Design', icon: 'fas fa-mobile-alt' },
    { id: '22', file: '22-css-animation.html', title: 'CSS Animation', icon: 'fas fa-magic' },
    { id: '23', file: '23-css-transforms.html', title: 'CSS Transforms', icon: 'fas fa-sync' },
    { id: '24', file: '24-css-variables.html', title: 'CSS Variables', icon: 'fas fa-database' },
    { id: '25', file: '25-css-preprocessors.html', title: 'CSS Preprocessors', icon: 'fas fa-code-branch' }
  ],
  projects: [
    { id: '26', file: '26-project-landing-page.html', title: 'Landing Page', icon: 'fas fa-home' },
    { id: '27', file: '27-project-portfolio.html', title: 'Portfolio Website', icon: 'fas fa-briefcase' },
    { id: '28', file: '28-project-blog.html', title: 'Blog Website', icon: 'fas fa-blog' },
    { id: '29', file: '29-project-ecommerce.html', title: 'E-commerce Page', icon: 'fas fa-shopping-cart' },
    { id: '30', file: '30-project-dashboard.html', title: 'Admin Dashboard', icon: 'fas fa-chart-bar' }
  ]
};

// ===== PROGRESS TRACKING =====
let userProgress = JSON.parse(localStorage.getItem('userProgress')) || {
  completed: [],
  currentModule: null
};

function updateProgress(moduleId) {
  if (!userProgress.completed.includes(moduleId)) {
    userProgress.completed.push(moduleId);
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  }
  updateProgressUI();
}

function updateProgressUI() {
  const allModules = [...moduleData.html, ...moduleData.css, ...moduleData.projects];
  const completedCount = userProgress.completed.length;
  const totalCount = allModules.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  // Update progress text and bar
  document.getElementById('progress-text').textContent = `${progressPercentage}%`;
  document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
  
  // Update sidebar progress
  document.getElementById('completed-count').textContent = completedCount;
  document.getElementById('total-count').textContent = totalCount;

  // Update module completion status
  updateModuleCompletionStatus();
}

function updateModuleCompletionStatus() {
  const allLinks = document.querySelectorAll('.nav-section a');
  allLinks.forEach(link => {
    const moduleId = link.getAttribute('data-module-id');
    if (moduleId && userProgress.completed.includes(moduleId)) {
      link.classList.add('completed');
    } else {
      link.classList.remove('completed');
    }
  });
}

// ===== SIDEBAR GENERATION =====
function generateSidebar() {
  // Generate HTML modules
  const htmlList = document.getElementById('module-list');
  htmlList.innerHTML = moduleData.html.map(module => `
    <li>
      <a href="modules/${module.file}" data-module-id="${module.id}">
        <i class="${module.icon}"></i>
        <span>${module.id}. ${module.title}</span>
      </a>
    </li>
  `).join('');

  // Generate CSS modules
  const cssList = document.getElementById('css-module-list');
  cssList.innerHTML = moduleData.css.map(module => `
    <li>
      <a href="modules/${module.file}" data-module-id="${module.id}">
        <i class="${module.icon}"></i>
        <span>${module.id}. ${module.title}</span>
      </a>
    </li>
  `).join('');

  // Generate Project modules
  const projectList = document.getElementById('project-module-list');
  projectList.innerHTML = moduleData.projects.map(module => `
    <li>
      <a href="modules/${module.file}" data-module-id="${module.id}">
        <i class="${module.icon}"></i>
        <span>${module.id}. ${module.title}</span>
      </a>
    </li>
  `).join('');

  // Add click handlers
  addModuleClickHandlers();
}

function addModuleClickHandlers() {
  const moduleLinks = document.querySelectorAll('.nav-section a');
  moduleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const moduleId = link.getAttribute('data-module-id');
      if (moduleId) {
        userProgress.currentModule = moduleId;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
      }
      
      // Close sidebar on mobile
      if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  });
}

// ===== MODULE NAVIGATION =====
function getCurrentModuleIndex() {
  const path = window.location.pathname.split('/').pop();
  const allModules = [...moduleData.html, ...moduleData.css, ...moduleData.projects];
  return allModules.findIndex(m => m.file === path);
}

function updateSidebarActive() {
  const path = window.location.pathname.split('/').pop();
  const allModules = [...moduleData.html, ...moduleData.css, ...moduleData.projects];
  const currentModule = allModules.find(m => m.file === path);
  
  if (currentModule) {
    // Remove all active classes
    document.querySelectorAll('.nav-section a').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current module
    const activeLink = document.querySelector(`[data-module-id="${currentModule.id}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    
    // Update progress
    updateProgress(currentModule.id);
  }
}

function generateModuleNavigation() {
  const idx = getCurrentModuleIndex();
  if (idx === -1) return;
  
  const allModules = [...moduleData.html, ...moduleData.css, ...moduleData.projects];
  const prev = allModules[idx - 1];
  const next = allModules[idx + 1];
  
  const navDiv = document.getElementById('module-navigation');
  if (!navDiv) return;
  
  navDiv.innerHTML = `
    <div class="module-navigation">
      ${prev ? `
        <a href="${prev.file}" class="nav-button">
          <i class="fas fa-chevron-left"></i>
          ${prev.title}
        </a>
      ` : '<span></span>'}
      
      ${next ? `
        <a href="${next.file}" class="nav-button">
          ${next.title}
          <i class="fas fa-chevron-right"></i>
        </a>
      ` : '<span></span>'}
    </div>
  `;
}

// ===== UTILITY FUNCTIONS =====
function scrollToFirstModule() {
  const firstModuleLink = document.querySelector('#module-list a');
  if (firstModuleLink) {
    firstModuleLink.click();
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Generate sidebar
  generateSidebar();
  
  // Update UI
  updateProgressUI();
  updateSidebarActive();
  
  // Generate navigation if on module page
  if (window.location.pathname.includes('modules/')) {
    generateModuleNavigation();
  }
  
  // Show welcome content or module content
  const welcomeContent = document.getElementById('welcome-content');
  const moduleContent = document.getElementById('module-content');
  
  if (window.location.pathname.includes('modules/')) {
    welcomeContent.style.display = 'none';
    moduleContent.style.display = 'block';
  } else {
    welcomeContent.style.display = 'block';
    moduleContent.style.display = 'none';
  }
  
  // Initialize playground if exists
  if (document.getElementById('code-playground')) {
    initializePlayground();
  }
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  // Escape key to close sidebar
  if (e.key === 'Escape') {
    document.getElementById('sidebar').classList.remove('open');
    
    // Also exit fullscreen playground
    const playground = document.getElementById('code-playground');
    if (playground && playground.classList.contains('fullscreen')) {
      togglePlaygroundFullscreen();
    }
  }
  
  // Arrow keys for navigation (only on module pages)
  if (window.location.pathname.includes('modules/')) {
    const idx = getCurrentModuleIndex();
    const allModules = [...moduleData.html, ...moduleData.css, ...moduleData.projects];
    
    if (e.key === 'ArrowLeft' && idx > 0) {
      window.location.href = allModules[idx - 1].file;
    } else if (e.key === 'ArrowRight' && idx < allModules.length - 1) {
      window.location.href = allModules[idx + 1].file;
    }
  }
});

// ===== AUTO-SAVE PROGRESS =====
window.addEventListener('beforeunload', () => {
  const currentModule = getCurrentModuleIndex();
  if (currentModule !== -1) {
    const allModules = [...moduleData.html, ...moduleData.css, ...moduleData.projects];
    const moduleId = allModules[currentModule].id;
    updateProgress(moduleId);
  }
}); 