import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { ClassProp } from "class-variance-authority/types"
import { ReactNode } from "react"

type Props = {
    icon?: ReactNode | JSX.Element
    title: string
    message: string
    show?: boolean
} & ClassProp
export default function MessageCard({
    message,
    title,
    icon,
    className,
    show = true,
}: Props) {
    return (
        <Alert className={`${className} ${!show ? "hidden" : ""} p-0`}>
            <div className="flex items-center gap-4 p-4">
                {icon}
                <div>
                    <AlertTitle className="font-bold text-md">
                        {title}
                    </AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </div>
            </div>
        </Alert>
    )
}
