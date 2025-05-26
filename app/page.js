import { redirect } from "next/navigation";
import Image from "next/image";

export default function Page() {
  redirect("/home");
  return null;
}
