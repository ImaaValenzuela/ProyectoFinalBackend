import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import handlebars from "express-handlebars"

//utils
import __dirname from './utils.js';
import run from './run.js';

const app = express();

// config engine templates
//handlebars 
/*
    llamamos a .engine('template', template.engine());
    esto define el motor/engine de plantillas/templates 
    para que utilice la que nosotros querramos en este caso handlebars
    que es bastante simple y sensillo
 */
app.engine('handlebars', handlebars.engine());
// seteamos la carpeta donde va a capturar los recursos el motor
app.set('views', __dirname + '/views');
// terminamos de definir la vista
app.set('view engine', 'handlebars');

// especificamos la carpeta public para la pagina
app.use(express.static(__dirname + '/public'));

// transforma la informacion recibida en json por 
// medio de un middleware
app.use(express.json());
// permite recibir indormacion desde la url por medio del body como json
app.use(express.urlencoded({ extended: true }));

// mongoose
// uri para la app del servidor mongo atlas
const uri = 'mongodb+srv://IMANOLO:coder@cluster0.jfozy2v.mongodb.net/';

/**
 * query / consulta
 * una strictquery es una consulta estricta que mediante unos 
 * filtros no deja pasar la informacion o no permite recibirla toda
 */
mongoose.set('strictQuery', false);

/**
 * primer parametro la uri del servidor,
 * el segundo parametro es el nombre de la base de datos a conectar,
 * por ultimo un middleware para capturar errores, si aparece un error podemos
 * atajarlo y sino podemos hacer correr el server sin problema,
 * esto sirve para evitar mensajes de errores en consolay afectar al server
 */
const env = () => {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('DB connected');
        const httpServer = app.listen(8080, () => console.log('listening'));
        httpServer.on('error', () => console.log('Error'));
        const io = new Server(httpServer);
        run(io, app);
    }).catch(error => {
        console.log('No se pudo conectar a la DB:', error);
    });
}

env();