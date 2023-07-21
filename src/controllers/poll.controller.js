import { db } from "../database/db.connection.js"
import dayjs from "dayjs"

export async function createPoll(req, res) {
    const { title, expireAt } = req.body

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
}

export async function getPolls(req, res) {
    try {
        const pollsList = await db.collection("polls").find().toArray()

        res.send(pollsList).status(200)

    } catch (err) {
        res.status(500).send(err.message)
    }
}