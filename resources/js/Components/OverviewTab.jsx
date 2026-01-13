function OverviewTab({ customer }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Customer Overview</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Info label="Name" value={`${customer.first_name} ${customer.last_name}`} />
        <Info label="DOB" value={customer.dob} />
        <Info label="Phone" value={customer.phone} />
        <Info label="Email" value={customer.email} />
        <Info label="Gender" value={customer.gender} />
        <Info label="Dependents" value={customer.no_of_dependents} />
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium">{value ?? "—"}</p>
  </div>
);
