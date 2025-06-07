// src/pages/user/ForgotPasswordFlow.js
import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "../ResetPassword/ResetPassword";
const ForgotPasswordFlow = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 1 && (
        <ForgotPassword
          onSuccess={(value) => {
            setEmailOrPhone(value);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <VerifyOTP
          emailOrPhone={emailOrPhone}
          onSuccess={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && <ResetPassword emailOrPhone={emailOrPhone} />}
    </div>
  );
};

export default ForgotPasswordFlow;
