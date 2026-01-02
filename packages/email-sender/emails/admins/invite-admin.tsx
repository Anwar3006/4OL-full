import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface InviteAdminEmailProps {
  email: string;
  inviteLink: string;
}

export const InviteAdminEmail = ({
  email,
  inviteLink,
}: InviteAdminEmailProps) => {
  const previewText = `Exclusive Invitation: Join the 4 Our Life Administrative Team`;

  const username = email?.split("@")[0];

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#EBF4DD] py-10 font-sans">
          <Container className="mx-auto max-w-[600px] overflow-hidden rounded-xl bg-white shadow-lg">
            {/* Elegant Header Banner */}
            <Section className="bg-[#059669] p-8 text-center">
              <Img
                src={"http://localhost:3000/assets/images/all-img/logo.png"} //TODO: Update this to production URL
                width="64"
                height="64"
                alt="4 Our Life Logo"
                className="mx-auto mb-4 rounded-2xl shadow-md"
              />
              <Text className="m-0 font-medium tracking-[2px] text-[12px] uppercase text-white/80">
                Health Administration Portal
              </Text>
            </Section>

            <Section className="px-12 py-12">
              <Heading className="m-0 text-left font-serif text-[28px] font-semibold leading-tight text-[#111827]">
                Elevating Healthcare <br />
                <span className="text-[#059669]">Management.</span>
              </Heading>

              <Text className="mt-6 text-[16px] leading-6.5 text-[#4b5563]">
                Hello {username},
              </Text>

              <Text className="text-[16px] leading-6.5 text-[#4b5563]">
                You have been selected by the{" "}
                <strong>4 Our Life Super Admin</strong> to join our elite
                network of healthcare administrators. Your expertise is required
                to manage and approve world-class medical facilities.
              </Text>

              <Section className="mt-8 mb-10 text-center">
                <Button
                  className="inline-block rounded-lg bg-[#059669] px-10 py-4 text-center text-[14px] font-bold text-white no-underline shadow-xl transition-all"
                  href={inviteLink}
                >
                  Accept Administrative Access
                </Button>
              </Section>

              <Text className="text-[14px] text-[#6b7280]">
                If the button above does not work, please use the secure link
                below:
                <br />
                <Link href={inviteLink} className="text-[#059669] underline">
                  {inviteLink}
                </Link>
              </Text>

              <Hr className="my-8 border-[#e5e7eb]" />

              <Text className="text-[13px] italic leading-6 text-[#9ca3af]">
                Note: This invitation was securely generated for{" "}
                <strong>{email}</strong>. If you were not expecting this access
                request, please contact our security team immediately to
                safeguard the 4 Our Life infrastructure.
              </Text>
            </Section>

            {/* Footer Section */}
            <Section className="bg-[#f9fafb] px-12 py-6 text-center">
              <Text className="m-0 text-[12px] font-medium text-[#6b7280]">
                © {new Date().getFullYear()} 4 Our Life. Confidential Health
                Infrastructure.
              </Text>
              <Text className="mt-2 text-[11px] text-[#9ca3af]">
                Precision. Security. Vitality.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InviteAdminEmail;
