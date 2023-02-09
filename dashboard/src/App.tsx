import { useEffect, useState } from "react";
import { OpenFiscaForm } from "./components/form";
import { HouseholdContext } from "./contexts/HouseholdContext";
import { YourselfContext } from "./contexts/YourselfContext";
import { CurrentDateContext } from "./contexts/CurrentDateContext";
import { APIServerURLContext } from "./contexts/APIServerURLContext";

function App() {
  const currentDate = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`;

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
        所得: {
          [currentDate]: 0,
        },
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
        特別児童扶養手当: {
          [currentDate]: null,
        },
        障害児童育成手当: {
          [currentDate]: null,
        },
      },
    },
  });
  const householdContextValue = {
    household,
    setHousehold,
  };

  const [spec, setSpec] = useState<any>();

  useEffect(() => {
    (async () => {
      const newSpecRes = await fetch(`${apiURL}/spec`);
      const newSpecJson = await newSpecRes.json();
      setSpec(newSpecJson);
    })();
  }, []);

  return (
    <APIServerURLContext.Provider value={apiURL}>
      <CurrentDateContext.Provider value={currentDate}>
        <YourselfContext.Provider value={yourselfContextValue}>
          <HouseholdContext.Provider value={householdContextValue}>
            <div className="container">
              <h1>OpenFisca Shibuya (非公式)</h1>
              <hr />
              <div>
                <OpenFiscaForm />
              </div>
              <hr />
              <div>
                <h2>仕様</h2>
                {spec && (
                  <>
                    <details>
                      <summary>世帯</summary>
                      <pre>
                        {JSON.stringify(
                          spec.definitions.世帯.properties,
                          null,
                          2
                        )}
                      </pre>
                    </details>
                    <details>
                      <summary>人物</summary>
                      <pre>
                        {JSON.stringify(
                          spec.definitions.人物.properties,
                          null,
                          2
                        )}
                      </pre>
                    </details>
                    <details>
                      <summary>エンドポイント</summary>
                      <pre>{JSON.stringify(spec.paths, null, 2)}</pre>
                    </details>
                  </>
                )}
              </div>
            </div>
          </HouseholdContext.Provider>
        </YourselfContext.Provider>
      </CurrentDateContext.Provider>
    </APIServerURLContext.Provider>
  );
}

export default App;
