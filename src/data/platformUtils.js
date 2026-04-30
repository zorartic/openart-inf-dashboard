import { IG_CAMPAIGNS, igItemViews } from "./campaigns_ig";
import { YT_CAMPAIGNS } from "./campaigns_yt";
import { sumV, sumP } from "./utils";
import {
  OA_MAIN, OA_LAUNCH, OA_QRT_PAID, OA_QRT_PAID_COST, OA_QRT_FREE,
  NB_MAIN, NB_LAUNCH, NB_LAUNCH_FULL, NB_LAUNCH_MAR, NB_QRT_FREE, NB_PENDING,
  SD_LAUNCH, SR_LAUNCH, OS_LAUNCH, BH_LAUNCH, EC_LAUNCH,
  VL_MAIN, VL_LAUNCH, VL_QRT_PAID, VL_QRT_PAID_COST,
  KL3_LAUNCH, KL3C_LAUNCH, SO2_LAUNCH,
  OAW_MAIN, OAW_LAUNCH, OAW_QRT_PAID_COST, OAW_QRT_PAID_VIEWS,
  AIPA_LAUNCH_MAR, AIPA_LAUNCH_APR,
  SD2_MAIN, SD2_LAUNCH, SD2_QRT_PAID_COST, SD2_QRT_PAID_VIEWS,
  CB_MAIN, CB_LAUNCH,
  RF4_LAUNCH,
  WAN27_LAUNCH, IPS_LAUNCH, LTX_LAUNCH, LYRIA3_LAUNCH,
  BH_LAUNCH_APR, GPT2_LAUNCH, MV_LAUNCH, KL30_LAUNCH, SS_LAUNCH, HH_LAUNCH, MIT_LAUNCH, OAM_LAUNCH,
  CAMPAIGN_META,
} from "./campaigns";

export const PLATFORM_COLORS = {
  x:  { primary: "#1DA1F2", secondary: "#0a4a8f", gradient: "linear-gradient(135deg, #1DA1F2, #0a4a8f)",              gradientStr: "#1DA1F2, #0a4a8f",           label: "X (Twitter)" },
  ig: { primary: "#E1306C", secondary: "#833AB4", gradient: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)",     gradientStr: "#833AB4, #E1306C, #F77737",  label: "Instagram" },
  yt: { primary: "#FF0000", secondary: "#8B0000", gradient: "linear-gradient(135deg, #FF0000, #8B0000)",              gradientStr: "#FF0000, #8B0000",           label: "YouTube" },
};

