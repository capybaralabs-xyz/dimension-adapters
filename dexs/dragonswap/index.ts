import { Chain } from "@defillama/sdk/build/types";
import { BaseAdapter, BreakdownAdapter, IJSON } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { getGraphDimensions2 } from "../../helpers/getUniSubgraph";

const endpoints = {
  [CHAIN.KLAYTN]: "https://gateway.graph.dgswap.io/dgswap-exchange-v2-kaia",
};

const v3Endpoint = {
  [CHAIN.KLAYTN]: "https://gateway.graph.dgswap.io/dgswap-exchange-v3-kaia",
};

const startTimes = {
  [CHAIN.KLAYTN]: 1707297572,
} as IJSON<number>;

const v3StartTimes = {
  [CHAIN.KLAYTN]: 1707297572,
} as IJSON<number>;

const methodology = {
  UserFees: "User pays 0.3% fees on each swap.",
  ProtocolRevenue: "Treasury receives 0.06% of each swap.",
  SupplySideRevenue: "LPs receive 0.24% of the fees.",
  HoldersRevenue: "",
  Revenue: "All revenue generated comes from user fees.",
  Fees: "All fees comes from the user."
}

const graphs = getGraphDimensions2({
  graphUrls: endpoints,
  graphRequestHeaders: {
    [CHAIN.KLAYTN]: {
      "origin": "https://dgswap.io",
    },
  },
  totalVolume: {
    factory: "pancakeFactories"
  },
  feesPercent: {
    type: "volume",
    Fees: 0.3,
    ProtocolRevenue: 0.06,
    HoldersRevenue: 0,
    UserFees: 0.3,
    SupplySideRevenue: 0.24,
    Revenue: 0.06
  }
});

const v3Graph = getGraphDimensions2({
  graphUrls: v3Endpoint,
  totalVolume: {
    factory: "factories",
  },
  totalFees: {
    factory: "factories",
  },
});

const adapter: BreakdownAdapter = {
  version: 2,
  breakdown: {
    v2: Object.keys(endpoints).reduce((acc, chain) => {
      acc[chain] = {
        fetch: graphs(chain as Chain),
        start: startTimes[chain],
        meta: {
          methodology
        }
      }
      return acc
    }, {} as BaseAdapter),
    v3: Object.keys(v3Endpoint).reduce((acc, chain) => {
      acc[chain] = {
        fetch: v3Graph(chain),
        start: v3StartTimes[chain],
      }
      return acc
    }, {} as BaseAdapter),
  },
};

export default adapter;
