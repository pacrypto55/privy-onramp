# @pacrypto55/privy-onramp

Privy on-ramp for Orderly Network DEXes. Lets a connected user buy crypto straight into their Privy embedded wallet ("Buy USDC" by default). Adds itself as a row in the shared **[@pacrypto55/wallet-menu](https://www.npmjs.com/package/@pacrypto55/wallet-menu)** "Privy Wallet" button — installing this plugin alone is enough, it registers the host automatically if it isn't already.

## ⚠️ Before you install: enable funding in the Privy Dashboard

This plugin calls Privy's own `fundWallet()`. Privy will refuse every call with **`Error: Wallet funding is not enabled`** unless your app's Privy account has a funding provider (MoonPay, Coinbase Onramp, ...) actually connected. This is a **server-side setting on your Privy App ID**, not something this plugin — or any client-side config — can turn on.

Fix it once, before testing:

1. Go to the [Privy Dashboard](https://dashboard.privy.io) → your App → **Configuration → Funding**.
2. Connect and enable at least one provider (e.g. MoonPay).
3. If your app also restricts login/embedded-wallet origins, make sure the domain you're testing on is in the allowed list too (**Configuration → Domains**).

If you skip this, the plugin still installs and renders correctly — clicking "Buy USDC" will just show a toast explaining exactly this, instead of failing silently.

## Install

```bash
npm install @pacrypto55/privy-onramp
# or
pnpm add @pacrypto55/privy-onramp
# or
yarn add @pacrypto55/privy-onramp
```

Peer dependencies: `react`, `react-dom`, `@privy-io/react-auth`, `@orderly.network/plugin-core`, `@orderly.network/ui`, and `@pacrypto55/wallet-menu` (all installed automatically alongside it).

## Usage

```tsx
import { registerPrivyOnrampPlugin } from "@pacrypto55/privy-onramp";

<OrderlyAppProvider
  plugins={[registerPrivyOnrampPlugin() /* , ...your other plugins */]}
  // ...
>
  {/* your app */}
</OrderlyAppProvider>;
```

That's it — no manual wiring needed. The "Privy Wallet" button appears in the top nav bar the first time any plugin that depends on it (this one, or [@pacrypto55/privy-2fa](https://www.npmjs.com/package/@pacrypto55/privy-2fa)) is registered.

### With custom options

```tsx
registerPrivyOnrampPlugin({
  label: "Buy USDC",              // row label
  fundWalletConfig: {              // passed straight through to Privy's fundWallet()
    asset: "USDC",
    amount: "10",
  },
})
```

## API

### `registerPrivyOnrampPlugin(options?)`

| Property | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `"Buy USDC"` | Row label shown in the Privy Wallet dropdown. |
| `fundWalletConfig` | `FundWalletConfig` (from `@privy-io/react-auth`) | `{ asset: "USDC", amount: "10" }` | Forwarded as-is to Privy's `fundWallet()`. |

## Development

```bash
npm install
npm run dev         # tsup --watch
npm run build
npm run typecheck
```

## License

MIT
