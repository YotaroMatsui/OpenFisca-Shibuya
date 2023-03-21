import { useState, useEffect } from "react";
import { OpenFiscaForm } from "./components/form";
import { HouseholdContext } from "./contexts/HouseholdContext";
import { YourselfContext } from "./contexts/YourselfContext";
import { CurrentDateContext } from "./contexts/CurrentDateContext";
import { APIServerURLContext } from "./contexts/APIServerURLContext";
import { AllowanceContext } from "./contexts/AllowanceContext";

function App() {
  const currentDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

  const lastYearDate = `${new Date().getFullYear() - 1}-${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-01`;

  const apiURL =
    import.meta.env.MODE === "production"
      ? "https://openfisca-shibuya-deploy-test-cidt7ibyvq-uc.a.run.app" // Cloud Run
      : "http://localhost:50000";

  const [yourself, setYourself] = useState({
    誕生年月日: undefined,
    身体障害者手帳がある: undefined,
    精神障害者保健福祉手帳がある: undefined,
    療養手帳がある: undefined,
    配偶者がいる: undefined,
    子どもの数: 0,
  });
  const yourselfContextValue = {
    yourself,
    setYourself,
  };

  const [household, setHousehold] = useState({
    世帯員: {
      あなた: {
        誕生年月日: { ETERNITY: "" },
        収入: {
          [currentDate]: 0,
        },
        身体障害者手帳等級認定: { ETERNITY: "無" },
        // 身体障害者手帳交付年月日は入力作業を省略させるため昨年の日付を設定
        // (身体障害者手帳等級認定は身体障害者手帳交付年月日から2年以内が有効)
        身体障害者手帳交付年月日: { ETERNITY: lastYearDate },
        愛の手帳等級: { ETERNITY: "無" },
        精神障害者保健福祉手帳等級: { ETERNITY: "無" },
      },
    },
    世帯: {
      世帯1: {
        保護者一覧: ["あなた"],
        児童手当: {
          [currentDate]: null,
        },
        児童扶養手当: {
          [currentDate]: null,
        },
        児童育成手当: {
          [currentDate]: null,
        },
        特別児童扶養手当_最小: {
          [currentDate]: null,
        },
        特別児童扶養手当_最大: {
          [currentDate]: null,
        },
        障害児童育成手当: {
          [currentDate]: null,
        },
        障害児福祉手当: {
          [currentDate]: null,
        },
      },
    },
  });
  const householdContextValue = {
    household,
    setHousehold,
  };
  const [allowanceContextValue, setAllowance] = useState<any>();

  useEffect(() => {
    (async () => {
      // variablesから手当の情報のみ抽出
      const linkPrefix: string = "（渋谷区HP）";
      const variablesRes = await fetch(`${apiURL}/variables`);
      const variablesJson = await variablesRes.json();
      const allowanceMap = new Map<string, any>();
      allowanceMap.set("linkPrefix", linkPrefix);
      for (const [key, value] of Object.entries(variablesJson)) {
        const variableRes = await fetch(`${apiURL}/variable/${key}`);
        const variableJson = await variableRes.json();
        if (
          Object.hasOwn(variableJson, "formulas") &&
          Object.hasOwn(variableJson, "references")
        ) {
          allowanceMap.set(variableJson.id, variableJson);
        }
      }
      setAllowance(allowanceMap);
    })();
  }, []);

  return (
    <APIServerURLContext.Provider value={apiURL}>
      <CurrentDateContext.Provider value={currentDate}>
        <YourselfContext.Provider value={yourselfContextValue}>
          <HouseholdContext.Provider value={householdContextValue}>
            <AllowanceContext.Provider value={allowanceContextValue}>
              <div className="container">
                <h1 className="mt-3">OpenFisca Shibuya（非公式）</h1>
                <hr />
                <div>
                  <OpenFiscaForm />
                </div>
              </div>
            </AllowanceContext.Provider>
          </HouseholdContext.Provider>
        </YourselfContext.Provider>
      </CurrentDateContext.Provider>
    </APIServerURLContext.Provider>
  );
}

export default App;
