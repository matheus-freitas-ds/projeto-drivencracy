import { db } from "../database/db.connection.js"
import { ObjectId } from "mongodb"
import dayjs from "dayjs"

export async function createChoice(req, res) {
    const { title, pollId } = req.body

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
}

export async function getChoices(req, res) {
    const { id } = req.params

    try {
        const choicesList = await db.collection("choices").find({ pollId: id }).toArray()

        if (choicesList.length === 0) return res.sendStatus(404)

        res.send(choicesList).status(200)

    } catch (err) {
        res.status(500).send(err.message)
    }
}