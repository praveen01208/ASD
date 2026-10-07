import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            // Hide phone number input and related UI
            phoneInputBox: "hidden",
            formFieldRow__phoneNumber: "hidden",
            formField__phoneNumber: "hidden",
          },
        }}
      />
    </div>
  );
}
