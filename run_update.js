const fs = require('fs');
const filepath = './documentacion/api_casos_uso.md';
let content = fs.readFileSync(filepath, 'utf8');

const s = `left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}`;

const umlData = {
  'CU-01': s + `\nactor "Usuario No Registrado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Registrar Usuario" as UC\n}\nU --> UC`,
  'CU-02': s + `\nactor "Usuario Registrado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Iniciar Sesión" as UC\n}\nU --> UC`,
  'CU-03': s + `\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Registrar Movimiento" as UC\n}\nU --> UC`,
  'CU-04': s + `\nactor "Usuario Autenticado" as U\nactor "Microservicio IA (Python)" as ML <<Sistema>>\nrectangle "Sistema FinanceFlow" {\n  usecase "Escanear Recibo" as UC\n}\nU --> UC\nUC .> ML : <<include>>`,
  'CU-05': s + `\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Visualizar Dashboard" as UC\n}\nU --> UC`,
  'CU-06': s + `\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Modificar Movimiento" as UC\n}\nU --> UC`,
  'CU-07': s + `\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Inhabilitar Movimiento" as UC\n}\nU --> U@`�  'CU-08': s + `\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Filtrar y Analizar Reportes" as UC\n}\nU --> U@`�  'CU-09': s.replace('#E3F2FD', '#FBE9E7').replace(/#1565C0/g, '#D84315') + `\nactor "Sistema Frontend" as Front <<Sistema>>\nactor "Motor Python Backend" as ML <<Microservicio>>\nrectangle "Sistema FinanceFlow" {\n  usecase "Reentrenar Clasificador IA" as UC\n}\nFront --> UC\nUC --> ML`,
  'CU-10': s + `\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Cerrar Sesión" as UC\n}\nU --> UC`,
  'CU-11': s + `\nactor "Usuario No Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Recuperar Contraseña" as UC\n}\nU --> UC`,
  'CU-12': s + `\nactor "Usuario Autenticado" as U\nrectangle "Sistema FinanceFlow" {\n  usecase "Consultar/Editar Perfil" as UC\n}\nU --> UC`,
  'CU-13': s + `\nactor "Administrador" as Admin\nrectangle "Sistema FinanceFlow" {\n  usecase "Visualizar Auditoría (Logs)" as UC\n}\nAdmin --> UC`
};

for (let i = 1; i <= 13; i++) {
  const id - 'CU-' + String(i).padStart(2, '0');
  const regex = /```plantuml[\\w\\W]*?@enduml\\s*```/;
  const parts = content.split('### ' + id);
  if (parts.length > 1) {
    parts[1] = parts[1].replace(regex, '```plantuml\\n@startuml\\n' + umlData[id] + '\\n@enduml\\n```');
    content = parts.join('### ' + id);
  }
}

fs.writeFileSync(filepath, content, 'utf8');
console.log('OK');