import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { CircleAlert } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

import { FormEmail, FormPassword } from "@/components/FormElement"
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

import { registerAPI } from "@/utils/apis/auth-api"
import { registerSchema } from "@/utils/validation/form-validation"
import { toast } from "sonner"

export default function RegisterPage() {
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm_password: "",
        },
    })

    const { mutate: registerMutate, isPending, isError, error } = useMutation({
        mutationFn: registerAPI,
        onSuccess(data) {
            console.log(data)
            toast.success(
                "Registration successful! Please check your email to verify your account."
            )
            navigate("/", { replace: true })
        },
    })

    function onSubmit(values: z.infer<typeof registerSchema>) {
        registerMutate(values)
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
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col bg-slate-900 p-10 rounded-2xl gap-4"
                    >
                        <h1 className="text-2xl font-bold">
                            Create an Account
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
                            autoComplete="new-password"
                            className={
                                form.formState.errors.password
                                    ? "border-red-500"
                                    : ""
                            }
                            addForgotPasswordLink
                        />
                        <FormPassword
                            control={form.control}
                            name="confirm_password"
                            label="Confirm Password"
                            autoComplete="new-password"
                            className={
                                form.formState.errors.confirm_password
                                    ? "border-red-500"
                                    : ""
                            }
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
                            to="/login"
                        >
                            Already have an account?
                        </Link>
                    </form>
                </Form>
            </div>
        </div>
    )
}
