import { Need } from "@/lib/types";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/ProgressBar";

export default function NeedCard({ need }: { need: Need }) {
  return (
    <div className="border border-orange-100 rounded-lg p-4 bg-white h-full">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-gray-800">{need.title}</h4>
        <div className="flex gap-2">
          <Badge variant="default">{need.type === "money" ? "Money" : "Goods"}</Badge>
          {need.urgent && <Badge variant="urgent">Urgent</Badge>}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{need.description}</p>

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

      <p className="mt-3 text-sm font-medium text-brand-600">
        Click to {need.type === "money" ? "donate" : "fulfill"} &rarr;
      </p>
    </div>
  );
}
