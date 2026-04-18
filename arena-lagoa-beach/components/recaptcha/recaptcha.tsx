"use client";

import ReCAPTCHA from "react-google-recaptcha";

type RecaptchaProps = {
  onChange: (token: string | null) => void;
};
// Adiciona o componente ReCAPTCHA do Google para proteger o formulário contra bots.
export default function Recaptcha({ onChange }: RecaptchaProps) {
  return (
    <ReCAPTCHA
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      onChange={onChange}
    />
  );
}