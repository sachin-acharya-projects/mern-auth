import { DEBUG, RESEND_SENDER_EMAIL } from "@constants/config"
import { resend } from "@apis/resend"

type Params = {
    to: string
    subject: string
    text: string
    html?: string
}
export const sendMail = async ({ subject, text, to, html }: Params) => {
    const from = DEBUG ? "onboarding@resend.dev" : RESEND_SENDER_EMAIL
    return await resend.emails.send({
        from,
        to: DEBUG ? "delivered@resend.dev" : to,
        subject,
        text,
        html,
    })
}
