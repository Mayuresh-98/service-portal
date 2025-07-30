# ServicePortal

A role-based service request and technician assignment portal built with **Angular 18**, designed for environments like PLM/SLM. It features full frontend functionality including authentication, role-specific dashboards, and integration with a mock backend.

## 🚀 Features
- 🔐 Role-based login for Admin, Technician, and Customer
- 📝 Customer request submission with urgency, product, and description
- 🧑‍🔧 Admin dashboard to view and assign requests to technicians
- 🛠️ Technician dashboard to view and update assigned tasks
- ✅ Route guards, reactive forms, and stateful services
- 📦 REST API integration using [JSON Server](https://github.com/typicode/json-server)
- 🧪 100% unit test coverage using Karma + Jasmine
- 🎨 Responsive UI with Tailwind CSS and Bootstrap

## 🛠 Development Server
Run the following commands in separate terminals:

1. Start the Angular app:
```bash
ng serve
```
Visit `http://localhost:4200/`

2. Start the backend server:
```bash
json-server --watch db.json --port 3000
```
Visit `http://localhost:3000/`

## 🧪 Running Unit Tests
```bash
ng test
```
- Runs unit tests via [Karma](https://karma-runner.github.io)
- Achieves 100% code coverage using Jasmine

## 🧱 Build
```bash
ng build
```
- Builds the project to the `dist/` directory

## ⚙️ Code Generation
Use Angular CLI to generate features:
```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

## 📚 Resources
- [Angular CLI Docs](https://angular.dev/tools/cli)
- [Tailwind CSS](https://tailwindcss.com)
- [JSON Server](https://github.com/typicode/json-server)

---
📌 Developed as part of a hands-on Angular training project with focus on component-based design, testing, and real-world application scenarios.
