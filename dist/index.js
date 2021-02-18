"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const postData_1 = __importDefault(require("./routes/postData"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
// Midleware Body parse
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// cors 
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Rutas de mi App
server.app.use('/user', usuario_1.default);
server.app.use('/posts', postData_1.default);
// Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/tesisInt', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
    if (err)
        throw err;
    console.log('Base de Datos ONLINE');
});
/// Levantar Express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
