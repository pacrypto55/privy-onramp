import type { PluginRegistrationFn } from "@orderly.network/plugin-core";
import { registerWalletMenuItem } from "@pacrypto55/wallet-menu";
import { createOnrampMenuItem, type OnrampMenuItemOptions } from "./OnrampMenuItem";

export interface RegisterPrivyOnrampPluginOptions extends OnrampMenuItemOptions {}

/**
 * Registers the Privy on-ramp row into the shared "Privy Wallet" menu from
 * @pacrypto55/wallet-menu. Requires that host package to also be installed
 * and registered - this plugin has nothing to show on its own otherwise.
 *
 * Usage:
 * ```tsx
 * import { registerWalletMenuPlugin } from '@pacrypto55/wallet-menu';
 * import { registerPrivyOnrampPlugin } from '@pacrypto55/privy-onramp';
 *
 * <OrderlyAppProvider
 *   plugins={[registerWalletMenuPlugin(), registerPrivyOnrampPlugin()]}
 *   ...
 * >
 * ```
 */
export function registerPrivyOnrampPlugin(
  options: RegisterPrivyOnrampPluginOptions = {}
): PluginRegistrationFn {
  return (SDK) => {
    SDK.registerPlugin({
      id: "privy-onramp",
      name: "Privy On-ramp",
      interceptors: [registerWalletMenuItem(createOnrampMenuItem(options))],
    });
  };
}
