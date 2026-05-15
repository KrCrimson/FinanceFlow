const fs = require('fs');
const path = './documentacion/api_casos_uso.md';
let markdown = fs.readFileSync(path, 'utf8');

const style = `left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}`;

const styleIA = `left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #FBE9E7
  BorderColor #D84315
  ArrowColor #D84315
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}`;

const diagrams = {
  'CU-01': `${style}\nactor "Usuario No Registrado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Registrar Usuario" as UC\n}\nU --> UC`,
  'CU-02': `${style}\nactor "Usuario Registrado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Iniciar Sesión" as UC\n}\nU --> UC`,
  'CU-03': `${style}\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Registrar Movimiento" as UC\n}\nU --> UC`,
  'CU-04': `${style}\nactor "Usuario Autenticado" as U\nactor "Microservicio IA (Python)" as ML <<Sistema>>\nrectangle "Sistema FinanceFlow" {\n  usecase "Escanear Recibo" as UC\n}\nU --> UC\nUC .> ML : <<include>>`,
  'CU-05': `${style}\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Visualizar Dashboard" as UC\n}\nU --> UC`,
  'CU-06': `${style}\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Modificar Movimiento" as UC\n}\nU --> UC`,
  'CU-07': `${style}\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Inhabilitar Movimiento" as UC\n}\nU --> UC`,
  'CU-08': `${style}\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Filtrar y Analizar Reportes" as UC\n}\nU --> UC`,
  'CU-09': `${styleIA}\nactor "Sistema Frontend" as Front <<Sistema>>\nactor "Motor Python Backend" as ML <<Microservicio>>\nrectangle "Sistema FinanceFlow" {\n  usecase "Reentrenar Clasificador IA" as UC\n}\nFront --> UC\nUC --> ML`,
  'CU-10': `${style}\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Cerrar Sesión" as UC\n}\nU --> UC`,
  'CU-11': `${style}\nactor "Usuario No Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Recuperar Contraseña" as UC\n}\nU --> UC`,
  'CU-12': `${style}\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Consultar/Editar Perfil" as UC\n}\nU --> UC`,
  'CU-13': `${style}\nactor "Administrador" as Admin\nrectangle "Sistema FinanceFlow" {\n  usecase "Visualizar Auditoría (Logs)" as UC\n}\nAdmin --> UC`
};

for (let i = 1; i <= 13; i++) {
  const id = 'CU-' + String(i).padStart(2, '0');
  const searchRegex = new RegExp(`(### ${id}[\\s\\S]*?)\`\`\`plantuml\\s*@startuml\\s*[\\s\\S]*?\\s*@enduml\\s*\`\`\``);
  markdown = markdown.replace(searchRegex, `$1\`\`\`plantuml\n@startuml\n${diagrams[id]}\n@enduml\n\`\`\``);
}

fs.writeFileSync(path, markdown, 'utf8');
console.log('Todos los diagramas han sido mejorados!');
