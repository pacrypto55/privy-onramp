import { useCallback, useState } from "react";
import { useFundWallet, useWallets, type FundWalletConfig } from "@privy-io/react-auth";
import { DropdownMenuItem } from "@orderly.network/ui";
import type { WalletMenuItemProps } from "@pacrypto55/wallet-menu";

export interface OnrampMenuItemOptions {
  /** Row label. @default "Buy USDC" */
  label?: string;
  /** Passed straight through to Privy's fundWallet(). @default { asset: "USDC", amount: "10" } */
  fundWalletConfig?: FundWalletConfig;
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
