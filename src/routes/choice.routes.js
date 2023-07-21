import { Router } from "express"
import { createChoice, getChoices } from "../controllers/choice.controller.js"
import { schemaValidation } from "../middlewares/schema.validation.js"
import { schemaChoice } from "../schemas/choice.schemas.js"

const choiceRouter = Router()

choiceRouter.post("/choice", schemaValidation(schemaChoice), createChoice)
choiceRouter.get("/poll/:id/choice", getChoices)

export default choiceRouter