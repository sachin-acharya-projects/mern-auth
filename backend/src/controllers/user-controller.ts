import { Http } from "@constants/index"
import { UserModel } from "@models/user-model"
import { appAssert } from "@utils/app-assert"
import catchErrors from "@utils/catch-async-error"

export const getUserController = catchErrors(async function (
    request,
    response
) {
    const userid = request.userid

    const user = await UserModel.findById(userid)
    appAssert(user, Http.NOT_FOUND, "User not found.")
    return response.status(Http.OK).json({ user: user.toSafeJSON() })
})
