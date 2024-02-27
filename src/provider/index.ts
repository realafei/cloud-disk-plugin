import type { Ref } from "vue";
import type Provider from "@/provider/type";

import { ref } from "vue";
import ProviderAli from "./lib/ali";
import ProviderBaidu from "./lib/baidu";
import ProviderQuark from "./lib/quark";

export const getProvider = ((instance?: Provider) => {
  return (): Promise<Provider> => {
    if (instance) {
      return Promise.resolve(instance);
    }
    if (ProviderAli.test()) {
      instance = new ProviderAli();
    } else if (ProviderBaidu.test()) {
      instance = new ProviderBaidu();
    } else if (ProviderQuark.test()) {
      instance = new ProviderQuark();
    }
    return instance ? Promise.resolve(instance) : Promise.reject();
  };
})();

export const getProviderRef = ((instanceRef?: Ref<Provider>) => {
  return (): Promise<Ref<Provider>> => {
    if (!instanceRef) {
      return getProvider().then((res: Provider) => {
        instanceRef = ref(res) as Ref<Provider>;
        return instanceRef;
      });
    }
    return Promise.resolve(instanceRef);
  };
})();

export default getProvider;
