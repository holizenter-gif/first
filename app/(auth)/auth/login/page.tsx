"use client";

import { useState }  from "react";
import { useRouter } from "next/navigation";
import LoginModal         from "@/components/auth/LoginModal";
import ResetPasswordModal from "@/components/auth/ResetPasswordModal";

export default function LoginPage() {
  const router = useRouter();
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      <LoginModal
        isOpen={true}
        onClose={() => router.push("/")}
        onLoginSuccess={() => router.push("/mi-perfil/tareas")}
        onSignupClick={() => router.push("/auth/signup")}
        onResetClick={() => setShowReset(true)}
      />
      <ResetPasswordModal
        isOpen={showReset}
        onClose={() => setShowReset(false)}
        onLoginClick={() => setShowReset(false)}
      />
    </>
  );
}
