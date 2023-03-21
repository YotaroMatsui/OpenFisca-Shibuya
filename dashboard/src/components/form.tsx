import { useCalculate } from "../hooks/calculate";
import { FormYou } from "./forms/you";
import { FormChildren } from "./forms/children";
import { useContext, useEffect, useState } from "react";
import { AllowanceContext } from "../contexts/AllowanceContext";

export const OpenFiscaForm = () => {
  const result = useCalculate();
  const allowance = useContext(AllowanceContext);

  const [allowancesContextValue, setAllowances] = useState<any>();
  useEffect(() => {
    const allowances = new Array();

    if (result && allowance) {
      for (const [key, value] of Object.entries(
        Object.entries(result.世帯.世帯1)
      )) {
        // const linkPrefix = allowance
        if (typeof value[1] === "object") {
          const inf = value[1] as { foo: unknown };
          allowances.push({
            allowanceName: value[0],
            allowanceDate: Object.keys(inf),
            allowanceValue: Object.values(inf)[0],
            description:
              allowance.get("linkPrefix") + allowance.get(value[0]).description,
            reference: allowance.get(value[0]).references[0],
          });
        }
      }
      // console.log('allowances', allowances);
      setAllowances(allowances);
    }
  }, [result]);

  return (
    <div>
      <h2>試す</h2>
      <form>
        <FormYou />
        <FormChildren />
      </form>
      <h2>結果</h2>
      {/* {result && <pre>{JSON.stringify(result.世帯.世帯1, null, 2)}</pre>} */}
      {/* {result && <pre>{JSON.stringify(allowancesContextValue, null, 2)}</pre>} */}
      <ul className="list-group mb-3">
        {allowancesContextValue &&
          allowancesContextValue.map((val: any, index: any) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between lh-sm"
            >
              <div>
                <h6 className="my-0">{val.allowanceName}</h6>
                <small className="text-muted">
                  <a href={val.reference} target="_blank">
                    {val.description}
                  </a>
                </small>
              </div>
              <span className="text-muted">
                {Number(val.allowanceValue).toLocaleString()} 円
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};
