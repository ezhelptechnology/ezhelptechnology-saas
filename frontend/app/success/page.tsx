"use client";

import { Suspense } from "react";
import SuccessComponent from "./success-component";

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessComponent />
    </Suspense>
  );
}
