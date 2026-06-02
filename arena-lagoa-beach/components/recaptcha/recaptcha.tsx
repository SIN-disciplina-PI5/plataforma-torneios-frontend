"use client";

import { forwardRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

type RecaptchaProps = {
  onChange: (token: string | null) => void;
};

const Recaptcha = forwardRef<ReCAPTCHA, RecaptchaProps>(
  ({ onChange }, ref) => {
    return (
      <ReCAPTCHA
        ref={ref}
        sitekey="6LfBKbssAAAAAP_r-5vkQwcRGWP4Fglr5YsaRBRE"
        onChange={onChange}
      />
    );
  }
);

Recaptcha.displayName = "Recaptcha";

export default Recaptcha;