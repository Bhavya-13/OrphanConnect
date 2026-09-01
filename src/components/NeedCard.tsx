import { Need } from "@/lib/types";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/ProgressBar";

export default function NeedCard({ need }: { need: Need }) {
  return (
    <div className="border border-orange-100 rounded-2xl p-5 bg-white h-full hover:shadow-md hover:border-brand-300 hover:-translate-y-0.5 transition-all">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h4 className="font-semibold text-gray-900">{need.title}</h4>
        <div className="flex gap-1.5 shrink-0">
          <Badge variant="default">{need.type === "money" ? "Money" : "Goods"}</Badge>
          {need.urgent && <Badge variant="urgent">Urgent</Badge>}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{need.description}</p>

      {need.type === "money" ? (
        <>
          <ProgressBar current={need.amountRaised} total={need.amountNeeded} />
          <p className="text-sm text-gray-700 mt-2">
            Rs {need.amountRaised.toLocaleString()} raised of Rs {need.amountNeeded.toLocaleString()}
          </p>
        </>
      ) : (
        <>
          <ProgressBar current={need.quantityFulfilled} total={need.quantityNeeded} />
          <p className="text-sm text-gray-700 mt-2">
            {need.quantityFulfilled} of {need.quantityNeeded} {need.unit} fulfilled
          </p>
        </>
      )}

      <p className="mt-4 text-sm font-medium text-brand-600 flex items-center gap-1">
        Click to {need.type === "money" ? "donate" : "fulfill"}
        <span aria-hidden>&rarr;</span>
      </p>
    </div>
  );
}