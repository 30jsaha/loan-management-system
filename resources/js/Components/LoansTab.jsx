function LoansTab({ loans }) {
  if (!loans?.length)
    return <div className="text-gray-500 text-sm">No loans found.</div>;

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <div key={loan.id} className="bg-white p-5 shadow rounded-xl border">
          <h3 className="font-semibold text-gray-800">
            Loan #{loan.id} — {loan.purpose}
          </h3>

          <div className="grid grid-cols-3 gap-4 text-sm mt-3">
            <Info label="Loan Amount" value={`PGK ${loan.loan_amount_applied}`} />
            <Info label="Tenure" value={`${loan.tenure_fortnight} FN`} />
            <Info label="Interest" value={`${loan.interest_rate}%`} />
            <Info label="Status" value={loan.status} />
            <Info label="Total Repay" value={`PGK ${loan.total_repay_amt}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
