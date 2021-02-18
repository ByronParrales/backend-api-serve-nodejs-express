import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/postData';
import fileUpload from 'express-fileupload';

import cors from 'cors';

const server = new Server();

// Midleware Body parse
server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use( bodyParser.json());


// FileUpload
server.app.use( fileUpload({useTempFiles:true}));

// cors 

server.app.use(cors({origin: true, credentials:true}));

//Rutas de mi App
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes)
// Conectar DB
mongoose.connect('mongodb://localhost:27017/tesisInt', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err)  => {
    if (err) throw err;
    console.log('Base de Datos ONLINE');

} );

/// Levantar Express

server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});