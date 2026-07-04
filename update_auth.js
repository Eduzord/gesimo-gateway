const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const modules = ['imoveis', 'locador', 'locatarios', 'roles', 'usuarios'];

for (const mod of modules) {
    const controllerPath = path.join(srcDir, mod, `${mod}.controller.ts`);
    const servicePath = path.join(srcDir, mod, `${mod}.service.ts`);
    
    // Process Controller
    let c = fs.readFileSync(controllerPath, 'utf8');
    if (!c.includes('Req')) {
        c = c.replace(/\}\s*from\s*'@nestjs\/common';/, ', Req } from \'@nestjs/common\';');
    }
    c = c.replace(/@Headers\('authorization'\) authHeader: string/g, '@Req() req: any');
    c = c.replace(/authHeader\)/g, 'req.user)');
    c = c.replace(/authHeader,/g, 'req.user,');
    fs.writeFileSync(controllerPath, c);
    
    // Process Service
    let s = fs.readFileSync(servicePath, 'utf8');
    s = s.replace(/authHeader: string/g, 'user: any');
    
    // Replace the simple Authorization header
    s = s.replace(/headers:\s*\{\s*Authorization:\s*authHeader\s*\}/g, 
        `headers: { 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email }`);
        
    // Replace the Authorization with Content-Type header
    s = s.replace(/headers:\s*\{\s*Authorization:\s*authHeader,\s*'Content-Type':\s*'application\/pdf'\s*\}/g, 
        `headers: { 'x-user-id': user?.sub || user?.id, 'x-user-role': user?.role, 'x-user-email': user?.email, 'Content-Type': 'application/pdf' }`);
        
    fs.writeFileSync(servicePath, s);
}
console.log('Done modifying controllers and services.');
