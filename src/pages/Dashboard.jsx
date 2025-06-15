import DashboardItems from "../components/dashboard/DashboardItems";
import { useTheme } from "../context/ThemeContext";

export default function DashboardPage() {
  const { activeTheme , themes } = useTheme();
  const {background} = themes[activeTheme].colors;

  return (
    <div className={`bg-${background} h-screen`}>
      <DashboardItems />
    </div>
  );
}
