import { useState } from "react";
import "./styles/global.css";
import Landing from "./pages/Landing";
import Timeline from "./pages/Timeline";
import Platform from "./pages/Platform";
import PlatformDetail from "./pages/PlatformDetail";
import CampaignCrossView from "./pages/CampaignCrossView";
import MonthCrossView from "./pages/MonthCrossView";
import CampaignsCrossView from "./pages/CampaignsCrossView";

export default function App() {
  const [history, setHistory] = useState([{ page: "landing" }]);
  const current = history[history.length - 1];
  const canBack = history.length > 1;

  const push = (entry) => setHistory(h => [...h, entry]);
  const back = () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h);
  const home = () => setHistory([{ page: "landing" }]);

  const navigate = (target, param, extra = {}) => {
    if (target === "landing") { home(); return; }
    if (target === "timeline") { push({ page: "timeline" }); return; }
    if (target === "platform")  { push({ page: "platform" }); return; }
    if (target === "campaigns") { push({ page: "campaigns" }); return; }
    if (target === "month-cross") { push({ page: "month-cross", monthId: param }); return; }
    if (target === "campaign-cross") { push({ page: "campaign-cross", campaignId: param }); return; }
    if (target === "platform-detail") {
      push({ page: "platform-detail", platformId: param || "x", ...extra });
      return;
    }
  };

  const nav = { onBack: back, onHome: home, canBack };

  if (current.page === "timeline") {
    return <Timeline onNavigate={navigate} {...nav} />;
  }
  if (current.page === "platform") {
    return <Platform onNavigate={navigate} {...nav} />;
  }
  if (current.page === "campaigns") {
    return (
      <CampaignsCrossView
        onPickCampaign={(id) => navigate("campaign-cross", id)}
        {...nav}
      />
    );
  }
  if (current.page === "platform-detail") {
    return (
      <PlatformDetail
        platform={current.platformId}
        initialCampaign={current.initialCampaign}
        monthId={current.monthId}
        {...nav}
      />
    );
  }
  if (current.page === "campaign-cross") {
    return (
      <CampaignCrossView
        campaignId={current.campaignId}
        onPickPlatform={(platform, cid) =>
          navigate("platform-detail", platform, { initialCampaign: cid })
        }
        {...nav}
      />
    );
  }
  if (current.page === "month-cross") {
    return (
      <MonthCrossView
        monthId={current.monthId}
        onPickPlatform={(platform, mid) =>
          navigate("platform-detail", platform, { monthId: mid })
        }
        {...nav}
      />
    );
  }
  return <Landing onNavigate={navigate} />;
}
