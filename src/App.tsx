import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { InvestigationShell } from "@/components/layout/InvestigationShell";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InvestigationShell />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
