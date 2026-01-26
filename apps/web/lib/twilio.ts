import { Twilio } from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

export async function sendWhatsApp(to: string, message: string) {
  try {
    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
      body: message,
    });
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("WhatsApp Error:", error);
    return { success: false, error };
  }
}

export async function sendSMS(to: string, message: string) {
  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
      body: message,
    });
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("SMS Error:", error);
    return { success: false, error };
  }
}

/**
 * Checks if a number is registered on WhatsApp using Twilio's Lookup API
 */
export async function checkWhatsAppAvailability(
  phone: string,
): Promise<boolean> {
  try {
    // Note: Twilio Lookup v2 is best for this
    const lookup = await client.lookups.v2.phoneNumbers(phone).fetch({
      fields: "line_type_intelligence",
    });
    return lookup.lineTypeIntelligence?.type === "mobile";
  } catch (e) {
    return false; // Default to false if check fails
  }
}
