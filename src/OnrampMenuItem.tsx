import { useCallback, useState } from "react";
import { useFundWallet, useWallets, type FundWalletConfig } from "@privy-io/react-auth";
import { DropdownMenuItem, toast } from "@orderly.network/ui";
import type { WalletMenuItemProps } from "@pacrypto55/wallet-menu";

export interface OnrampMenuItemOptions {
  /** Row label. @default "Buy USDC" */
  label?: string;
  /** Passed straight through to Privy's fundWallet(). @default { asset: "USDC", amount: "10" } */
  fundWalletConfig?: FundWalletConfig;
}

// Privy's own error text when the connected App ID has no funding provider
// (Moonpay, Coinbase Onramp, ...) configured in its Dashboard. This is a
// per-App server-side setting - no client-side config can turn it on, so a
// generic "something went wrong" toast would just send the DEX operator on
// a wild goose chase. Match on it and point them at the actual fix instead.
const FUNDING_NOT_ENABLED_MESSAGE = "wallet funding is not enabled";

function describeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.toLowerCase().includes(FUNDING_NOT_ENABLED_MESSAGE)) {
    return "Buy USDC isn't set up yet: this DEX's Privy account has no funding provider connected. The DEX operator needs to enable one (e.g. MoonPay) under Configuration → Funding in the Privy Dashboard.";
  }
  return `Couldn't open the funding flow: ${message}`;
}

export function createOnrampMenuItem({
  label = "Buy USDC",
  fundWalletConfig = { asset: "USDC", amount: "10" },
}: OnrampMenuItemOptions = {}) {
  return function OnrampMenuItem({ closeMenu }: WalletMenuItemProps) {
    const { wallets } = useWallets();
    const { fundWallet } = useFundWallet();
    const [loading, setLoading] = useState(false);

    const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");

    const handleBuy = useCallback(async () => {
      if (!embeddedWallet) return;
      try {
        setLoading(true);
        closeMenu();
        await fundWallet(embeddedWallet.address, fundWalletConfig);
      } catch (error) {
        console.error("[privy-onramp] fundWallet failed:", error);
        toast.error(describeError(error));
      } finally {
        setLoading(false);
      }
    }, [embeddedWallet, fundWallet, closeMenu]);

    if (!embeddedWallet) {
      return null;
    }

    return (
      <DropdownMenuItem size="lg" disabled={loading} onSelect={handleBuy}>
        {loading ? "Opening..." : label}
      </DropdownMenuItem>
    );
  };
}
