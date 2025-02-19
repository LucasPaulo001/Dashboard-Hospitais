import { Router } from "express"
const home = Router()
import Hospital from "../models/Hospital.js"
import fs from 'fs'
import csvParser from "csv-parser"
import path from "path"
import { fileURLToPath } from 'url'

home.get("/", (req, res) => {
    const { MUNICIPIO } = req.query;

    let filtro = MUNICIPIO ? { MUNICIPIO: MUNICIPIO.toUpperCase() } : {};

    // Agregar os hospitais por cidade, somando os leitos e mantendo os nomes
    Hospital.aggregate([
        { $match: filtro },  // Filtra os hospitais pela cidade, se necessário
        { $group: {
            _id: "$MUNICIPIO",  // Agrupa por cidade
            totalUTI: { $sum: "$UTI_TOTAL_EXIST" },
            totalLeitosSUS: { $sum: "$LEITOS_SUS" },  // Soma os leitos SUS de cada cidade
            totalLeitosExistentes: { $sum: "$LEITOS_EXISTENTES" },  // Soma os leitos existentes de cada cidade
            countHospitais: { $sum: 1 },  // Conta o número de hospitais em cada cidade
            nomesHospitais: { $push: "$NOME_HOSPITAL" }  // Mantém os nomes dos hospitais em uma lista
        }}
    ])
    .then((hospitaisContados) => {
        // Extrai os dados para o gráfico
        const cidades = hospitaisContados.map(hospital => hospital._id);
        const leitosSUS = hospitaisContados.map(hospital => hospital.totalLeitosSUS);
        const leitosUTI = hospitaisContados.map(hospital => hospital.totalUTI);
        const leitosExistentes = hospitaisContados.map(hospital => hospital.totalLeitosExistentes);
        const nomesHospitais = hospitaisContados.map(hospital => hospital.nomesHospitais);

        res.render("pages/home", {
            hospitaisContados: hospitaisContados,  // Passa a lista de hospitais contados
            leitosUTI: leitosUTI,
            cidades: cidades,  // Passa as cidades
            leitosSUS: leitosSUS,  // Passa os dados de leitos SUS
            leitosExistentes: leitosExistentes,  // Passa os dados de leitos existentes
            nomesHospitais: nomesHospitais,  // Passa os nomes dos hospitais
            hospitaisJSON: JSON.stringify(hospitaisContados)  // Passa os dados de hospitais contados em formato JSON
        });
    })
    .catch((error) => {
        console.error("Erro ao buscar hospitais:", error);
        res.status(500).send("Erro ao buscar dados.");
    });
});

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

home.get('/importcsv', (req, res) => {
    const fileCSV = path.join(__dirname, '../data/leitosPBS.csv')

    fs.createReadStream(fileCSV)
    .pipe(csvParser())
    .on('data', (data) => {
        const novoHospital = new Hospital(data)
        novoHospital.save()
        .then(() => {
            console.log("Dados salvos com sucesso!")
        })
        .catch((error) => {
            console.log("Erro ao salvar dados: ", error)
        })
    })
    .on('end', () => {
        console.log("Arquivo csv processado com sucesso!")
        res.send('Dados importados com sucesso!')
    })
    .on('error', (err) => {
        console.log('Erro ao ler o CSV:', err);
        res.status(500).send('Erro ao processar o arquivo CSV');
    })
    //res.send('<h1>Importação desativada temporariamente!</h1>')
})

export default home;
