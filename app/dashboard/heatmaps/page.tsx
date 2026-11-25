import { redirect } from "next/navigation";

export default function HeatmapsRedirect() {
  redirect("/dashboard/location/heatmaps");
}