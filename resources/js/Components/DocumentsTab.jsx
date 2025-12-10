function DocumentsTab({ loans }) {
  const docs = loans.flatMap((l) => l.documents || []);

  if (!docs.length)
    return <div className="text-gray-500">No documents uploaded.</div>;

  return (
    <div className="bg-white p-6 shadow rounded-xl">
      <h3 className="text-lg font-semibold mb-3">Documents</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="py-2 text-left">Type</th>
            <th className="py-2">Status</th>
            <th className="py-2">Uploaded</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {docs.map((d) => (
            <tr key={d.id} className="border-b">
              <td className="py-2">{d.doc_type}</td>
              <td className="text-center">{d.verification_status}</td>
              <td className="text-center">{d.uploaded_on}</td>
              <td className="text-right">
                <a
                  href={`/storage/${d.file_path}`}
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                >
                  View PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
