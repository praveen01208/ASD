import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
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
