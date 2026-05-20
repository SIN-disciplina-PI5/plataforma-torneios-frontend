"use client";

import ReCAPTCHA from "react-google-recaptcha";

type RecaptchaProps = {
  onChange: (token: string | null) => void;
};
// Adiciona o componente ReCAPTCHA do Google para proteger o formulário contra bots.
export default function Recaptcha({ onChange }: RecaptchaProps) {
  // impressão do site key para verificar se está sendo carregado corretamente, deve ser removida em produção
    console.log("SITE KEY:", process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
  return (
    <ReCAPTCHA
    // teste para o sitekey, deve ser substituído pelo sitekey real do reCAPTCHA para produção
      sitekey="6LfBKbssAAAAAP_r-5vkQwcRGWP4Fglr5YsaRBRE"
      onChange={onChange}
    />
  );
}