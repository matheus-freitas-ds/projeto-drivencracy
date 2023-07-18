import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import joi from "joi"
import dayjs from "dayjs"

const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db

mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))


// Lógica do Back

app.post("/poll", async (req, res) => {
    const { title, expireAt } = req.body

    const schemaPoll = joi.object({
        title: joi.string().required()
    })

    const validation = schemaPoll.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        if (expireAt === "") {
            poll = { title, expireAt: dayjs().format('YYYY-MM-DDTHH:mm').add(1, 'month') }
        } else {
            poll = { title, expireAt }
        }

        await db.collection("polls").insertOne(poll)
        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }
})


const PORT = 5000
app.listen(PORT, () => (`servidor rodando na porta ${PORT}`))