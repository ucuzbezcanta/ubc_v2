import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        const data = await resend.emails.send({
            from: 'Ucuz Bez Canta <onboarding@resend.dev>',
            to: ['ucuzbezcanta@gmail.com'],
            subject: 'Yeni İletişim Formu Mesajı',
            html: `
                <h1>Yeni İletişim Formu Mesajı</h1>
                <p><strong>Ad:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mesaj:</strong> ${message}</p>
            `,
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({error});
    }
}