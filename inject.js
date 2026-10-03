const fs = require('fs');
const path = require('path');

const dirs = [
  'C:/Users/User/.gemini/antigravity-ide/scratch/CampusConnect/client',
  'C:/Users/User/.gemini/antigravity-ide/scratch/CampusConnect/client/admin'
];

const scriptsToInject = `
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
  <script src="js/firebase-config.js"></script>
`;
const adminScriptsToInject = `
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
  <script src="../js/firebase-config.js"></script>
`;

dirs.forEach(dir => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('src="js/api.js"')) {
      content = content.replace('<script src="js/api.js"></script>', scriptsToInject + '\n  <script src="js/api.js"></script>');
    } else if (content.includes('src="../js/api.js"')) {
      content = content.replace('<script src="../js/api.js"></script>', adminScriptsToInject + '\n  <script src="../js/api.js"></script>');
    } else if (file === 'index.html') {
      content = content.replace('</body>', scriptsToInject + '\n</body>');
    }
    
    fs.writeFileSync(filePath, content);
  });
});
console.log('Injected Firebase scripts');
