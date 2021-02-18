import {Schema, Document, model} from 'mongoose';

const postSchema = new Schema ({

    created: {
        type: Date
    },
    descripcion: {
        type: String
    },
    img: [{
        type: String
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a un usuario']
    }
});

interface IPost extends Document {
    created: Date;
    descripcion: string;
    img: string;
    usuario: string;
}

postSchema.pre<IPost>('save', function(next){
    this.created = new Date();
    next();
});

export const Post = model<IPost>('Post', postSchema);