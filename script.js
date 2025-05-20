// Get DOM elements
const editor = document.getElementById('editor');
const themeToggle = document.getElementById('theme-toggle');
const exportTxt = document.getElementById('export-txt');
const exportMd = document.getElementById('export-md');
const exportPdf = document.getElementById('export-pdf');
const wordCount = document.getElementById('word-count');
const darkModeFavicon = document.getElementById('dark-mode-favicon');
const menuToggle = document.getElementById('menu-toggle');
const hiddenMenu = document.getElementById('hidden-menu');
const versioningLink = document.getElementById('versioning-link');
const versioningPage = document.getElementById('versioning-page');
const closeVersioning = document.getElementById('close-versioning');

// Load saved text and dark mode preference from local storage
const savedText = localStorage.getItem('savedText');
const savedTheme = localStorage.getItem('theme');

if (savedText) {
  editor.value = savedText;
}

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  darkModeFavicon.disabled = false;
  document.querySelector('link[rel="icon"]').disabled = true;
} else {
  document.body.classList.remove('dark-mode');
  darkModeFavicon.disabled = true;
  document.querySelector('link[rel="icon"]').disabled = false;
}

// Update word and character count
function updateWordCount() {
  const text = editor.value;
  const words = text.split(/\s+/).filter(word => word.length > 0).length;
  const characters = text.length;
  wordCount.textContent = `Words: ${words} | Characters: ${characters}`;
}

// Save text to local storage and update word count
editor.addEventListener('input', () => {
  localStorage.setItem('savedText', editor.value);
  updateWordCount();
});

// Toggle dark mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Save theme preference to local storage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    darkModeFavicon.disabled = false;
    document.querySelector('link[rel="icon"]').disabled = true;
  } else {
    localStorage.setItem('theme', 'light');
    darkModeFavicon.disabled = true;
    document.querySelector('link[rel="icon"]').disabled = false;
  }
});

// Export as TXT
exportTxt.addEventListener('click', () => {
  const text = editor.value;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Export as MD
exportMd.addEventListener('click', () => {
  const text = editor.value;
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
  a.click();
  URL.revokeObjectURL(url);
});

// Export as PDF
exportPdf.addEventListener('click', () => {
  const text = editor.value;

  // Initialize jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Set font and size
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);

  // Define margins (1 inch = 25.4 mm)
  const marginLeft = 25.4; // Left margin
  const marginTop = 25.4; // Top margin
  const marginRight = 25.4; // Right margin
  const pageWidth = doc.internal.pageSize.getWidth(); // Get page width
  const maxWidth = pageWidth - marginLeft - marginRight; // Calculate max text width

  // Split text into lines and add to PDF
  const lines = doc.splitTextToSize(text, maxWidth); // Split text to fit within maxWidth
  let yPos = marginTop; // Start position for text (y-axis)

  // Add lines to the PDF
  lines.forEach((line) => {
    if (yPos > doc.internal.pageSize.getHeight() - 25.4) { // Check if near bottom margin
      doc.addPage(); // Add a new page
      yPos = marginTop; // Reset yPos for the new page
    }
    doc.text(line, marginLeft, yPos); // Add text at (x, y) position
    yPos += 10; // Move yPos down for the next line (line height)
  });

  // Save the PDF
  doc.save('document.pdf');
});

// Toggle hidden menu
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent the click from propagating to the document
  hiddenMenu.style.display = hiddenMenu.style.display === 'block' ? 'none' : 'block';
});

// Close hidden menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hiddenMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    hiddenMenu.style.display = 'none';
  }
});

// Show versioning page
versioningLink.addEventListener('click', (e) => {
  e.preventDefault();
  versioningPage.style.display = 'flex';
});

// Close versioning page
closeVersioning.addEventListener('click', () => {
  versioningPage.style.display = 'none';
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Clear text (Ctrl + Alt + C)
  if (e.ctrlKey && e.altKey && e.key === 'c') {
    editor.value = '';
    localStorage.removeItem('savedText');
    updateWordCount();
  }
  // Toggle dark mode (Ctrl + Alt + D)
  if (e.ctrlKey && e.altKey && e.key === 'd') {
    document.body.classList.toggle('dark-mode');

    // Save theme preference to local storage
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      darkModeFavicon.disabled = false;
      document.querySelector('link[rel="icon"]').disabled = true;
    } else {
      localStorage.setItem('theme', 'light');
      darkModeFavicon.disabled = true;
      document.querySelector('link[rel="icon"]').disabled = false;
    }
  }
});

// Initialize word count
updateWordCount();