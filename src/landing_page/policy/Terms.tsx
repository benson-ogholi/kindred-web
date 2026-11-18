import LegalLayout from "./LegalLayout";
import { EMAIL } from "../home/shared";

/* DRAFT TEMPLATE: have a lawyer review and fill every [bracket] before publishing. */
export default function Terms() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="[date]"
      intro="These terms explain the rules for using Kokohor. Please read them before you create an account."
      sections={[
        { title: "Agreeing to these terms", body: [
          "By creating an account or using Kokohor, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the app.",
        ]},
        { title: "Who can use Kokohor", body: [
          "You must be at least [18] years old, or have the permission of a parent or guardian where the law allows, to use Kokohor. You must give accurate information when you sign up.",
        ]},
        { title: "Your account", body: [
          "You are responsible for your account and for keeping your login details safe. Tell us promptly at " + EMAIL + " if you think someone else has accessed your account.",
        ]},
        { title: "Circles and shared content", body: [
          "Kokohor lets you create circles for family, classmates, coworkers, businesses and communities, and to share messages, voice notes, news and polls in them.",
          "You own the content you share. You give us permission to store and display it to the people you choose so the app can work. You are responsible for what you post and for inviting only people you are comfortable sharing with.",
        ]},
        { title: "Safety Vault", body: [
          "The Safety Vault lets you store information and choose the family members who can access it once the terms you set are met, such as a missed check-in.",
          "You are responsible for the accuracy of what you store, for choosing the right people and for setting terms that suit you. Kokohor is not an emergency service and does not replace calling the police, ambulance or other emergency responders. We cannot guarantee that a release will always happen at an exact time or that recipients will act on it.",
        ]},
        { title: "Calls (beta)", body: [
          "Calling is a beta feature. It may be unavailable, change or have errors. Do not rely on it for emergencies.",
        ]},
        { title: "Acceptable use", body: [
          "Do not use Kokohor to harass, threaten or defraud anyone, to share illegal content, to impersonate others, to send spam, or to interfere with the app or other users’ accounts.",
        ]},
        { title: "Our rights", body: [
          "Kokohor, including its name, logo, design and software, belongs to [company name] or its licensors. These terms do not give you ownership of any of it.",
        ]},
        { title: "Suspending or ending your account", body: [
          "You can stop using Kokohor and ask us to delete your account at any time. We may suspend or close accounts that break these terms or put others at risk.",
        ]},
        { title: "Disclaimers and liability", body: [
          "Kokohor is provided “as is” and “as available”. To the extent the law allows, we are not liable for indirect or consequential losses arising from your use of the app. Nothing in these terms limits any rights you have that cannot be limited by law.",
        ]},
        { title: "Changes to these terms", body: [
          "We may update these terms from time to time. If we make important changes, we will let you know in the app or by email. Continuing to use Kokohor after a change means you accept it.",
        ]},
        { title: "Governing law", body: [
          "These terms are governed by the laws of [Federal Republic of Nigeria / confirm]. Disputes will be handled by the courts of [location / confirm].",
        ]},
        { title: "Contact", body: ["Write to us at " + EMAIL + " with any questions about these terms."] },
      ]}
    />
  );
}