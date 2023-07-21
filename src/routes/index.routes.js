import { Router } from "express"
import pollRouter from "./poll.routes.js"
import choiceRouter from "./choice.routes.js"
import voteRouter from "./vote.routes.js"

const router = Router()

router.use(pollRouter)
router.use(choiceRouter)
router.use(voteRouter)

export default router