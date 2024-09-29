import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { CircleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import MessageCard from "@/components/MessageCard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

import { resetPasswordAPI } from "@/utils/apis/auth-api"
import { resetPasswordSchema } from "@/utils/validation/form-validation"
import { FormPassword } from "@/components/FormElement"

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const code = searchParams.get("code")
    const exp = Number(searchParams.get("exp"))
    const now = Date.now()

    const navigate = useNavigate()

    const isLinkValid = code && exp && exp > now
    useEffect(() => {
        if (!code) {
            toast.error("Verification Code is missing. Please recheck the URL.")
            navigate("/password/forgot", { replace: true })
        }
    }, [code, navigate])

    useEffect(() => {
        if (!isLinkValid) {
            toast.error("The Link is either Invalid or has Expired")
            navigate("/password/forgot", {
                replace: true,
            })
        }
    }, [isLinkValid, navigate])
    return <PasswordResetForm code={code!} />
}

type Props = {
    code: string
}
function PasswordResetForm({ code }: Props) {
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
        },
    })
    const {
        mutate: resetPasswordMutation,
        isPending,
        isError,
        isSuccess,
        error,
    } = useMutation({
        mutationFn: resetPasswordAPI,
        onSuccess(data) {
            console.log(data)
            toast.success(
                "Password updated! You can now log in with your new password."
            )
            navigate("/login", { replace: true })
        },
    })
    console.log(error)
    function onSubmit({ password }: z.infer<typeof resetPasswordSchema>) {
        resetPasswordMutation({ password, verification_code: code })
    }

    return (
        <div className="flex-center h-screen">
            <div className="container-child">
                <MessageCard
                    icon={<CircleAlert className="h-8 w-8" />}
                    title="Opps! Something went wrong"
                    message={
                        error?.message ||
                        `Unknown Error Occured. Please Contact the Developer ${
                            error?.name || ""
                        }`
                    }
                    show={isError}
                />
                {!isSuccess && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col bg-slate-900 p-10 rounded-2xl gap-4"
                        >
                            <h1 className="text-2xl font-bold">
                                Change Password
                            </h1>
                            <FormPassword
                                control={form.control}
                                name="password"
                                label="New Password"
                                autoComplete="new-password"
                                className={
                                    form.formState.errors.password
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                            <Button
                                type="submit"
                                className="mt-2"
                                disabled={isPending || isSuccess}
                            >
                                {isPending ? <LoadingSpinner /> : "Submit"}
                            </Button>
                            <Link
                                className="text-[12.5px] hover:underline mt-[-12px] text-gray-300"
                                to="/login"
                            >
                                Remember Password?
                            </Link>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    )
}
