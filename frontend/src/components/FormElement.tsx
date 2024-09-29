import { ReactNode } from "react"
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form"
import { Input, InputProps } from "./ui/input"

type SharedFormProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = InputProps & Pick<ControllerProps<TFieldValues, TName>, "control" | "name">

type Props = {
    label: string
    inputProps?: InputProps
    children?: ReactNode
}
const FormElement = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    label,
    inputProps,
    children,
    ...props
}: Props & Omit<ControllerProps<TFieldValues, TName>, "render">) => {
    return (
        <FormField
            {...props}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="cursor-pointer">{label}</FormLabel>
                    <FormControl>
                        <Input {...inputProps} {...field} />
                    </FormControl>
                    <FormMessage />
                    {children}
                </FormItem>
            )}
        />
    )
}

type ElementProps = {
    label: string
    addForgotPasswordLink?: boolean
}

export const FormPassword = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    control,
    label,
    addForgotPasswordLink = false,
    ...props
}: ElementProps & SharedFormProps<TFieldValues, TName>) => {
    return (
        <FormElement
            inputProps={{
                placeholder: "•••••••••••••",
                type: "password",
                ...props,
            }}
            label={label}
            name={name}
            control={control}
            children={
                addForgotPasswordLink && (
                    <a
                        className="text-[12.5px] hover:underline text-gray-300 mt-2"
                        href="/password/forgot"
                    >
                        Forgot Password?
                    </a>
                )
            }
        />
    )
}

type FormElementProps = Omit<
    ElementProps,
    "addForgotPasswordLink" | "label"
> & {
    label?: string
}

export const FormEmail = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    control,
    label = "Email",
    ...props
}: FormElementProps & SharedFormProps<TFieldValues, TName>) => {
    return (
        <FormElement
            inputProps={{
                autoComplete: "email",
                placeholder: "john.doe@email.com",
                type: "email",
                ...props,
            }}
            label={label}
            name={name}
            control={control}
        />
    )
}

export default FormElement
