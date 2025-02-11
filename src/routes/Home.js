import { Router } from "express"
const home = Router()

home.get('/', (req, res) => {
    res.render('pages/home')
})


export default home