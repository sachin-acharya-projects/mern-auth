import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Check, CircleAlert } from "lucide-react"
import React from "react"

type Props = {
    type?: "success" | "danger"
    heading?: string
    message?: string
    open?: boolean
    buttons?: typeof AlertDialogAction[]
    onCancel?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Alert({
    heading,
    type,
    message,
    open = false,
    buttons,
    onCancel,
}: Props) {
    const getColors = (
        state_type: typeof type
    ): {
        border: string
        text: string
        background: string
    } => {
        switch (state_type) {
            case "danger":
                return {
                    border: "border-red-600",
                    text: "text-red-600",
                    background: "bg-red-100",
                }
            case "success":
                return {
                    background: "bg-green-100",
                    border: "border-green-600",
                    text: "text-green-600",
                }
            default:
                return {
                    background: "",
                    border: "",
                    text: "",
                }
        }
    }
    const colors = getColors(type)

    return (
        <AlertDialog open={open}>
            {!heading && <AlertDialogTrigger>Open</AlertDialogTrigger>}

            <AlertDialogContent
                className={`${colors.background} ${colors.border}`}
            >
                <AlertDialogHeader>
                    <div className="flex gap-4 items-center">
                        {type === "danger" ? (
                            <CircleAlert className="text-red-600" />
                        ) : type === "success" ? (
                            <Check className="text-green-600" />
                        ) : null}
                        <AlertDialogTitle className={`${colors.text}`}>
                            {heading}
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className={`${colors.text}`}>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    {buttons?.map((Component, index) => (
                        <Component key={index} />
                    ))}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
