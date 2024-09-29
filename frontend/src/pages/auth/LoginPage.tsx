import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { CircleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormEmail, FormPassword } from "@/components/FormElement"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import MessageCard from "@/components/MessageCard"

import { loginAPI } from "@/utils/apis/auth-api"
import { signinSchema } from "@/utils/validation/form-validation"
import { toast } from "sonner"

export default function LoginPage() {
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const { mutate: loginMutate, isPending, isError, error } = useMutation({
        mutationFn: loginAPI,
        onSuccess(data) {
            console.log(data)
            toast.success(
                "You’re successfully logged in! Let's continue where you left off."
            )
            navigate("/", { replace: true })
        },
    })

    function onSubmit({ email, password }: z.infer<typeof signinSchema>) {
        loginMutate({ email, password })
    }

    return (
        <div className="flex-center h-screen">
            <div className="container-child">
                <MessageCard
                    icon={<CircleAlert className="h-8 w-8" />}
                    title="Opps! Something went wrong"
                    message={
                        error?.message ||
                        `Unknown Error Occured. Please Contact the Maintainer ${
                            error?.name || ""
                        }`
                    }
                    show={isError}
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col bg-slate-900 p-10 rounded-2xl gap-4"
                    >
                        <h1 className="text-2xl font-bold">
                            Login to Your Account
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

                        <FormPassword
                            control={form.control}
                            name="password"
                            label="Password"
                            autoComplete="current-password"
                            className={
                                form.formState.errors.password
                                    ? "border-red-500"
                                    : ""
                            }
                            addForgotPasswordLink
                        />

                        <Button
                            type="submit"
                            className="mt-2"
                            disabled={isPending}
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
            </div>
        </div>
    )
}
