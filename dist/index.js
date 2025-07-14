"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require('express') //CJS Common JS
const express_1 = __importDefault(require("express")); // ESM ecmascript modules
// instancia del servidor
const app = (0, express_1.default)();
// Routing
app.get('/', (req, res) => {
    res.send('Hola Mundo en Express - Typescript');
}); //request ( envía información, url que se está visitando - response (la información que regresa)
app.get('/ecommerce', (req, res) => {
    res.send('Este es el Ecommerce');
}); //request ( envía información, url que se está visitando - response (la información que regresa)
app.get('/ecommerce2', (req, res) => {
    res.send('Este es el Ecommerce');
}); //request ( envía información, url que se está visitando - response (la información que regresa)
const port = process.env.PORT || 4000;
//Crear servidor
app.listen(port, () => {
    console.log('Servidor funcionando en el puerto ', port);
});
//# sourceMappingURL=index.js.map