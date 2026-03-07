import { useState } from "react";
import "./styles/global.css";
import Landing from "./pages/Landing";
import Timeline from "./pages/Timeline";
import CampaignDashboard from "./pages/CampaignDashboard";

export default function App() {
  const [page, setPage] = useState("landing");
  const [monthId, setMonthId] = useState("feb26");
  const [campaignSource, setCampaignSource] = useState("landing");

  const navigate = (target, param) => {
    if (target === "campaign") {
      setMonthId("all");
      setCampaignSource("landing");
      setPage("campaign");
    } else if (target === "campaign-month") {
      setMonthId(param);
      setCampaignSource("timeline");
      setPage("campaign");
    } else if (target === "timeline") {
      setPage("timeline");
    } else {
      setPage("landing");
    }
  };

  const goBack = () => setPage(page === "campaign" ? campaignSource : "landing");

  if (page === "timeline") return <Timeline onNavigate={navigate} onBack={() => setPage("landing")} />;
  if (page === "campaign") return <CampaignDashboard onBack={goBack} monthId={monthId} />;
  return <Landing onNavigate={navigate} />;
}
