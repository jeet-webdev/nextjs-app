import { redirect } from "next/navigation";

export default function AdministrationRedirectPage() {
  redirect("/dashboard/administration");
}