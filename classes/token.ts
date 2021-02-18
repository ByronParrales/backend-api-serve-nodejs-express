import jwt, { decode } from 'jsonwebtoken';
import { Usuario } from '../models/usuario.model';


export default class Token {

    private static seed: string = 'este-es-el-seed-de-mi-app-secreto';
    private static caducidad: string = '30d';

    constructor() {

    }

    static getJWToken(payload: any): string {

        return jwt.sign({
            usuario: payload

        }, this.seed, { expiresIn: this.caducidad });
    }

    static comprobarToken(userToken: string) {

        return new Promise((resolve, reject) => {

            jwt.verify(userToken, this.seed, (err, decode) => {

                if (err) {
                    // no confiar
                    reject();
                } else {
                    // token valido
                    resolve(decode);
                }
            });
        });



    }

    static descifrarToken(Token: string) {

        return jwt.verify(Token, this.seed, function (err, decoded: any) {
            console.log(decoded) // bar
            return decoded.usuario;
        });
}}