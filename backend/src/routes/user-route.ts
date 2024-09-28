import { getUserController } from "@controllers/user-controller"
import express from "express"

/**
 * @base /user
*/
const router = express.Router()

router.get('/', getUserController)

export default router