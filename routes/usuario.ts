import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import  bcrypt  from 'bcrypt';
import Token from '../classes/token';
import { verificarToken } from '../middlewares/autenticacion';



 const userRoutes = Router();

/* userRoutes.get('/prueba', (req: Request, res: Response) => {
    
    res.json({
        ok: true,
        mensaje: 'Funciona todo bien :V'
    })
}); */

// Inicio de Sesion Login
userRoutes.post('/login', (req: Request, res: Response) => {
    
    const body = req.body;

    Usuario.findOne({email: body.email}, (err, userDB) => {
        if (err) throw err;

        if (!userDB) {
            return res.json({
                ok:false,
                mensaje: 'Usuario/Contraseña no son validos'
            });
        }
        
        if (userDB.compararPassword(body.password)){

            const tokenUser = Token.getJWToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar

            });

            res.json({
                ok: true,
                token: tokenUser
            });

        } else {
            return res.json({
                ok:false,
                mensaje: 'Usuario/Contraseña no son validos ***'
            });
        }


    });
   
}); 


// Crear un Usuario
userRoutes.post('/create', (req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password, 10), 
        avatar: req.body.avatar
    };
    
    Usuario.create(user).then( userDB  => {

        const tokenUser = Token.getJWToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar        

        });

        res.json({
            ok: true,
            token: tokenUser
        });

        /*res.json({
            ok: true,
            // mensaje: 'Funciona todo bien'
            user: userDB
        });*/
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
    
    
   
});

// Actualizar Usuario

    userRoutes.post('/update',  verificarToken,  (req: any, res: Response) => {
    
        const user = {
            nombre: req.body.nombre || req.usuario.nombre,
            email: req.body.email || req.usuario.email,
            avatar: req.body.avatar || req.usuario.avatar                 
        }
        
        Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true}, (err, userDB) =>{
            if (err) throw err;

            if (!userDB){
                return res.json({
                    ok: false,
                    mensaje: 'No existe un usuario con ese ID'
                });

            }
            const tokenUser = Token.getJWToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar                   
            });
    
            res.json({
                ok: true,
                token: tokenUser
            });
        });
        
    });


// obtener info del usuario por token
userRoutes.get('/', [verificarToken], (req:any, res: Response) =>{


    const usuario = req.usuario;
    
    res.json({
        ok: true,
        usuario
    });
});

export default userRoutes;
