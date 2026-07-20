import { supabase } from "@/lib/supabase";
import {
  Orphanage,
  Need,
  VolunteerRequest,
  Contribution,
  VolunteerSignup,
} from "@/lib/types";

// ---------- Row mappers (DB snake_case -> app camelCase) ----------

function mapOrphanage(row: any): Orphanage {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    state: row.state,
    story: row.story,
    childrenCount: row.children_count,
    verified: row.verified,
    imageUrl: row.image_url,
    views: row.views,
  };
}

function mapNeed(row: any): Need {
  if (row.type === "money") {
    return {
      id: row.id,
      orphanageId: row.orphanage_id,
      type: "money",
      title: row.title,
      description: row.description,
      amountNeeded: row.amount_needed ?? 0,
      amountRaised: row.amount_raised ?? 0,
      urgent: row.urgent,
    };
  }
  return {
    id: row.id,
    orphanageId: row.orphanage_id,
    type: "goods",
    title: row.title,
    description: row.description,
    quantityNeeded: row.quantity_needed ?? 0,
    quantityFulfilled: row.quantity_fulfilled ?? 0,
    unit: row.unit ?? "",
    urgent: row.urgent,
  };
}

function mapVolunteerRequest(row: any): VolunteerRequest {
  return {
    id: row.id,
    orphanageId: row.orphanage_id,
    task: row.task,
    description: row.description,
    date: row.date,
    slotsAvailable: row.slots_available,
    slotsFilled: row.slots_filled,
  };
}

// ---------- Reads ----------

export async function getAllOrphanages(): Promise<Orphanage[]> {
  const { data, error } = await supabase.from("orphanages").select("*");
  if (error || !data) return [];
  return data.map(mapOrphanage);
}

export async function getOrphanageById(
  id: string
): Promise<Orphanage | undefined> {
  const { data, error } = await supabase
    .from("orphanages")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return undefined;
  return mapOrphanage(data);
}

export async function getLeastVisibleOrphanages(
  limit: number
): Promise<Orphanage[]> {
  const { data, error } = await supabase
    .from("orphanages")
    .select("*")
    .order("views", { ascending: true })
    .limit(limit);
  if (error || !data) return [];
  return data.map(mapOrphanage);
}

export async function getNeedsByOrphanage(
  orphanageId: string
): Promise<Need[]> {
  const { data, error } = await supabase
    .from("needs")
    .select("*")
    .eq("orphanage_id", orphanageId);
  if (error || !data) return [];
  return data.map(mapNeed);
}

export async function getVolunteerRequestsByOrphanage(
  orphanageId: string
): Promise<VolunteerRequest[]> {
  const { data, error } = await supabase
    .from("volunteer_requests")
    .select("*")
    .eq("orphanage_id", orphanageId);
  if (error || !data) return [];
  return data.map(mapVolunteerRequest);
}

export async function getAllVolunteerRequests(): Promise<VolunteerRequest[]> {
  const { data, error } = await supabase
    .from("volunteer_requests")
    .select("*");
  if (error || !data) return [];
  return data.map(mapVolunteerRequest);
}

// ---------- Writes ----------

export async function addOrphanage(orphanage: Orphanage) {
  const { error } = await supabase.from("orphanages").insert({
    id: orphanage.id,
    name: orphanage.name,
    location: orphanage.location,
    state: orphanage.state,
    story: orphanage.story,
    children_count: orphanage.childrenCount,
    verified: orphanage.verified,
    image_url: orphanage.imageUrl,
    views: orphanage.views,
  });
  if (error) throw error;
  return orphanage;
}

export async function addNeed(need: Need) {
  const row: any = {
    id: need.id,
    orphanage_id: need.orphanageId,
    type: need.type,
    title: need.title,
    description: need.description,
    urgent: need.urgent,
  };
  if (need.type === "money") {
    row.amount_needed = need.amountNeeded;
    row.amount_raised = need.amountRaised;
  } else {
    row.quantity_needed = need.quantityNeeded;
    row.quantity_fulfilled = need.quantityFulfilled;
    row.unit = need.unit;
  }
  const { error } = await supabase.from("needs").insert(row);
  if (error) throw error;
  return need;
}

export async function addContribution(contribution: Contribution) {
  const { error } = await supabase.from("contributions").insert({
    id: contribution.id,
    need_id: contribution.needId,
    donor_name: contribution.donorName,
    type: contribution.type,
    amount: contribution.amount ?? null,
    quantity: contribution.quantity ?? null,
  });
  if (error) throw error;

  // Update the need's progress
  const { data: needRow } = await supabase
    .from("needs")
    .select("*")
    .eq("id", contribution.needId)
    .single();

  if (needRow) {
    if (
      needRow.type === "money" &&
      contribution.type === "money" &&
      contribution.amount
    ) {
      const newRaised = Math.min(
        needRow.amount_needed ?? 0,
        (needRow.amount_raised ?? 0) + contribution.amount
      );
      await supabase
        .from("needs")
        .update({ amount_raised: newRaised })
        .eq("id", contribution.needId);
    }
    if (
      needRow.type === "goods" &&
      contribution.type === "goods" &&
      contribution.quantity
    ) {
      const newFulfilled = Math.min(
        needRow.quantity_needed ?? 0,
        (needRow.quantity_fulfilled ?? 0) + contribution.quantity
      );
      await supabase
        .from("needs")
        .update({ quantity_fulfilled: newFulfilled })
        .eq("id", contribution.needId);
    }
  }

  return contribution;
}

export async function addVolunteerSignup(signup: VolunteerSignup) {
  const { error } = await supabase.from("volunteer_signups").insert({
    id: signup.id,
    volunteer_request_id: signup.volunteerRequestId,
    volunteer_name: signup.volunteerName,
    contact: signup.contact,
  });
  if (error) throw error;

  // Increment slots_filled
  const { data: reqRow } = await supabase
    .from("volunteer_requests")
    .select("*")
    .eq("id", signup.volunteerRequestId)
    .single();

  if (reqRow && reqRow.slots_filled < reqRow.slots_available) {
    await supabase
      .from("volunteer_requests")
      .update({ slots_filled: reqRow.slots_filled + 1 })
      .eq("id", signup.volunteerRequestId);
  }

  return signup;
}