const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/windows11/Documents/GitHub/Sistema de balance/frontend/src');

files.forEach(file => {
  if (file.includes('services\\') || file.includes('services/')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  content = content.replace(/from\s+['"](.*)movimientosService(\.js)?['"]/g, 'from \'$1movimientos-adapter\'');
  content = content.replace(/from\s+['"](.*)authService(\.js)?['"]/g, 'from \'$1auth-adapter\'');
  content = content.replace(/from\s+['"](.*)userService(\.js)?['"]/g, 'from \'$1usuarios-adapter\'');
  content = content.replace(/from\s+['"](.*)reportesService(\.js)?['"]/g, 'from \'$1reportes-adapter\'');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
