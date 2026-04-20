import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background/95 backdrop-blur-sm px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="InpromptiFy"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
        </div>
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "hsl(24, 100%, 50%)",
              colorBackground: "#ffffff",
              colorText: "#111111",
              colorTextSecondary: "#555555",
              colorInputBackground: "#f9f9f9",
              colorInputText: "#111111",
              borderRadius: "0.75rem",
            },
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-white border border-gray-200 shadow-2xl shadow-black/20 rounded-2xl",
              headerTitle: "text-gray-900 text-xl font-bold",
              headerSubtitle: "text-gray-500",
              socialButtonsBlockButton:
                "bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100",
              socialButtonsBlockButtonText: "text-gray-700",
              formFieldLabel: "text-gray-700 font-medium",
              formFieldInput:
                "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
              footerActionLink: "text-orange-500 hover:text-orange-600 font-medium",
              formButtonPrimary:
                "bg-orange-500 text-white hover:bg-orange-600 shadow-lg",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-400",
              footer: "text-gray-500",
              footerActionText: "text-gray-500",
              identityPreviewEditButton: "text-orange-500",
              formFieldSuccessText: "text-green-600",
              formFieldErrorText: "text-red-600",
              alertText: "text-gray-700",
              avatarImageActionsUpload: "text-orange-500",
            },
          }}
        />
      </div>
    </div>
  );
}
