import { NextResponse } from "next/server";
import {
  sendWhatsApp,
  sendSMS,
  checkWhatsAppAvailability,
  initiateWhatsAppHandshake,
} from "@/lib/twilio";

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
      facility_email: facilityEmail,
      temp_key: tempKey,
    } = payload.record;

    const contentSid = process.env.TWILIO_CONTENT_TEMPLATE_SID || "";

    // Placeholder values for the template {{1}}
    const contentVariables = JSON.stringify({ "1": facilityName });

    console.log(
      `Facility with name: ${facilityName} Recorded. Route called. About to send credentials to user`,
    );

    // 2. PRIORITY LOGIC: Facility WhatsApp -> Facility Contact -> Owner WhatsApp -> Owner SMS

    // Check Facility WhatsApp
    const isFacilityWA_One = await checkWhatsAppAvailability(facilityWhatsapp);
    if (isFacilityWA_One) {
      console.log("Sending to Facility WhatsApp Number");
      await initiateWhatsAppHandshake(
        facilityWhatsapp,
        contentSid,
        contentVariables,
        facilityEmail,
        tempKey,
      );
      return NextResponse.json({
        status: "handshake_sent",
        channel: "whatsapp",
        recipient: "facility",
      });
    }

    const isFacilityWA_Two = await checkWhatsAppAvailability(facilityPhone);
    if (isFacilityWA_Two) {
      await initiateWhatsAppHandshake(
        facilityPhone,
        contentSid,
        contentVariables,
        facilityEmail,
        tempKey,
      );
      return NextResponse.json({
        status: "handshake_sent",
        channel: "whatsapp",
        recipient: "facility",
      });
    }

    // Check Owner WhatsApp
    const isOwnerWA = await checkWhatsAppAvailability(ownerPhone);
    if (isOwnerWA) {
      await initiateWhatsAppHandshake(
        ownerPhone,
        contentSid,
        contentVariables,
        facilityEmail,
        tempKey,
      );
      return NextResponse.json({
        status: "handshake_sent",
        channel: "whatsapp",
        recipient: "owner",
      });
    }

    // Fallback to SMS (Templates aren't required for SMS)
    const smsMessage = `Welcome! ${facilityName} is active. Login: ${facilityEmail} / ${tempKey}`;
    await sendSMS(ownerPhone, smsMessage);
    return NextResponse.json({
      status: "sms_sent",
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
