# "Continue with WhatsApp" sign-in: setup guide for the owner

This turns on a third way to sign in (next to email + password and Google). The student taps a
button, WhatsApp opens with a message already typed ("PREPPLAN K7M2XQ9A"), she presses Send, and
the PrepPlan page signs her in. Nobody types a code and no SMS is paid for. The message proves the
phone number, because it really arrived from that number.

The code is already built and switched off. Nothing changes for anyone until you finish step 6.
Only students can use it: parent and admin accounts can never sign in or be created this way.

## What you need
- A Facebook login (personal is fine) to open a Meta developer account.
- A phone number for the business that is **not** registered on the normal WhatsApp or WhatsApp
  Business app on any phone (a new prepaid SIM is the usual choice). It must be able to receive one
  SMS or call during setup. Once it is on the Cloud API it cannot also be used in the phone app.
- The business details Meta asks for (name, address, website `www.prepplan.in`, documents).

## Step by step

1. **Meta developer account.** Go to developers.facebook.com, log in, click "Get started" and
   accept the terms.
2. **Meta Business account.** Go to business.facebook.com and create a business account for
   PrepPlan. Then open Business settings > Security Center and start **Business verification**
   (upload the documents Meta asks for). Verification can take days. You can test with Meta's
   free test number before it is approved, but real students need the verified business.
3. **Create the app.** In the developer dashboard choose Create app > type **Business** > add the
   product **WhatsApp**. Link it to your Business account.
4. **Add your number.** In WhatsApp > API Setup, click "Add phone number", enter the business name
   and the new SIM's number, and confirm by SMS or call. Note two values on that page:
   - **Phone number ID** (a long number)
   - the number itself, which is `WHATSAPP_BUSINESS_NUMBER` written as digits only with the country
     code and no plus or spaces, for example `919876543210`.
5. **Collect the secrets.**
   - **App secret:** App settings > Basic > App secret > Show. This is `WHATSAPP_APP_SECRET`.
   - **Access token (optional but recommended):** Business settings > Users > System users >
     add a system user, give it the app with "Manage app", then Generate token with the
     `whatsapp_business_messaging` permission and choose "never expires". This is
     `WHATSAPP_ACCESS_TOKEN`. It is only used to send the short reply "You are signed in to
     PrepPlan. You can go back to the app now." If it is missing, sign-in still works.
   - **Verify token:** make up a long random phrase (20+ letters and digits). This is
     `WHATSAPP_VERIFY_TOKEN`. Meta does not give it to you; you choose it and tell Meta the same
     phrase in the next step.
6. **Put the variables in Vercel, then redeploy.** In Vercel > the PrepPlan project > Settings >
   Environment Variables (Production) add:

   | Name | Value | Required |
   |---|---|---|
   | `WHATSAPP_BUSINESS_NUMBER` | digits only, e.g. `919876543210` | yes |
   | `WHATSAPP_APP_SECRET` | the app secret | yes |
   | `WHATSAPP_VERIFY_TOKEN` | your chosen phrase | yes |
   | `WHATSAPP_ACCESS_TOKEN` | the permanent token | for the reply |
   | `WHATSAPP_PHONE_NUMBER_ID` | the phone number ID | for the reply |

   Then redeploy (Deployments > the latest > Redeploy). The button only appears when the first
   three are set.
7. **Connect the webhook.** In the app dashboard: WhatsApp > Configuration > Webhook > Edit.
   - Callback URL: `https://www.prepplan.in/api/webhooks/whatsapp`
   - Verify token: the same phrase as `WHATSAPP_VERIFY_TOKEN`
   - Click Verify and save, then under "Webhook fields" **subscribe to `messages`**.
   The deploy from step 6 must be live first, because Meta calls the address during Verify.
8. **Test on your own computer first (no Meta needed).** Start the app locally with the three
   required variables set in `.env` (use made-up values, for example a secret `devsecret`), open the
   sign-in page, tap "Continue with WhatsApp", note the 8-character code, then in another terminal:

   ```
   WHATSAPP_APP_SECRET=devsecret npx tsx scripts/whatsapp-simulate.ts --code K7M2XQ9A --from 919876543210
   ```

   (use the code from the screen and any phone number). The page should sign in, or ask for a name
   if the number is new. The script refuses to send to prepplan.in.
9. **Test with a real phone.** On the live site tap the button on a phone with WhatsApp, press
   Send, and check she is signed in. Try a second, new number to see the first-time sign-up, and a
   number already linked in Settings to see a returning sign-in.

## Cost
Per Meta's current model, a message the *customer* starts (she messages us) opens a service
conversation, and replies inside that window are free. This feature only ever replies to a message
the student sent, so it should cost nothing. Meta changes its pricing from time to time, so
re-check the WhatsApp Business Platform pricing page before launch and every few months. The
business number needs its own SIM plan.

## Privacy and the law (India, DPDP Act)
- A phone number is personal data, and these are children. The sign-up tick "my parent or guardian
  agrees" is the consent record and is enforced on the server, but the **privacy page and the
  consent wording must be updated** to say that PrepPlan stores the number, uses it only to sign
  in, and that Meta (WhatsApp) processes the message. **Legal review is still pending.**
- PrepPlan stores only the number (never message bodies beyond the sign-in code, which is not kept
  in logs). Numbers are shown masked, like `+91 ••••• ••123`.
- A student can remove her number in Settings, unless it is her only way to sign in.
- Deleting an account removes the number with it.

## Known risk: login phishing
A student can be tricked into sending someone else's code. If a bad person shows her a "PREPPLAN
CODE" and she sends it from her phone, that person's browser signs in as **her**. The screen in the
app tells her to send only the message shown on her own screen and never one sent by someone else.
Codes last 10 minutes and work once. Please repeat this advice to families.

## If a student's number changes
She can sign in with email/password or Google and, in Settings, remove the old number and link the
new one. If she has only WhatsApp sign-in and lost the old number, a support person has to clear
the old number in the database (`users.phone_number`, and `phone_number_verified_at`), after which
she signs in again from the new number and the old account is not reused automatically. Support
should confirm who she is with her parent first.

## Troubleshooting
- Meta says "callback URL or verify token could not be validated": the three variables are not set
  in Vercel yet, or the site was not redeployed, or the phrase differs by even one character.
- Student sends the message but the page keeps waiting: the webhook is not subscribed to
  `messages` (step 7), or `WHATSAPP_APP_SECRET` is wrong (the webhook answers 401; see Meta's
  webhook logs), or the code is older than 10 minutes.
- The button is missing: one of the three required variables is not set in Production.
