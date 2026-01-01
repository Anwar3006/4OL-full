import { redirect } from "next/navigation";

export default function RedirectToDashboard() {
  return redirect("/dashboard");
}
