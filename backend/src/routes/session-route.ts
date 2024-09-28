import { deleteSessionController, getSessionsController } from "@controllers/session-controller"
import express from "express"

/**
 * @base /sessions
*/
const router = express.Router()

router.get('/', getSessionsController)
router.delete("/:id", deleteSessionController)

export default router