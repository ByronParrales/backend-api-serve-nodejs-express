"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../models/post.model");
const token_1 = __importDefault(require("../classes/token"));
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Obtener Informacion All User
postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        posts
    });
}));
// Obtener Informaciòn Usuario por Nombre
postRoutes.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    let token = req.headers['x-token'];
    console.log(token);
    let usuario = token_1.default.descifrarToken(token);
    const posts = yield post_model_1.Post.find({ 'usuario': usuario })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate('usuario', '-password')
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
// Crear Informacion
postRoutes.post('/', [autenticacion_1.verificarToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesTempaPost(req.usuario.nombre);
    body.img = imagenes;
    post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
});
// Servicio de Archivos
postRoutes.post('/upload', [autenticacion_1.verificarToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se cargo la imagen'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se cargo la imagen - image'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Lo que no se subio fue una imagen'
        });
    }
    yield fileSystem.guardarImgTemporal(file, req.usuario.nombre);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
postRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;
