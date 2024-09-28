import express from "express"
import {
    emailVerificationController,
    loginController,
    logoutController,
    passwordForgotController,
    passwordResetController,
    refreshTokenController,
    registerController,
} from "@controllers/auth-controller"

/**
 * @base /auth
 */

const router = express.Router()

router.post("/register", registerController)
router.post("/login", loginController)
router.get("/logout", logoutController)
router.get("/refresh", refreshTokenController)
router.get("/email/verify/:code", emailVerificationController)
router.post("/password/forgot", passwordForgotController)
router.post("/password/reset", passwordResetController)

export default router