// X data.
// For multi-month campaigns (nb, aipa), `byMonth` slices the data per-month.
// `views`/`spend`/`mainData`/`launchPosts` at top level are cumulative across all months.
const X_STATS_MAP = {
  oa: {
    views: sumV([...OA_MAIN, ...OA_LAUNCH, ...OA_QRT_PAID, ...OA_QRT_FREE]),
    spend: sumP([...OA_MAIN, ...OA_LAUNCH]) + OA_QRT_PAID_COST,
    mainData: OA_MAIN, hasInfluencers: true, launchPosts: OA_LAUNCH,
    qrtPaid: OA_QRT_PAID, qrtFree: OA_QRT_FREE, qrtPaidCost: OA_QRT_PAID_COST,
  },
  nb: {
    views: sumV([...NB_MAIN, ...NB_LAUNCH_FULL, ...NB_QRT_FREE]),
    spend: sumP([...NB_MAIN, ...NB_LAUNCH_FULL]) + sumP(NB_PENDING),
    mainData: NB_MAIN, hasInfluencers: true, launchPosts: NB_LAUNCH_FULL,
    qrtFree: NB_QRT_FREE, pending: NB_PENDING, pendingSpend: sumP(NB_PENDING),
    byMonth: {
      feb26: {
        views: sumV([...NB_MAIN, ...NB_LAUNCH, ...NB_QRT_FREE]),
        spend: sumP([...NB_MAIN, ...NB_LAUNCH]) + sumP(NB_PENDING),
        mainData: NB_MAIN, hasInfluencers: true, launchPosts: NB_LAUNCH,
        qrtFree: NB_QRT_FREE, pending: NB_PENDING, pendingSpend: sumP(NB_PENDING),
      },
      mar26: {
        views: sumV(NB_LAUNCH_MAR),
        spend: sumP(NB_LAUNCH_MAR),
        mainData: [], hasInfluencers: false, launchPosts: NB_LAUNCH_MAR,
        qrtFree: [], pending: [], pendingSpend: 0,
      },
    },
  },
  sd:   { views: sumV(SD_LAUNCH),   spend: sumP(SD_LAUNCH),   mainData: [], hasInfluencers: false, launchPosts: SD_LAUNCH },
  sr:   { views: sumV(SR_LAUNCH),   spend: sumP(SR_LAUNCH),   mainData: [], hasInfluencers: false, launchPosts: SR_LAUNCH },
  os:   { views: sumV(OS_LAUNCH),   spend: sumP(OS_LAUNCH),   mainData: [], hasInfluencers: false, launchPosts: OS_LAUNCH },
  bh: {
    views: sumV(BH_LAUNCH) + sumV(BH_LAUNCH_APR),
    spend: sumP(BH_LAUNCH) + sumP(BH_LAUNCH_APR),
    mainData: [], hasInfluencers: false,
    launchPosts: [...BH_LAUNCH, ...BH_LAUNCH_APR],
    byMonth: {
      mar26: { views: sumV(BH_LAUNCH),     spend: sumP(BH_LAUNCH),     mainData: [], hasInfluencers: false, launchPosts: BH_LAUNCH },
      apr26: { views: sumV(BH_LAUNCH_APR), spend: sumP(BH_LAUNCH_APR), mainData: [], hasInfluencers: false, launchPosts: BH_LAUNCH_APR },
    },
  },
  ec:   { views: sumV(EC_LAUNCH),   spend: sumP(EC_LAUNCH),   mainData: [], hasInfluencers: false, launchPosts: EC_LAUNCH },
  kl3:  { views: sumV(KL3_LAUNCH),  spend: sumP(KL3_LAUNCH),  mainData: [], hasInfluencers: false, launchPosts: KL3_LAUNCH },
  kl3c: { views: sumV(KL3C_LAUNCH), spend: sumP(KL3C_LAUNCH), mainData: [], hasInfluencers: false, launchPosts: KL3C_LAUNCH },
  so2:  { views: sumV(SO2_LAUNCH),  spend: sumP(SO2_LAUNCH),  mainData: [], hasInfluencers: false, launchPosts: SO2_LAUNCH },
  vl: {
    views: sumV(VL_MAIN) + sumV(VL_LAUNCH) + sumV(VL_QRT_PAID),
    spend: sumP(VL_MAIN) + sumP(VL_LAUNCH) + VL_QRT_PAID_COST,
    mainData: VL_MAIN, hasInfluencers: true, launchPosts: VL_LAUNCH,
    qrtPaid: VL_QRT_PAID, qrtPaidCost: VL_QRT_PAID_COST,
  },
  oaw: {
    views: sumV(OAW_MAIN) + sumV(OAW_LAUNCH) + OAW_QRT_PAID_VIEWS,
    spend: sumP(OAW_MAIN) + sumP(OAW_LAUNCH) + OAW_QRT_PAID_COST,
    mainData: OAW_MAIN, hasInfluencers: true, launchPosts: OAW_LAUNCH,
    qrtPaidViews: OAW_QRT_PAID_VIEWS, qrtPaidCost: OAW_QRT_PAID_COST,
  },
  aipa: {
    views: sumV([...AIPA_LAUNCH_MAR, ...AIPA_LAUNCH_APR]),
    spend: sumP([...AIPA_LAUNCH_MAR, ...AIPA_LAUNCH_APR]),
    mainData: [], hasInfluencers: false,
    launchPosts: [...AIPA_LAUNCH_MAR, ...AIPA_LAUNCH_APR],
    byMonth: {
      mar26: {
        views: sumV(AIPA_LAUNCH_MAR), spend: sumP(AIPA_LAUNCH_MAR),
        mainData: [], hasInfluencers: false, launchPosts: AIPA_LAUNCH_MAR,
      },
      apr26: {
        views: sumV(AIPA_LAUNCH_APR), spend: sumP(AIPA_LAUNCH_APR),
        mainData: [], hasInfluencers: false, launchPosts: AIPA_LAUNCH_APR,
      },
    },
  },
  sd2: {
    views: sumV(SD2_MAIN) + sumV(SD2_LAUNCH) + SD2_QRT_PAID_VIEWS,
    spend: sumP(SD2_MAIN) + sumP(SD2_LAUNCH) + SD2_QRT_PAID_COST,
    mainData: SD2_MAIN, hasInfluencers: true, launchPosts: SD2_LAUNCH,
    qrtPaidViews: SD2_QRT_PAID_VIEWS, qrtPaidCost: SD2_QRT_PAID_COST,
  },
  cb: {
    views: sumV(CB_MAIN) + sumV(CB_LAUNCH),
    spend: sumP(CB_MAIN) + sumP(CB_LAUNCH),
    mainData: CB_MAIN, hasInfluencers: true, launchPosts: CB_LAUNCH,
  },
  rf4: { views: sumV(RF4_LAUNCH), spend: sumP(RF4_LAUNCH), mainData: [], hasInfluencers: false, launchPosts: RF4_LAUNCH },
  wan27:  { views: sumV(WAN27_LAUNCH),  spend: sumP(WAN27_LAUNCH),  mainData: [], hasInfluencers: false, launchPosts: WAN27_LAUNCH },
  ips:    { views: sumV(IPS_LAUNCH),    spend: sumP(IPS_LAUNCH),    mainData: [], hasInfluencers: false, launchPosts: IPS_LAUNCH },
  ltx:    { views: sumV(LTX_LAUNCH),    spend: sumP(LTX_LAUNCH),    mainData: [], hasInfluencers: false, launchPosts: LTX_LAUNCH },
  lyria3: { views: sumV(LYRIA3_LAUNCH), spend: sumP(LYRIA3_LAUNCH), mainData: [], hasInfluencers: false, launchPosts: LYRIA3_LAUNCH },
  gpt2:   { views: sumV(GPT2_LAUNCH),   spend: sumP(GPT2_LAUNCH),   mainData: [], hasInfluencers: false, launchPosts: GPT2_LAUNCH },
  mv:     { views: sumV(MV_LAUNCH),     spend: sumP(MV_LAUNCH),     mainData: [], hasInfluencers: false, launchPosts: MV_LAUNCH },
  kl30:   { views: sumV(KL30_LAUNCH),   spend: sumP(KL30_LAUNCH),   mainData: [], hasInfluencers: false, launchPosts: KL30_LAUNCH },
  ss:     { views: sumV(SS_LAUNCH),     spend: sumP(SS_LAUNCH),     mainData: [], hasInfluencers: false, launchPosts: SS_LAUNCH },
  hh:     { views: sumV(HH_LAUNCH),     spend: sumP(HH_LAUNCH),     mainData: [], hasInfluencers: false, launchPosts: HH_LAUNCH },
  mit:    { views: sumV(MIT_LAUNCH),    spend: sumP(MIT_LAUNCH),    mainData: [], hasInfluencers: false, launchPosts: MIT_LAUNCH },
  oam:    { views: sumV(OAM_LAUNCH),    spend: sumP(OAM_LAUNCH),    mainData: [], hasInfluencers: false, launchPosts: OAM_LAUNCH },
};

