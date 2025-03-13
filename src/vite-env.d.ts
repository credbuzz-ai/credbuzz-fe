
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_USDC_ADDRESS: string;
  readonly VITE_OWNER_ADDRESS: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_TEST_API_KEY: string;
  readonly VITE_SOURCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
