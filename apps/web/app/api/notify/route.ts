import { NextResponse } from "next/server";
import { sendWhatsApp, sendSMS, checkWhatsAppAvailability } from "@/lib/twilio";

export async function POST(req: Request) {
  try {
    // 1. Security Check: Ensure the request is actually from your Supabase instance
    // You can set a custom secret in the Supabase Webhook headers (e.g., x-webhook-secret)
    const secret = req.headers.get("x-webhook-secret");
    if (secret !== process.env.SUPABASE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    // Supabase Webhooks wrap the data in a 'record' object
    const {
      facility_whatsapp: facilityWhatsapp,
      facility_phone: facilityPhone,
      owner_phone: ownerPhone,
      facility_name: facilityName,
    } = payload.record;

    console.log(
      `Facility with name: ${facilityName} Recorded. Route called. About to send credentials to user`,
    );

    const message = `Welcome to 4 Our Life! ${facilityName} is now active. The below credentials will be used to log into mobile app when ypou download it`;

    // 2. PRIORITY LOGIC: Facility WhatsApp -> Owner WhatsApp -> Owner SMS

    // Check Facility WhatsApp
    const isFacilityWA_One = await checkWhatsAppAvailability(facilityWhatsapp);
    if (isFacilityWA_One) {
      console.log("Sending to Facility WhatsApp Number");
      await sendWhatsApp(facilityWhatsapp, message);
      return NextResponse.json({
        status: "sent",
        channel: "whatsapp",
        recipient: "facility",
      });
    }

    const isFacilityWA_Two = await checkWhatsAppAvailability(facilityPhone);
    if (isFacilityWA_Two) {
      await sendWhatsApp(facilityPhone, message);
      return NextResponse.json({
        status: "sent",
        channel: "whatsapp",
        recipient: "facility",
      });
    }

    // Check Owner WhatsApp
    const isOwnerWA = await checkWhatsAppAvailability(ownerPhone);
    if (isOwnerWA) {
      await sendWhatsApp(ownerPhone, message);
      return NextResponse.json({
        status: "sent",
        channel: "whatsapp",
        recipient: "owner",
      });
    }

    // Fallback: Owner SMS
    await sendSMS(ownerPhone, message);
    return NextResponse.json({
      status: "sent",
      channel: "sms",
      recipient: "owner",
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
