import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Check, CircleAlert } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import MessageCard from "@/components/MessageCard"

import { emailVerifyAPI } from "@/utils/apis/auth-api"

export default function EmailVerificationPage() {
    const { code } = useParams()

    const { isPending, isSuccess, isError } = useQuery({
        queryKey: ["email-verification", code],
        queryFn: () => emailVerifyAPI(code!), // might throw error
    })
    return (
        <div className="h-screen flex-center">
            <div className="w-[400px]">
                {isPending ? (
                    <MessageCard
                        title="Pending Request"
                        message="Your request is being processed by the application."
                        icon={<LoadingSpinner className="w-[30px] h-[30px]" />}
                    />
                ) : (
                    <div className="flex flex-col gap-2">
                        <MessageCard
                            title={`${
                                isSuccess ? "Email Verified" : "Invalid Code"
                            }`}
                            message={`${
                                isSuccess
                                    ? "Your email has been verified successfully."
                                    : "Verification Code seems to be invalid."
                            }`}
                            icon={
                                isSuccess ? (
                                    <Check className="w-[30px] h-[30px]" />
                                ) : (
                                    <CircleAlert className="w-[30px] h-[30px]" />
                                )
                            }
                        />
                        {isError && (
                            <>
                                <MessageCard
                                    title={"Expired Link"}
                                    message={`The Link is either invalid or expired.`}
                                    icon={
                                        <CircleAlert className="w-[30px] h-[30px]" />
                                    }
                                />
                                <Link
                                    className="text-sky-500 hover:underline w-fit"
                                    to={"/password/forgot"}
                                    replace
                                >
                                    Want a new link?
                                </Link>
                            </>
                        )}
                        <Link
                            to={"/"}
                            replace
                            className="flex gap-3 items-center p-3 bg-transparent border w-fit rounded-sm hover:bg-slate-800 transition-colors ease-linear duration-200"
                        >
                            <ArrowLeft className="text-gray-400" /> Return Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
