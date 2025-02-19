import { Router } from "express"
const home = Router()
import Hospital from "../models/Hospital.js"

home.get("/", (req, res) => {
    const { id } = req.params
    Hospital.find(id)
    .then((dataHospital) => {
        res.render('pages/apresentation', {
            dataHospital: dataHospital,
        })
    })
    .catch((error) => {
        console.log(error)
    })

})

home.get("/hospital/:id", (req, res) => {
    const { id } = req.params
    Hospital.findById(id)
    .then((data) => {
        res.render('pages/data', {
            data: data,
            leitosExistentes: data.LEITOS_EXISTENTES, 
            leitosSUS: data.LEITOS_SUS, 
            leitosUTI: data.UTI_TOTAL_EXIST 
        })
    })
    .catch((error) => {
        console.log(error)
    })
})

export default home;
