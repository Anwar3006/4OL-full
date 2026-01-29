# Vercel and Hover

NSLookUp indicates the Nameservers points to:

- ns1.vercel-dns.com
- ns2.vercel-dns.com

- This means you are in the perfect spot! Here is the breakdown of why you see those nameservers and what you need to do next.

## The "Why": Hover vs. Vercel

- Hover is your Registrar: You pay them every year to own the name domain.com.

- Vercel is your DNS Host: Hover has been told, "Whenever someone looks for this domain, ask Vercel's servers where to go."

- Because your Nameservers already point to Vercel, Vercel is now the "boss" of your DNS records. You do not need to log into Hover to add your subdomain. You will do everything inside Vercel.

## How to add admin.domain.com

- Since Vercel is managing your DNS, it will automatically create the necessary records for you. You don't need to manually create a CNAME.

- Go to Vercel Dashboard: Open the specific project you want to use for the admin site.

- Navigate to Settings: Click Settings at the top, then Domains on the left sidebar.

```sh
Add the Subdomain:

Type admin.domain.com in the input field.

Click Add.
```

- Automatic Verification: Because Vercel sees that it already controls your nameservers, it should verify the domain almost instantly. It will automatically handle the routing and issue an SSL certificate (HTTPS) for you.

## What if I need to add other records (like Email)?

- If you ever need to add records for other services (like Google Workspace for email or a verification TXT record), you will also do that in Vercel, not Hover:

- In Vercel, click on Domains in your top-level account navigation (not inside a project).

- Click on domain.com.

- Scroll down to DNS Records. Here you can add A, CNAME, MX, or TXT records manually.

You are a senior reactive native developer, tasked with implementing these:

1. A floating button with a nice icon of a pill and a plus on it, when users click on it, it opens a modal for the user. This modal will have: "Welcome to your Medication Reminder. Type the name of your medication to begin" then a text box for them to type.
2. When users first open the app we want to ask them to register we will display the "Allow '4 our life' to track ..." alert. After registration and we land on the home we will display the "4 our life Would like to send you notifications...", then when they click on the maps we will display the last alert about the location.
   also, anytime we close the app and reopen it, we want to display the face scanning modal, this is a health-care app and we want to employ and zero-trust architecture, the same will go for other types of biometric logins like finger-print and all that, we will always ask the users to relogin after the app is closed for 5 minutes.

Those are the goals, for the notification, we will need to configure expo, look at the codebase and see what needs to be done, create a full documentation for that, but ensure once we configure the expo notification the alerts will automatically work so setup the alerts even if the dependencies may not be available and in the documentation, state what needs to be done to allow the alerts to show
