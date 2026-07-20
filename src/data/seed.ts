import { Orphanage, Need, VolunteerRequest } from "@/lib/types";

export const orphanages: Orphanage[] = [
  {
    id: "orph-1",
    name: "Asha Bal Ashram",
    location: "Ratlam",
    state: "Madhya Pradesh",
    story:
      "Home to 34 children, Asha Bal Ashram has been quietly running for 12 years with almost no outside visibility. Most of its support comes from a handful of local families.",
    childrenCount: 34,
    verified: true,
    imageUrl:
      "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?q=80&w=1200",
    views: 42,
  },
  {
    id: "orph-2",
    name: "Sneh Sadan",
    location: "Bellary",
    state: "Karnataka",
    story:
      "Sneh Sadan supports 21 children, many with special needs. They rely almost entirely on the personal savings of the two founders.",
    childrenCount: 21,
    verified: true,
    imageUrl:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200",
    views: 15,
  },
  {
    id: "orph-3",
    name: "Umang Children's Home",
    location: "Bharuch",
    state: "Gujarat",
    story:
      "Umang has cared for over 200 children since it was founded in 2005, but has never had a website or social media presence until now.",
    childrenCount: 28,
    verified: true,
    imageUrl:
      "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=1200",
    views: 8,
  },
  {
    id: "orph-4",
    name: "Kiran Foundation Home",
    location: "Rourkela",
    state: "Odisha",
    story:
      "Kiran Foundation Home shelters 19 children orphaned or abandoned after medical crises in their families. Funding is their single biggest challenge.",
    childrenCount: 19,
    verified: true,
    imageUrl:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1200",
    views: 5,
  },
];

export const needs: Need[] = [
  {
    id: "need-1",
    orphanageId: "orph-1",
    type: "money",
    title: "Monthly ration support",
    description: "Rice, dal, oil and vegetables for 34 children for one month.",
    amountNeeded: 15000,
    amountRaised: 6200,
    urgent: true,
  },
  {
    id: "need-2",
    orphanageId: "orph-1",
    type: "goods",
    title: "Winter blankets",
    description: "Warm blankets needed before the cold season sets in.",
    quantityNeeded: 40,
    quantityFulfilled: 12,
    unit: "blankets",
    urgent: true,
  },
  {
    id: "need-3",
    orphanageId: "orph-2",
    type: "money",
    title: "Basic medicines and first-aid stock",
    description: "Restocking the medical cabinet for common illnesses.",
    amountNeeded: 8000,
    amountRaised: 1500,
    urgent: false,
  },
  {
    id: "need-4",
    orphanageId: "orph-2",
    type: "goods",
    title: "School notebooks and stationery",
    description: "For the new academic year, 21 children need full stationery sets.",
    quantityNeeded: 21,
    quantityFulfilled: 4,
    unit: "sets",
    urgent: false,
  },
  {
    id: "need-5",
    orphanageId: "orph-3",
    type: "money",
    title: "Roof repair before monsoon",
    description: "Part of the dormitory roof leaks badly during rains.",
    amountNeeded: 25000,
    amountRaised: 3200,
    urgent: true,
  },
  {
    id: "need-6",
    orphanageId: "orph-4",
    type: "goods",
    title: "Footwear for children",
    description: "Most children are without proper school shoes.",
    quantityNeeded: 19,
    quantityFulfilled: 2,
    unit: "pairs",
    urgent: false,
  },
];

export const volunteerRequests: VolunteerRequest[] = [
  {
    id: "vol-1",
    orphanageId: "orph-1",
    task: "Weekend English & Maths tutoring",
    description: "Looking for 2-3 volunteers to teach basic English and Maths on Saturdays.",
    date: "2026-07-25",
    slotsAvailable: 3,
    slotsFilled: 1,
  },
  {
    id: "vol-2",
    orphanageId: "orph-2",
    task: "Health check-up camp support",
    description: "Need volunteers to help coordinate a visiting doctor's check-up day.",
    date: "2026-08-02",
    slotsAvailable: 4,
    slotsFilled: 0,
  },
  {
    id: "vol-3",
    orphanageId: "orph-3",
    task: "Painting the common room",
    description: "A fun weekend activity — help us repaint and brighten up the common room.",
    date: "2026-08-09",
    slotsAvailable: 6,
    slotsFilled: 2,
  },
];
