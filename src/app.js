//Importação de módulos
import express, { urlencoded } from 'express'
import {create} from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()

//Importação de módulos internos/configurações
import mongooseConnect from './configs/db.js'

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
                layoutsDir: path.join(__dirname, 'views', 'layout')
            })

        //Config de engine   
            app.engine('hbs', hbs.engine)
            app.set('view engine', 'hbs')
            app.set('views', path.join(__dirname, 'views'))

    //Config. do banco de dados
        mongooseConnect(app)

    //Configuração de rotas
        app.get('/', (req, res) => {
            res.render('pages/home')
        })

//Conectando ao servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Conectado ao servidor na porta: ', PORT)
})