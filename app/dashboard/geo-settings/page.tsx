import { redirect } from "next/navigation";

export default function GeoSettingsRedirect() {
  redirect("/dashboard/location/settings");
}