import type { PluginRegistrationFn } from "@orderly.network/plugin-core";
import { registerWalletMenuItem, registerWalletMenuPlugin } from "@pacrypto55/wallet-menu";
import { createOnrampMenuItem, type OnrampMenuItemOptions } from "./OnrampMenuItem";

export interface RegisterPrivyOnrampPluginOptions extends OnrampMenuItemOptions {}

/**
 * Registers the Privy on-ramp row into the shared "Privy Wallet" menu from
 * @pacrypto55/wallet-menu. Also defensively registers that host plugin
 * itself (WalletMenuButton self-dedupes if it's already been registered
 * some other way), so installing this plugin alone is enough - operators
 * don't need to know @pacrypto55/wallet-menu exists as a separate package.
 *
 * Usage:
 * ```tsx
 * import { registerPrivyOnrampPlugin } from '@pacrypto55/privy-onramp';
 *
 * <OrderlyAppProvider
 *   plugins={[registerPrivyOnrampPlugin()]}
 *   ...
 * >
 * ```
 */
export function registerPrivyOnrampPlugin(
  options: RegisterPrivyOnrampPluginOptions = {}
): PluginRegistrationFn {
  return (SDK) => {
    registerWalletMenuPlugin()(SDK);
    SDK.registerPlugin({
      id: "privy-onramp",
      name: "Privy On-ramp",
      onError: (error: Error) => {
        console.error("[privy-onramp] plugin error:", error.message, error.stack);
      },
      interceptors: [registerWalletMenuItem(createOnrampMenuItem(options))],
    });
  };
}
