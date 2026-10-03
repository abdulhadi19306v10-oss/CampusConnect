const fs = require('fs');
const path = require('path');

const dirs = [
  'C:/Users/User/.gemini/antigravity-ide/scratch/CampusConnect/client',
  'C:/Users/User/.gemini/antigravity-ide/scratch/CampusConnect/client/admin'
];

dirs.forEach(dir => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the injected scripts
    content = content.replace(/<script src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.7\.1\/firebase-app-compat\.js"><\/script>\s*/g, '');
    content = content.replace(/<script src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.7\.1\/firebase-firestore-compat\.js"><\/script>\s*/g, '');
    content = content.replace(/<script src="https:\/\/www\.gstatic\.com\/firebasejs\/10\.7\.1\/firebase-auth-compat\.js"><\/script>\s*/g, '');
    content = content.replace(/<script src="js\/firebase-config\.js"><\/script>\s*/g, '');
    content = content.replace(/<script src="\.\.\/js\/firebase-config\.js"><\/script>\s*/g, '');
    
    fs.writeFileSync(filePath, content);
  });
});
console.log('Removed Firebase scripts');
