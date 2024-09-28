type AsyncController = (
    request: Global.Request,
    response: Global.Response,
    next: Global.NextFunction
) => Promise<any>

const catchErrors = (controller: AsyncController): AsyncController => async (
    req,
    res,
    next
) => {
    try {
        await controller(req, res, next)
    } catch (error) {
        next(error)
    }
}

export default catchErrors
