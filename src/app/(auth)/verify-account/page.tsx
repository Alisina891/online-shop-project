// app/(auth)/verify-account/page.tsx
import { Suspense } from "react";
import VerifyOtpContent from "./VerifyOtpContent";
import LoadingSpinner from "@/components/ui/loading-spinner"; // Your loading component

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyOtpContent />
    </Suspense>
  );
}