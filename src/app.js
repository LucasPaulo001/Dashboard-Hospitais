//Importação de módulos
import express, { urlencoded } from 'express'
import {create} from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()

//Importação de módulos internos/configurações
import mongooseConnect from './configs/db.js'

//Importação de rotas
import home from './routes/Home.js'

//Configurações
    //Config. do express
        const app = express()

    //Config. parser de json
        app.use(express.json())
        app.use(urlencoded({extended: true}))

    //Config. do hbs
        // Configuração do ES Modules para __dirname
            const __filename = fileURLToPath(import.meta.url)
            const __dirname = path.dirname(__filename)

        //Definição de extenção
            const hbs = create({
                extname: 'hbs',
                defaultLayout: 'main',
                layoutsDir: path.join(__dirname, 'views', 'layout'),
                helpers: {
                    json: function (context) {
                        return JSON.stringify(context);
                    }
                },
                helpers: {
                    eq: function (a, b) {
                        return a === b;
                    }
                },
                runtimeOptions: {
                    allowProtoPropertiesByDefault: true, 
                    allowProtoMethodsByDefault: true, 
                  }
            })

        //Config de engine   
            app.engine('hbs', hbs.engine)
            app.set('view engine', 'hbs')
            app.set('views', path.join(__dirname, 'views'))

        //Config. de arquivos estáticos
            app.use(express.static(path.join(__dirname, '../public')))

    //Config. do banco de dados
        mongooseConnect(app)

    //Helper de condição
        app.use((req, res, next) => {
        
            // Verifica se o caminho está na lista de rotas ou se corresponde ao padrão da rota dinâmica
            if (/^\/hospital\/[^/]+$/.test(req.path)){
                res.locals.showHeader = false;
            } else {
                res.locals.showHeader = true;
            }
        
        next();
        })

    //Configuração de rotas
        //Rota da página inical
            app.use('/', home)

//Conectando ao servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Conectado ao servidor na porta: ', PORT)
})