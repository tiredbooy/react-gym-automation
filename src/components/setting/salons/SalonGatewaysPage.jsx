import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Store from "electron-store";
import SalonForm from "./SalonForm";
import GatewayForm from "./GatewayForm";
import SalonList from "./SalonList";
import GatewayList from "./GatewayList";

const store = new Store();

export default function SalonGatewaysPage() {
  const [salons, setSalons] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [devices, setDevices] = useState([]);

  // Load data from electron-store on mount
  useEffect(() => {
    const storedSalons = store.get("salons") || [];
    const storedGateways = store.get("gateways") || [];
    const storedDevices = store.get("devices") || [];
    setSalons(storedSalons);
    setGateways(storedGateways);
    setDevices(storedDevices);
  }, []);

  // Save salons to electron-store
  useEffect(() => {
    store.set("salons", salons);
  }, [salons]);

  // Save gateways to electron-store
  useEffect(() => {
    store.set("gateways", gateways);
  }, [gateways]);

  const addSalon = (salon) => {
    setSalons([...salons, { ...salon, id: `salon-${Date.now()}` }]);
  };

  const updateSalon = (updatedSalon) => {
    setSalons(salons.map((s) => (s.id === updatedSalon.id ? updatedSalon : s)));
  };

  const deleteSalon = (id) => {
    setSalons(salons.filter((s) => s.id !== id));
    setGateways(gateways.filter((g) => g.salonId !== id)); // Remove linked gateways
  };

  const addGateway = (gateway) => {
    setGateways([...gateways, { ...gateway, id: `gateway-${Date.now()}` }]);
  };

  const updateGateway = (updatedGateway) => {
    setGateways(
      gateways.map((g) => (g.id === updatedGateway.id ? updatedGateway : g))
    );
  };

  const deleteGateway = (id) => {
    setGateways(gateways.filter((g) => g.id !== id));
  };

  //   const testGateway = (gateway) => {
  //     // Simulate gateway test (replace with real hardware call in Electron)
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve({ status: "success", message: "درگاه با موفقیت تست شد" });
  //       }, 1000);
  //     });
  //   };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-offWhite min-h-screen"
    >
      <h1 className="text-2xl font-bold text-nearBlack mb-6 text-center">
        تنظیمات سالن و درگاه‌ها
      </h1>
      <div className="space-y-8">
        <SalonForm onAddSalon={addSalon} />
        <SalonList
          salons={salons}
          gateways={gateways}
          onUpdateSalon={updateSalon}
          onDeleteSalon={deleteSalon}
        />
        <GatewayForm
          onAddGateway={addGateway}
          salons={salons}
          devices={devices}
        />
        <GatewayList
          gateways={gateways}
          salons={salons}
          devices={devices}
          onUpdateGateway={updateGateway}
          onDeleteGateway={deleteGateway}
          onTestGateway={testGateway}
        />
      </div>
    </motion.div>
  );
}
