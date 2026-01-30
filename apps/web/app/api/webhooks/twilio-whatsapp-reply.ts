import { supabaseAdmin } from "@/lib/supabase/indexAdmin";
import { sendWhatsApp } from "@/lib/twilio";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const body = formData.get("Body"); // This will be "Get Credentials"
  const from = formData.get("From") as string; // This is the user's phone number

  if (body === "Get Credentials") {
    if (!from) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    // 1. Fetch credentials from your DB based on the 'from' phone number
    const { data } = await supabaseAdmin
      .from("twilio_whatsapp_handshakes")
      .select("facility_email, gps_address")
      .eq("phone_number", from?.replace("whatsapp:", ""))
      .single();

    const secureMessage = `🔐 *Your Credentials:* \nEmail: ${data?.facility_email}\nTemp Pass: ${data?.gps_address}\n\niOS: apple.co/link\nAndroid: bit.ly/link`;
    // 2. Send as standard text (The 24h window is now OPEN!)
    await sendWhatsApp(from, secureMessage);
  }

  return new Response("OK", { status: 200 });
}
