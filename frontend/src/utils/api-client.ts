import axios from "axios"
// import { queryClient } from "./query-client"
// import { UNAUTHORIZED } from "@/constants/Http"

const options = {
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
}

const tokenRefreshClient = axios.create(options)
tokenRefreshClient.interceptors.response.use((response) => response.data)

export const request = axios.create(options)
request.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const {
            // config,
            response: { status, data },
        } = error

        // if (
        //     status === UNAUTHORIZED &&
        //     data?.errorCode === "INVALID_ACCESS_TOKEN"
        // ) {
        //     try {
        //         await tokenRefreshClient.get("/auth/refresh")
        //         await tokenRefreshClient(config)
        //     } catch {
        //         queryClient.clear()
        //     }
        // }

        return Promise.reject({ status, ...data })
    }
)
