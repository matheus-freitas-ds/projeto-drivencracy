import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { MongoClient, ObjectId } from "mongodb"
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

    const schemaChoice = joi.object({
        title: joi.string().required(),
        expireAt: joi.string().allow("")
    })

    const validation = schemaChoice.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors)
    }

    try {
        if (expireAt != "") {
            await db.collection("polls").insertOne({ title, expireAt })
        } else {
            await db.collection("polls").insertOne({ title, expireAt: dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm') })
        }

        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get("/poll", async (req, res) => {
    try {
        const pollsList = await db.collection("polls").find().toArray()

        res.send(pollsList).status(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/choice", async (req, res) => {
    const { title, pollId } = req.body

    const schemaChoice = joi.object({
        title: joi.string().required(),
        pollId: joi.string().required()
    })

    const validation = schemaChoice.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors)
    }

    try {
        const pollSearch = await db.collection("polls").findOne({ _id: new ObjectId(pollId) })
        const titleSearch = await db.collection("choices").findOne({ title: title })

        if (!pollSearch) return res.sendStatus(404)

        if (titleSearch) return res.sendStatus(409)

        if (dayjs(pollSearch.expireAt).isBefore(dayjs())) return res.sendStatus(403)

        await db.collection("choices").insertOne({ title, pollId })
        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }
})


const PORT = 5000
app.listen(PORT, () => (`servidor rodando na porta ${PORT}`))