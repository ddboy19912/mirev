export type AutopilotProfile = "safe" | "balanced" | "growth";

export type AllocationPercentages = {
  spendPercent: number;
  savePercent: number;
  earnPercent: number;
};

export const AUTOPILOT_PROFILES: Record<
  AutopilotProfile,
  AllocationPercentages & {
    label: "Safe" | "Balanced" | "Growth";
    description: string;
  }
> = {
  safe: {
    label: "Safe",
    description:
      "Preserve a larger liquid buffer and route only a small portion into Earn.",
    spendPercent: 60,
    savePercent: 30,
    earnPercent: 10,
  },
  balanced: {
    label: "Balanced",
    description:
      "Keep healthy liquidity while still routing a meaningful slice into Earn.",
    spendPercent: 45,
    savePercent: 30,
    earnPercent: 25,
  },
  growth: {
    label: "Growth",
    description:
      "Keep only a lean liquid buffer and push more idle USDC into Earn.",
    spendPercent: 30,
    savePercent: 20,
    earnPercent: 50,
  },
};

function toFixedAmount(value: number) {
  return value.toFixed(6);
}

export function isAutopilotProfile(value: string): value is AutopilotProfile {
  return value in AUTOPILOT_PROFILES;
}

export function calculateAllocation({
  totalAmount,
  profile,
}: {
  totalAmount: number;
  profile: AutopilotProfile;
}) {
  const selectedProfile = AUTOPILOT_PROFILES[profile];
  const spend = Number(
    ((totalAmount * selectedProfile.spendPercent) / 100).toFixed(6),
  );
  const save = Number(
    ((totalAmount * selectedProfile.savePercent) / 100).toFixed(6),
  );
  const earn = Number((totalAmount - spend - save).toFixed(6));

  return {
    profile: selectedProfile,
    spendAmount: toFixedAmount(spend),
    saveAmount: toFixedAmount(save),
    earnAmount: toFixedAmount(earn),
    totalAmount: toFixedAmount(totalAmount),
  };
}
