import {
    Request as ExpressRequest,
    Response as ExpressResponse,
    NextFunction as ExpressNextFunction,
} from "express-serve-static-core"

declare global {
    namespace Global {
        interface Request extends ExpressRequest {}
        interface Response extends ExpressResponse {}
        interface NextFunction extends ExpressNextFunction {}
    }
}
