import { Router } from "express"
import { createPoll, getPolls } from "../controllers/poll.controller.js"
import { schemaValidation } from "../middlewares/schema.validation.js"
import { schemaPoll } from "../schemas/poll.schemas.js"

const pollRouter = Router()

pollRouter.post("/poll", schemaValidation(schemaPoll), createPoll)
pollRouter.get("/poll", getPolls)

export default pollRouter