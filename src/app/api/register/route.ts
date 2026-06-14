import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

function htmlEmail(teamName: string, players: string[], email: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gurkerl Cup 2026 – Anmeldebestätigung</title>
</head>
<body style="margin:0;padding:0;background:#0D2818;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D2818;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1B4332;border-radius:20px;overflow:hidden;border:1px solid #2D6A4F;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1B4332,#0D2818);padding:40px 40px 30px;text-align:center;border-bottom:1px solid #2D6A4F;">
              <p style="font-size:48px;margin:0 0 16px;">🥒</p>
              <h1 style="color:#D4AF37;font-size:28px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">
                Gurkerl Cup 2026
              </h1>
              <p style="color:#52B788;font-size:14px;margin:0;letter-spacing:2px;text-transform:uppercase;">
                Fun Games Pöttsching
              </p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;">
                Anmeldung bestätigt! 🎉
              </h2>
              <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;margin:0 0 28px;">
                Euer Team <strong style="color:#D4AF37;">${teamName}</strong> ist erfolgreich für den
                Gurkerl Cup 2026 angemeldet. Wir freuen uns auf euch!
              </p>

              <!-- Team box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D2818;border-radius:12px;border:1px solid #2D6A4F;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #2D6A4F;">
                    <p style="color:#52B788;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0;">Euer Team</p>
                  </td>
                </tr>
                ${players.map((p, i) => `
                <tr>
                  <td style="padding:12px 20px;border-bottom:${i < players.length - 1 ? '1px solid rgba(45,106,79,0.3)' : 'none'};">
                    <p style="color:#ffffff;font-size:15px;margin:0;">
                      <span style="color:#D4AF37;margin-right:12px;">${i + 1}</span>
                      ${p}
                    </p>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- Event info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D2818;border-radius:12px;border:1px solid #2D6A4F;margin-bottom:32px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #2D6A4F;">
                    <p style="color:#52B788;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0;">Event Details</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 6px;">📅 Samstag, 18. Juli 2026</p>
                    <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 6px;">⏰ Ab 14:30 Uhr (Ankunft & Empfang)</p>
                    <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">📍 Fußballplatz Outdoor, Pöttsching</p>
                  </td>
                </tr>
              </table>

              <p style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0;">
                Bei Fragen könnt ihr auf diese E-Mail antworten.<br>
                Bis bald auf dem Fußballplatz! 🏆
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#0D2818;padding:20px 40px;border-top:1px solid #2D6A4F;text-align:center;">
              <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:0;">
                Gurkerl Cup 2026 · Fun Games Pöttsching · Diese Mail bestätigt eure Anmeldung gemäß DSGVO Art. 6 Abs. 1 lit. a
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON.' }, { status: 400 });
  }

  const { teamName, player1, player2, player3, email } = body as {
    teamName?: string;
    player1?: string;
    player2?: string;
    player3?: string;
    email?: string;
  };

  if (!teamName || !player1 || !player2 || !player3 || !email) {
    return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse.' }, { status: 400 });
  }

  // Insert into Supabase
  const { error: dbError } = await supabase.from('gurkerl_registrations').insert({
    team_name: teamName.trim(),
    player1: player1.trim(),
    player2: player2.trim(),
    player3: player3.trim(),
    email: email.trim().toLowerCase(),
  });

  if (dbError) {
    if (dbError.code === '23505') {
      return NextResponse.json(
        { error: `Der Teamname "${teamName}" ist bereits vergeben. Bitte wähle einen anderen.` },
        { status: 409 }
      );
    }
    console.error('DB error:', dbError);
    return NextResponse.json(
      { error: 'Datenbankfehler – bitte versuche es erneut.' },
      { status: 500 }
    );
  }

  // Send confirmation email
  try {
    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME ?? 'Gurkerl Cup 2026'} <${process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'}>`,
      to: [email.trim()],
      subject: `🥒 Team "${teamName}" ist beim Gurkerl Cup 2026 dabei!`,
      html: htmlEmail(teamName.trim(), [player1, player2, player3].map((p) => p.trim()), email),
    });
  } catch (mailError) {
    console.error('Mail error:', mailError);
    // Still return success – registration is saved
  }

  return NextResponse.json({ success: true });
}
