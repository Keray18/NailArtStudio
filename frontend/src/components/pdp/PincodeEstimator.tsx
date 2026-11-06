"use client";

import React, { useState } from "react";
import { Truck, Check, AlertCircle } from "lucide-react";
import { catalogueService } from "@/services/catalogueService";

export const PincodeEstimator: React.FC = () => {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{
    city: string;
    state: string;
    estimatedDays: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!pincode || pincode.trim().length !== 6 || !/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit Indian postal pincode.");
      return;
    }

    setIsChecking(true);
    try {
      const data = await catalogueService.validatePincode(pincode);
      if (data.isServiceable) {
        setResult({
          city: data.city,
          state: data.state,
          estimatedDays: data.estimatedDays,
        });
      } else {
        setError("This pincode is currently unserviceable.");
      }
    } catch {
      setError("Could not check delivery estimate at this time.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-ivory-subtle/50 p-4 rounded-lg border border-blush/60">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-espresso">
        <Truck className="w-4 h-4 text-rose" />
        <span>Delivery Pincode Checker</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit pincode (e.g. 152116)"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          className="flex-1 bg-white border border-blush rounded px-3 py-2 text-xs text-espresso focus-ring"
        />
        <button
          type="submit"
          disabled={isChecking || pincode.length !== 6}
          className="px-4 py-2 bg-espresso hover:bg-espresso-light text-white text-xs font-medium rounded transition-colors disabled:opacity-50 focus-ring"
        >
          {isChecking ? "Checking..." : "Check"}
        </button>
      </form>

      {error && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-status-error font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-2.5 pt-2 border-t border-blush/40 flex items-start gap-2 text-xs text-espresso/90">
          <Check className="w-4 h-4 text-status-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-espresso">
              Estimated Delivery: {result.estimatedDays}
            </p>
            <p className="text-[11px] text-espresso/60">
              Delivering to {result.city}, {result.state} &bull; Dispatched from Abohar Studio
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