const EMPTY_X = { views: 0, spend: 0, mainData: [], hasInfluencers: false, launchPosts: [] };
const EMPTY_LIST = { views: 0, spend: 0, count: 0, data: [] };

export function xStats(campaignId, monthId = null) {
  const entry = X_STATS_MAP[campaignId];
  if (!entry) return EMPTY_X;
  if (!monthId) return entry;
  if (entry.byMonth?.[monthId]) return entry.byMonth[monthId];
  // Single-month campaign. If monthId matches, return full; else empty.
  const months = CAMPAIGN_META[campaignId]?.months || [];
  return months.includes(monthId) ? entry : EMPTY_X;
}

export function igStats(campaignId, monthId = null) {
  const c = IG_CAMPAIGNS[campaignId];
  if (!c) return EMPTY_LIST;
  if (monthId) {
    const months = CAMPAIGN_META[campaignId]?.months || [];
    if (!months.includes(monthId)) return EMPTY_LIST;
  }
  const data = c.data || [];
  // Total views + cpm-eligible views/spend split out so carousel items can
  // contribute to total spend without distorting CPM (their impressions
  // aren't trackable). `views` here = trackable (non-carousel) views, used
  // as both the headline "Total Views" and the CPM denominator.
  let cpmViews = 0, cpmSpend = 0, totalSpend = 0;
  data.forEach(i => {
    totalSpend += i.price || 0;
    if (i.carousel) return;
    cpmViews += igItemViews(i);
    cpmSpend += i.price || 0;
  });
  return {
    views: cpmViews,
    spend: totalSpend,
    cpmViews, cpmSpend,
    count: data.length,
    data,
  };
}

export function ytStats(campaignId, monthId = null) {
  const c = YT_CAMPAIGNS[campaignId];
  if (!c) return EMPTY_LIST;
  if (monthId) {
    const months = CAMPAIGN_META[campaignId]?.months || [];
    if (!months.includes(monthId)) return EMPTY_LIST;
  }
  const data = c.data || [];
  return { views: sumV(data), spend: sumP(data), count: data.length, data };
}

export function igAgencyBreakdown(campaignId) {
  const data = IG_CAMPAIGNS[campaignId]?.data || [];
  const byAgency = {};
  data.forEach(item => {
    const ag = item.agency || "Direct";
    if (!byAgency[ag]) byAgency[ag] = { count: 0, views: 0, spend: 0 };
    byAgency[ag].count++;
    byAgency[ag].views += item.carousel ? 0 : igItemViews(item);
    byAgency[ag].spend += item.price || 0;
  });
  return byAgency;
}

export const X_CAMPAIGN_IDS = Object.keys(X_STATS_MAP);
export const IG_CAMPAIGN_IDS = Object.keys(IG_CAMPAIGNS);
export const YT_CAMPAIGN_IDS = Object.keys(YT_CAMPAIGNS);

export function getCampaignIds(platform, monthId = null) {
  let base;
  if (platform === "x") base = X_CAMPAIGN_IDS;
  else if (platform === "ig") base = IG_CAMPAIGN_IDS;
  else if (platform === "yt") base = YT_CAMPAIGN_IDS;
  else return [];
  if (!monthId) return base;
  return base.filter(id => CAMPAIGN_META[id]?.months?.includes(monthId));
}

export function getPlatformStats(platform, campaignId, monthId = null) {
  if (platform === "x")  return xStats(campaignId, monthId);
  if (platform === "ig") return igStats(campaignId, monthId);
  if (platform === "yt") return ytStats(campaignId, monthId);
  return { views: 0, spend: 0 };
}
