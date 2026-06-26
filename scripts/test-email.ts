import { Resend } from 'resend';

// Kita menggunakan API Key yang sudah ada di file .env
// Jika Anda belum menambahkannya, ganti process.env.RESEND_API_KEY dengan 're_xxxxxxxxx'
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'damimaturbongs@gmail.com',
      subject: 'Hello World',
      html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
    });

    console.log("Email berhasil dikirim!");
    console.log(data);
  } catch (error) {
    console.error("Gagal mengirim email:", error);
  }
}

sendTestEmail();
