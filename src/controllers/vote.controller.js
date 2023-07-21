import { db } from "../database/db.connection.js"
import { ObjectId } from "mongodb"
import dayjs from "dayjs"

export async function createVote(req, res) {
    const { id } = req.params

    try {
        const vote = { createdAt: dayjs().format('YYYY-MM-DD HH:mm'), choiceId: id }
        const choice = await db.collection("choices").findOne({ _id: new ObjectId(id) })
        const poll = await db.collection("polls").findOne({ _id: new ObjectId(choice.pollId) })

        if (!choice) return res.sendStatus(404)

        if (dayjs(poll.expireAt).isBefore(dayjs())) return res.sendStatus(403)

        await db.collection("votes").insertOne(vote)
        res.sendStatus(201)

    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getVotes(req, res) {
    const { id } = req.params

    try {
        const poll = await db.collection("polls").findOne({ _id: new ObjectId(id) })
        const choices = await db.collection("choices").find({ pollId: id }).toArray()
        const choicesId = choices.map(choice => {
            return new ObjectId(choice._id).toString()
        })
        const votes = await db.collection("votes").find({ choiceId: { $in: choicesId } }).toArray()
        
        const voteCounter = {}
        votes.forEach(vote => {
            const { choiceId } = vote
            voteCounter[choiceId] = (voteCounter[choiceId] || 0) + 1
            return voteCounter
        })
       
        let maxCount = 0
        let maxChoiceId = null
        for (const choiceId in voteCounter) {
          const count = voteCounter[choiceId]
          if (count > maxCount) {
            maxCount = count
            maxChoiceId = choiceId
          }}
        const mostVotes = { choiceId: maxChoiceId, count: maxCount }

        const choiceTitle = await db.collection("choices").findOne({ _id: new ObjectId(mostVotes.choiceId)})

        const result = {
            _id: id,
            title: poll.title,
            expireAt: poll.expireAt,
            result: {
                title: choiceTitle.title,
                votes: mostVotes.count
            }
        }

        if (!poll) return res.sendStatus(404)

        res.send(result).status(200)

    } catch (err) {
        res.status(500).send(err.message)
    }
}