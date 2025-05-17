import DashboardItems from "../components/dashboard/DashboardItems";
import { useTheme } from "../context/ThemeContext";

export default function DashboardPage() {
  const { activeTheme , themes } = useTheme();
  const theme = themes[activeTheme];
  return (
    <div className={`bg-${theme.colors.background} h-screen`}>
      <DashboardItems />
    </div>
  );
}
