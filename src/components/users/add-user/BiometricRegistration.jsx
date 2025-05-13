import { useState } from "react";

function BiometricRegistration() {
  const [method, setMethod] = useState("");
  const [cardID, setCardID] = useState("");
  const [status, setStatus] = useState({ fingerprint: "", face: "", card: "" });

  const triggerHardware = (type) => {
    setStatus((prev) => ({ ...prev, [type]: "در حال اسکن..." }));
    // window.electron.ipcRenderer.send(`start-${type}-scan`);
  };

  return (
    <div className="w-full mt-6 p-4 border-t-2 border-gray-300">
      <h3 className="text-lg font-bold text-right text-darkBlue mb-4">ثبت روش شناسایی</h3>

      {/* Select Method */}
      <div className="flex justify-end gap-6 mb-4">
        <label className="flex items-center gap-2 text-gray-800">
          <input
            type="radio"
            name="authMethod"
            value="card"
            onChange={() => setMethod("card")}
          />
          کارت
        </label>
        <label className="flex items-center gap-2 text-gray-800">
          <input
            type="radio"
            name="authMethod"
            value="biometric"
            onChange={() => setMethod("biometric")}
          />
          بیومتریک
        </label>
        <label className="flex items-center gap-2 text-gray-800">
          <input
            type="radio"
            name="authMethod"
            value="both"
            onChange={() => setMethod("both")}
          />
          هر دو
        </label>
      </div>

      {/* Card Section */}
      {(method === "card" || method === "both") && (
        <div className="mb-4 text-right">
          <label className="block mb-2 text-sm font-semibold text-gray-700">شماره کارت</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={cardID}
              readOnly
              className="w-full px-4 py-3 border-2 rounded-xl border-gray-400 bg-transparent text-gray-800"
              placeholder="کارت را بکشید یا اسکن کنید"
            />
            <button
              onClick={() => triggerHardware("card")}
              className="px-4 py-2 rounded-xl bg-darkBlue text-white hover:bg-opacity-90"
            >
              خواندن کارت
            </button>
          </div>
          {status.card && <p className="text-sm mt-1 text-blue-600">{status.card}</p>}
        </div>
      )}

      {/* Biometric Section */}
      {(method === "biometric" || method === "both") && (
        <div className="grid sm:grid-cols-2 gap-4 text-right">
          {/* Fingerprint */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">اثر انگشت</label>
            <button
              onClick={() => triggerHardware("fingerprint")}
              className="w-full px-4 py-3 border-2 rounded-xl border-gray-400 text-darkBlue hover:bg-hoverBeige"
            >
              شروع اسکن اثر انگشت
            </button>
            {status.fingerprint && <p className="text-sm mt-1 text-blue-600">{status.fingerprint}</p>}
          </div>

          {/* Face Recognition */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">تشخیص چهره</label>
            <button
              onClick={() => triggerHardware("face")}
              className="w-full px-4 py-3 border-2 rounded-xl border-gray-400 text-darkBlue hover:bg-hoverBeige"
            >
              شروع اسکن چهره
            </button>
            {status.face && <p className="text-sm mt-1 text-blue-600">{status.face}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default BiometricRegistration;
