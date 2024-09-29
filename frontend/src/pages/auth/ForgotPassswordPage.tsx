import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, CircleAlert, MailCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormEmail } from "@/components/FormElement"
import MessageCard from "@/components/MessageCard"

import { passwordResetRequestAPI } from "@/utils/apis/auth-api"
import { emailSchema } from "@/utils/validation/form-validation"

const schema = z.object({
    email: emailSchema,
})
export default function ForgotPasswordPage() {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
        },
    })

    const {
        mutate: requestPasswordLinkMutate,
        isPending,
        isError,
        isSuccess,
        error,
    } = useMutation({
        mutationFn: passwordResetRequestAPI,
        onSuccess(data) {
            console.log(data)
        },
    })
    function onSubmit({ email }: z.infer<typeof schema>) {
        requestPasswordLinkMutate(email)
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
                {isSuccess ? (
                    <div className="flex flex-col gap-5">
                        <MessageCard
                            title="Email has been Sent"
                            message="A password reset link has been sent to your email. If you don’t see it, please check your spam folder."
                            icon={<MailCheck className="h-[60px] w-[60px]" />}
                        />

                        <Link
                            to={"/login"}
                            replace
                            className="flex gap-3 items-center p-3 bg-transparent border w-fit rounded-sm hover:bg-slate-800 transition-colors ease-linear duration-200"
                        >
                            <ArrowLeft className="text-gray-400" /> Return to
                            Login Page?
                        </Link>
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col bg-slate-900 p-10 rounded-2xl gap-4"
                        >
                            <h1 className="text-2xl font-bold">
                                Reset your Password
                            </h1>
                            <FormEmail
                                control={form.control}
                                name="email"
                                autoFocus
                                className={
                                    form.formState.errors.email
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
                                to="/register"
                            >
                                Don't have an account?
                            </Link>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    )
}
