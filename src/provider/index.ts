import type { Ref } from "vue";
import type Provider from "@/provider/type";

import { ref } from "vue";
import ProviderAli from "./lib/ali";
import ProviderBaidu from "./lib/baidu";
import ProviderQuark from "./lib/quark";

export let provider: Provider;
export const getProvider = (): Provider | undefined => {
  if (ProviderAli.test()) {
    provider = provider instanceof ProviderAli ? provider : new ProviderAli();
  } else if (ProviderBaidu.test()) {
    provider =
      provider instanceof ProviderBaidu ? provider : new ProviderBaidu();
  } else if (ProviderQuark.test()) {
    provider =
      provider instanceof ProviderQuark ? provider : new ProviderQuark();
  } else {
    return undefined;
  }
  return provider;
};

export let providerRef: Ref<Provider | undefined>;
export const getProviderRef = (): Ref<Provider | undefined> => {
  const instance = getProvider();

  if (!providerRef) {
    providerRef = ref();
  }

  if ((!providerRef.value && instance) || (providerRef.value && !instance)) {
    providerRef.value = instance;
  }

  return providerRef as Ref<Provider | undefined>;
};

export default getProvider;
