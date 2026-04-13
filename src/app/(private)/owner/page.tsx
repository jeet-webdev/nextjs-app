import { redirect } from "next/navigation";

export default function OwnerRedirectPage() {
  redirect("/dashboard/owner");
}