import { useEffect, useState } from "react";

function useHistoricalCurrencyInfo(currency, toCurrency) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Return early if no currency is selected
        if (!currency || !toCurrency) return;

        setLoading(true);

        // 2. Calculate Dates (Today and 15 Years Ago)
        const today = new Date();
        const endDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const pastDate = new Date();
        pastDate.setFullYear(today.getFullYear() - 15);
        const startDate = pastDate.toISOString().split('T')[0];

        // 3. Fetch Data from Frankfurter API
        // Note: Frankfurter uses uppercase codes (e.g., USD, INR)
        fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${currency.toUpperCase()}&to=${toCurrency.toUpperCase()}`)
            .then((res) => res.json())
            .then((res) => {
                // The API returns rates like: { "2010-01-01": { "INR": 45.5 }, ... }
                // We need to format this for the graph
                const dates = Object.keys(res.rates || {});
                const rates = dates.map(date => res.rates[date][toCurrency.toUpperCase()]);
                
                setData({ labels: dates, datasets: [{ label: `Price of ${currency.toUpperCase()}`, data: rates }] });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching historical data:", err);
                setData(null);
                setLoading(false);
            });

    }, [currency, toCurrency]); // Re-run this effect whenever currency changes

    return { data, loading };
}

export default useHistoricalCurrencyInfo;