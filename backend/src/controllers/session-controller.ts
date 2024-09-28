import { Http } from "@constants/index"
import { SessionModel } from "@models/session-model"
import { UserModel } from "@models/user-model"
import { appAssert } from "@utils/app-assert"
import catchErrors from "@utils/catch-async-error"
import { z } from "zod"

export const getSessionsController = catchErrors(async function (
    request,
    response
) {
    const userid = request.userid
    const sessionid = request.sessionid

    const sessions = await SessionModel.find(
        {
            userid,
            expiresAt: {
                $gt: Date.now(),
            },
        },
        {
            _id: 1,
            userAgent: 1,
            createdAt: 1,
        },
        {
            sort: { createdAt: -1 },
        }
    )

    return response.status(Http.OK).json({
        sessions: sessions.map((session) => ({
            ...session.toObject(),
            ...(session.id === sessionid && {
                isCurrent: true,
            }),
        })),
    })
})

export const deleteSessionController = catchErrors(async function (
    request,
    response
) {
    const sessionid = z
        .string({
            message: ":id param is missing from the request",
        })
        .parse(request.params.id)
    const userid = request.userid

    const deleted = await SessionModel.findOneAndDelete({
        _id: sessionid,
        userid,
    })
    appAssert(
        deleted,
        Http.NOT_FOUND,
        "Session not found. Please check parameter and try again."
    )

    return response.status(Http.OK).json({
        message: "Session removed successfully.",
    })
})
