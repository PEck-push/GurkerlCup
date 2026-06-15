import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

function htmlEmail(teamName: string, players: string[], email: string): string {
  const playerRows = players.map((p, i) => `
    <tr>
      <td style="padding:14px 24px;border-bottom:${i < players.length - 1 ? '1px solid rgba(45,106,79,0.25)' : 'none'};">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="width:32px;vertical-align:middle;">
              <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#D4AF37,#F0CE67);display:inline-block;text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#0D2818;">${i + 1}</div>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <span style="color:#ffffff;font-size:15px;font-weight:600;">${p}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gurkerl Cup 2026 – Anmeldebestätigung</title>
</head>
<body style="margin:0;padding:0;background:#0A1A0C;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A1A0C;padding:32px 16px 48px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

          <!-- TOP BADGE -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <span style="display:inline-block;background:rgba(212,175,55,0.12);border:1px solid rgba(212,175,55,0.35);border-radius:100px;padding:7px 20px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D4AF37;font-weight:700;">
                ✦ &nbsp;Anmeldebestätigung &nbsp;✦
              </span>
            </td>
          </tr>

          <!-- MAIN CARD -->
          <tr>
            <td style="background:#111E13;border-radius:24px;overflow:hidden;border:1px solid #1E4028;box-shadow:0 32px 80px rgba(0,0,0,0.5);">

              <!-- HERO HEADER -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(160deg,#1A3020 0%,#0D1F10 50%,#0A1A0C 100%);padding:48px 40px 40px;text-align:center;border-bottom:1px solid #1E4028;position:relative;">
                    <!-- Decorative dots -->
                    <p style="font-size:36px;margin:0 0 20px;letter-spacing:8px;">🥒&nbsp;🏆&nbsp;🥒</p>
                    <h1 style="margin:0 0 6px;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#52B788;font-weight:700;">
                      Fun Games Pöttsching
                    </h1>
                    <h2 style="margin:0 0 24px;font-size:40px;font-weight:900;color:#D4AF37;letter-spacing:-1px;line-height:1.1;">
                      Gurkerl Cup<br><span style="color:#ffffff;">2026</span>
                    </h2>
                    <!-- Gold divider -->
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="width:40px;height:1px;background:rgba(212,175,55,0.3);"></td>
                        <td style="width:8px;height:8px;background:#D4AF37;border-radius:50%;margin:0 10px;vertical-align:middle;padding:0 10px;">
                          <div style="width:8px;height:8px;background:#D4AF37;border-radius:50%;"></div>
                        </td>
                        <td style="width:40px;height:1px;background:rgba(212,175,55,0.3);"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- IHR SEID DABEI -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:36px 40px 28px;text-align:center;border-bottom:1px solid rgba(30,64,40,0.6);">
                    <p style="margin:0 0 6px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#52B788;font-weight:700;">Status</p>
                    <h3 style="margin:0 0 16px;font-size:34px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                      IHR&nbsp;SEID&nbsp;DABEI&nbsp;🎉
                    </h3>
                    <p style="margin:0;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.55);">
                      Team <strong style="color:#D4AF37;font-size:17px;">${teamName}</strong> ist erfolgreich angemeldet.<br>
                      Macht euch bereit für den härtesten Gurken-Wettkampf aller Zeiten.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- TEAM ROSTER -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                      <tr>
                        <td style="padding:14px 24px;background:rgba(82,183,136,0.08);border-radius:12px 12px 0 0;border:1px solid rgba(45,106,79,0.3);border-bottom:none;">
                          <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#52B788;font-weight:700;">
                            🃏 &nbsp;Euer Kader
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#0D1F10;border:1px solid rgba(45,106,79,0.3);border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            ${playerRows}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- EVENT DETAILS -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:24px 40px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1A2E1D,#0D1A10);border:1px solid rgba(45,106,79,0.35);border-radius:14px;overflow:hidden;">
                      <tr>
                        <td style="padding:14px 22px;border-bottom:1px solid rgba(45,106,79,0.25);">
                          <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#52B788;font-weight:700;">📍 &nbsp;Event Info</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:20px 22px;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom:10px;">
                                <span style="color:rgba(255,255,255,0.45);font-size:12px;text-transform:uppercase;letter-spacing:2px;">Datum</span><br>
                                <span style="color:#ffffff;font-size:16px;font-weight:700;">Samstag, 18. Juli 2026</span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom:10px;border-top:1px solid rgba(45,106,79,0.2);padding-top:10px;">
                                <span style="color:rgba(255,255,255,0.45);font-size:12px;text-transform:uppercase;letter-spacing:2px;">Uhrzeit</span><br>
                                <span style="color:#ffffff;font-size:16px;font-weight:700;">Ab 14:30 Uhr &nbsp;<span style="color:rgba(255,255,255,0.4);font-size:13px;font-weight:400;">(Ankunft &amp; Empfang)</span></span>
                              </td>
                            </tr>
                            <tr>
                              <td style="border-top:1px solid rgba(45,106,79,0.2);padding-top:10px;">
                                <span style="color:rgba(255,255,255,0.45);font-size:12px;text-transform:uppercase;letter-spacing:2px;">Ort</span><br>
                                <span style="color:#ffffff;font-size:16px;font-weight:700;">Fußballplatz Pöttsching</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CHECK-IN REMINDER -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:20px 40px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.05));border:1px solid rgba(212,175,55,0.3);border-radius:14px;">
                      <tr>
                        <td style="padding:20px 22px;">
                          <p style="margin:0 0 6px;font-size:13px;font-weight:800;color:#D4AF37;text-transform:uppercase;letter-spacing:2px;">
                            ⏰ &nbsp;Check-In Reminder
                          </p>
                          <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6;">
                            Alle Teams bitte <strong style="color:#F0CE67;">30 Minuten vor Start</strong> beim Check-In erscheinen.<br>
                            Ihr erhaltet dort euren Gurkerl Pass & die Joker-Karten.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- MOTIVATIONAL CLOSER -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px 40px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.3px;">
                      Möge die beste Gurke gewinnen.
                    </p>
                    <p style="margin:12px 0 0;font-size:13px;color:rgba(255,255,255,0.35);line-height:1.6;">
                      Bei Fragen einfach auf diese Mail antworten.<br>
                      Wir sehen uns am 18. Juli! 🏆
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.2);">
                Gurkerl Cup 2026 &middot; Fun Games Pöttsching
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.12);">
                Bestätigung für ${email} &middot; DSGVO Art. 6 Abs. 1 lit. a
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
  let emailSent = false;
  let emailError: string | null = null;
  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
    const fromName    = process.env.RESEND_FROM_NAME  ?? 'Gurkerl Cup 2026';
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: [email.trim()],
      subject: `🥒 Team "${teamName}" ist beim Gurkerl Cup 2026 dabei!`,
      html: htmlEmail(teamName.trim(), [player1, player2, player3].map((p) => p.trim()), email),
    });
    if (error) {
      emailError = JSON.stringify(error);
      console.error('Resend error:', error);
    } else {
      emailSent = true;
      console.log('Email sent, id:', data?.id);
    }
  } catch (mailError) {
    emailError = String(mailError);
    console.error('Mail exception:', mailError);
  }

  return NextResponse.json({ success: true, emailSent, emailError });
}
