const fs = require('fs');
const filepath = './documentacion/api_casos_uso.md';
let content = fs.readFileSync(filepath, 'utf8');

const umlData = {
  'CU-01': \left to right direction
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
}
actor "Usuario No Registrado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Registrar Usuario" as UC
}
U --> UC\,
  'CU-02': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Registrado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Iniciar Sesión" as UC
}
U --> UC\,
  'CU-03': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Autenticado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Registrar Movimiento" as UC
}
U --> UC\,
  'CU-04': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Autenticado" as U
actor "Microservicio IA (Python)" as ML <<Sistema>>
rectangle "Sistema FinanceFlow" {
  usecase "Escanear Recibo" as UC
}
U --> UC
UC .> ML : <<include>>\,
  'CU-05': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Autenticado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Visualizar Dashboard" as UC
}
U --> UC\,
  'CU-06': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Autenticado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Modificar Movimiento" as UC
}
U --> UC\,
  'CU-07': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Autenticado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Inhabilitar Movimiento" as UC
}
U --> UC\,
  'CU-08': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Autenticado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Filtrar y Analizar Reportes" as UC
}
U --> UC\,
  'CU-09': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #FBE9E7
  BorderColor #D84315
  ArrowColor #D84315
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Sistema Frontend" as Front <<Sistema>>
actor "Motor Python Backend" as ML <<Microservicio>>
rectangle "Sistema FinanceFlow" {
  usecase "Reentrenar Clasificador IA" as UC
}
Front --> UC
UC --> ML\,
  'CU-10': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Autenticado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Cerrar Sesión" as UC
}
U --> UC\,
  'CU-11': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario No Autenticado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Recuperar Contraseña" as UC
}
U --> UC\,
  'CU-12': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Usuario Autenticado" as U
rectangle "Sistema FinanceFlow" {
  usecase "Consultar/Editar Perfil" as UC
}
U --> UC\,
  'CU-13': \left to right direction
skinparam actorStyle awesome
skinparam usecase {
  BackgroundColor #E3F2FD
  BorderColor #1565C0
  ArrowColor #1565C0
}
skinparam rectangle {
  BackgroundColor #FAFAFA
  BorderColor #9E9E9E
}
actor "Administrador" as Admin
rectangle "Sistema FinanceFlow" {
  usecase "Visualizar Auditoría (Logs)" as UC
}
Admin --> UC\
};

for (let i = 1; i <= 13; i++) {
  const id = 'CU-' + String(i).padStart(2, '0');
  const regex = /\\\plantuml[\s\S]*?@enduml\s*\\\/m;
  const parts = content.split('### ' + id);
  if (parts.length > 1) {
    parts[1] = parts[1].replace(regex, '\\\plantuml\\n@startuml\\n' + umlData[id] + '\\n@enduml\\n\\\');
    content = parts.join('### ' + id);
  }
}

fs.writeFileSync(filepath, content, 'utf8');
console.log('Diagramas actualizados y mejorados!');
