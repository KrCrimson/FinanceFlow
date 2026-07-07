const fs = require('fs');
const path = require('path');
const files = [
  'frontend/src/sdk/utils/httpClient.js',
  'frontend/src/sdk/modules/auth.js',
  'frontend/src/sdk/modules/movimientos.js',
  'frontend/src/sdk/modules/reportes.js',
  'frontend/src/sdk/modules/usuarios.js',
  'frontend/src/sdk/index.js'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let orig = content;
  content = content.replace(/const\s+([A-Za-z0-9_]+)\s*=\s*require\((['"].+?['"])\);/g, 'import $1 from $2;');
  content = content.replace(/module\.exports\s*=\s*([A-Za-z0-9_]+);/g, 'export default $1;');
  if(content !== orig) {
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  } else {
    console.log('No change in ' + f);
  }
});
