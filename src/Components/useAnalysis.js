import { useState, useEffect } from "react";


export const useAnalysis = (D2, ouID, period, indicatorArray) => {
    const [error, setError] = useState(null);
    const [indicators, setIndicators] = useState(null);

    // runs every time the file value changes
    useEffect(() => {
        if (D2 && ouID && period && indicatorArray) {
            var tempArray = [];
            indicatorArray.map((indicator) => {
                var dxID = indicator.id;
                var pe = period;
                //var ouID = selectedOrgUnit.id;
                const endpoint = `analytics.json?dimension=pe:${pe}&dimension=ou:${ouID}&filter=dx:${dxID}&displayProperty=NAME&outputIdScheme=NAME`

                D2.Api.getApi().get(endpoint)
                    .then((response) => {
                        var sum = 0;
                        response.rows&&response.rows.map((row) => {
                            sum = sum + parseInt(row[2]);
                        })

                        indicator.value = sum ? sum : 0;
                        console.log(response.rows);
                        tempArray.push(indicator);
                        setIndicators([...tempArray]);
                    })
                    .catch((error) => {
                        console.log(error);
                        //alert("An error occurred: " + error);
                        setError(error.message);
                    });
                setIndicators([...tempArray]);
            })
            
        } else {
            console.log("nothing received");
        }
    }, [D2, indicatorArray, ouID, period]);

    return { indicators, error };
};
