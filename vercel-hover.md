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
