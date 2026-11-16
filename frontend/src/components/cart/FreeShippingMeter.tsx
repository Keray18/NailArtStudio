"use client";

import React from "react";
import { MinimumOrderMeter, MinimumOrderMeterProps } from "./MinimumOrderMeter";

export type FreeShippingMeterProps = MinimumOrderMeterProps;

export const FreeShippingMeter: React.FC<FreeShippingMeterProps> = (props) => {
  return <MinimumOrderMeter {...props} />;
};

export { MinimumOrderMeter };
