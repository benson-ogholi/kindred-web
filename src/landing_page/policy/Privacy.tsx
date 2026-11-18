import LegalLayout from "./LegalLayout";
import { EMAIL } from "../home/shared";

/* DRAFT TEMPLATE: describe only what the app really does. Have a lawyer review and fill every [bracket]. */
export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="[date]"
      intro="This policy explains what information Kokohor collects, why, and the choices you have."
      sections={[
        { title: "Who we are", body: [
          "Kokohor is operated by [company name], [address]. You can reach us at " + EMAIL + ".",
        ]},
        { title: "Information we collect", body: [
          "Account details, such as your name, phone number or email, and profile photo.",
          "Content you create, such as messages, voice notes, group news, polls and call activity.",
          "Safety Vault information you choose to add, such as whereabouts, emergency contacts, medical notes and documents, along with the release terms and the people you assign.",
          "Device and usage information, such as device type, app version and crash reports. [Confirm exactly what is collected, including location if used.]",
        ]},
        { title: "How we use your information", body: [
          "To run Kokohor: create your account, deliver messages and calls, show circle content and operate the Safety Vault according to your terms.",
          "To keep the app safe, fix problems, improve features and contact you about your account or important updates.",
        ]},
        { title: "Safety Vault information", body: [
          "Vault information is yours. It is made available only to the people you assign, and only when the terms you set are met. We do not use it to advertise to you. [Confirm storage and security details before publishing.]",
        ]},
        { title: "Who we share information with", body: [
          "We share content with the members of the circles you choose. We use service providers, such as hosting and notification providers, who process data on our behalf. We may disclose information if the law requires it or to protect people’s safety. We do not sell your personal information.",
        ]},
        { title: "How long we keep it", body: [
          "We keep your information while your account is active. When you delete your account, we delete or anonymise your information within [period], unless the law requires us to keep it longer.",
        ]},
        { title: "Your rights", body: [
          "Under the Nigeria Data Protection Act 2023 and other applicable laws, you may have the right to access, correct, delete or object to the use of your personal data, and to withdraw consent. To use these rights, email " + EMAIL + ".",
        ]},
        { title: "Security", body: [
          "We take reasonable steps to protect your information. No system is completely secure, so please use a strong password and keep your device safe.",
        ]},
        { title: "Children", body: [
          "Kokohor is not intended for children under [18 / confirm]. If you believe a child has given us information, contact us and we will remove it.",
        ]},
        { title: "Changes to this policy", body: [
          "We may update this policy. If the changes are important, we will let you know in the app or by email.",
        ]},
        { title: "Contact", body: ["For privacy questions or requests, email " + EMAIL + "."] },
      ]}
    />
  );
}