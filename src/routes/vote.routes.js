import { Router } from "express"
import { createVote, getVotes } from "../controllers/vote.controller.js"

const voteRouter = Router()

voteRouter.post("/choice/:id/vote", createVote)
voteRouter.get("/poll/:id/result", getVotes)

export default voteRouter