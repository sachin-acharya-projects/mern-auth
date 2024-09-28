import { RESEND_API_KEY } from "@constants/config";
import { Resend } from "resend";

export const resend = new Resend(RESEND_API_KEY)
