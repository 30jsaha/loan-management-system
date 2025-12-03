export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === "") return "0.00";

    const num = Number(amount);

    if (isNaN(num)) return "0.00";

    return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
