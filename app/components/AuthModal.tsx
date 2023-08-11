"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Modal from "@/app/components/Modal";
import useAuthModal from "@/hooks/useAuthModal";

import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeMinimal, ThemeSupa } from "@supabase/auth-ui-shared";

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onOpen, onClose, isOpen } = useAuthModal();

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    } else {
      onOpen();
    }
  }, [session, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        theme="default"
        // magicLink
        providers={["google"]}
        supabaseClient={supabaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brandAccent: "#f5f4f5",
                brand: "#292524",
                brandButtonText: "#f5f4f5",
                defaultButtonText: "#292524",
                defaultButtonBorder: "gray",
                inputBorder: "lightgray",
                inputBorderFocus: "lightgray",
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
