import { getAllOpenNeeds } from "@/lib/data";
import GiveClient from "./GiveClient";

export const dynamic = "force-dynamic";

export default async function GivePage() {
  const needs = await getAllOpenNeeds();
  const states = Array.from(new Set(needs.map((n) => n.state).filter(Boolean)));
  return <GiveClient needs={needs} states={states} />;
}