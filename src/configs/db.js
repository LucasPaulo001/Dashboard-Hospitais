//Dependências do banco de dados e variáveis de ambiente
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const application = 'Dashboard Hospitals'

//Função de conexão com o banco de dados
const mongooseConnect = (app) => {
    mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log(`Conectado ao mongoose com sucesso! APP: ${application}`)
    })
    .catch((error) => {
        console.log('[debug]: Erro ao se conectar ao mongoose, Erro: ', error)
    })
}

//Exportação do banco de dados
export default mongooseConnect
