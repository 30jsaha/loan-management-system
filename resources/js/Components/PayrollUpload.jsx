import React, { useState } from "react";
import axios from "axios";
import { Upload } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";

export default function PayrollUpload({onCancel}) {
  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({
    year: "",
    period: "",
    paycode: ""
  });

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePreview = () => {
    if (!file) return alert("Please select a file");

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split("\n");

      let year = "";
      let period = "";
      let paycode = "";
      const parsedEmployees = [];

      // Extract Year & Period
      const headerLine = lines.find(line =>
        line.includes("Pay Group")
      );

      if (headerLine) {
        const yearMatch = headerLine.match(/Year\s+(\d{4})/);
        const periodMatch = headerLine.match(/Period\s+(\d+)/);

        year = yearMatch ? yearMatch[1] : "";
        period = periodMatch ? periodMatch[1] : "";
      }

      // Extract Paycode
      const paycodeLine = lines.find(line => {
            line.includes("Paycode:");
        });

      if (paycodeLine) {
        const match = paycodeLine.match(/Paycode:\s+(\w+)/);
        paycode = match ? match[1] : "";
      }

      const parseNumber = (value) => {
        if (!value) return 0;
        return parseFloat(String(value).replace(/,/g, "")) || 0;
    };


      // Extract employee rows
      lines.forEach(line => {
        const regex = /^\s*(\w+)\s+(\d+)\s+(.+?)\s+([\d,.\-]+)?\s*([\d,.\-]+)?\s*([\d,.\-]+)?\s*([\d,.\-]+)?$/;

        const match = line.match(regex);

        if (
        match &&
        match[1] &&                 // employee code exists
        /^\d/.test(match[1]) &&     // starts with number
        !line.includes("Total") &&
        !line.includes("Employees")
        ) {
            parsedEmployees.push({
                emp_code: match[1],
                job: match[2],
                name: match[3].trim(),
                this_period: parseNumber(match[4]),
                last_period: parseNumber(match[5]),
                variance: parseNumber(match[6]),
                arrears: parseNumber(match[7]),
            });
        }

      });

      setMeta({ year, period, paycode });
      setEmployees(parsedEmployees);
    };

    reader.readAsText(file);
  };

  const handleFinalSubmit = async () => {
    if (!employees.length) return alert("No data to submit");

    // await axios.post("/api/payroll-import", {
    //   ...meta,
    //   employees
    // });

    // toast.success("Payroll Imported Successfully");
    let ttt = toast.custom((t) => (
        <div
            className={`bg-white border-l-4 border-amber-500 px-5 py-3 rounded-md shadow-md
            flex items-center gap-3 ${t.visible ? "opacity-100" : "opacity-0"}`}
        >
            <span className="text-amber-600 font-medium">
            Only for preview. Submit not allowed
            </span>

            <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-auto text-gray-400 hover:text-gray-600"
            >
            ✕
            </button>
        </div>
    ));
    setTimeout(() => {
        toast.dismiss(ttt);
    }, 2000);

    // setEmployees([]);
    // setFile(null);
  };

  return (
    <div className="p-4">
      <h4>Upload Payroll TXT</h4>

      <input type="file" accept=".txt" onChange={handleFile} />

      <button onClick={handlePreview} className="btn btn-primary ms-2">
        Preview
      </button>
        <button
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-2 py-2 ml-2 rounded-md shadow-sm"
            onClick={onCancel}
        >
        Cancel
        </button>
      {employees.length > 0 && (
        <>
          <div className="mt-4">
            {/* <h5>
              Preview - Paycode: {meta.paycode} | Year: {meta.year} | Period: {meta.period}
            </h5> */}
            <div className="mt-3 border rounded-lg bg-slate-50 p-3">
                <div className="text-xs font-semibold text-slate-500 mb-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
                    <span>Preview of the uploaded file</span>
                    {/* <span>ℹ️</span> */}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                        <span className="text-slate-500">Paycode</span>
                        <div className="font-semibold text-slate-800">
                            {meta.paycode}
                        </div>
                    </div>

                    <div>
                        <span className="text-slate-500">Year</span>
                        <div className="font-semibold text-slate-800">
                            {meta.year}
                        </div>
                    </div>
                    <div>
                        <span className="text-slate-500">Period</span>
                        <div className="font-semibold text-slate-800">
                            {meta.period}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table className="border-collapse text-sm text-left w-full">
                <thead className="table-dark">
                  <tr>
                    <th className="sticky left-0 top-0 z-50 bg-gray-900 text-white font-semibold p-3 border-r border-b border-gray-700 shadow-lg">Emp Code</th>
                    <th className="sticky left-0 top-0 z-50 bg-gray-900 text-white font-semibold p-3 border-r border-b border-gray-700 shadow-lg">Job</th>
                    <th className="sticky left-0 top-0 z-50 bg-gray-900 text-white font-semibold p-3 border-r border-b border-gray-700 shadow-lg">Name</th>
                    <th className="sticky left-0 top-0 z-50 bg-gray-900 text-white font-semibold p-3 border-r border-b border-gray-700 shadow-lg">This Period</th>
                    <th className="sticky left-0 top-0 z-50 bg-gray-900 text-white font-semibold p-3 border-r border-b border-gray-700 shadow-lg">Last Period</th>
                    <th className="sticky left-0 top-0 z-50 bg-gray-900 text-white font-semibold p-3 border-r border-b border-gray-700 shadow-lg">Variance</th>
                    <th className="sticky left-0 top-0 z-50 bg-gray-900 text-white font-semibold p-3 border-r border-b border-gray-700 shadow-lg">Arrears</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-400">
                  {employees.map((emp, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="text-gray-600 border-r border-gray-50 group-hover:text-blue-700 tabular-nums whitespace-nowrap px-6">{emp.emp_code}</td>
                      <td className="text-gray-600 border-r border-gray-50 group-hover:text-blue-700 tabular-nums whitespace-nowrap px-6">{emp.job}</td>
                      <td className="text-gray-600 border-r border-gray-50 group-hover:text-blue-700 tabular-nums whitespace-nowrap px-6">{emp.name}</td>
                      <td className="text-gray-600 border-r border-gray-50 group-hover:text-blue-700 tabular-nums whitespace-nowrap px-6">{emp.this_period}</td>
                      <td className="text-gray-600 border-r border-gray-50 group-hover:text-blue-700 tabular-nums whitespace-nowrap px-6">{emp.last_period}</td>
                      <td className="text-gray-600 border-r border-gray-50 group-hover:text-blue-700 tabular-nums whitespace-nowrap px-6">{emp.variance}</td>
                      <td className="text-gray-600 border-r border-gray-50 group-hover:text-blue-700 tabular-nums whitespace-nowrap px-6">{emp.arrears}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-start gap-2 mt-3">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-2 py-2 rounded-md shadow-sm flex items-center gap-1"
                    onClick={handleFinalSubmit}
                >
                    Final Submit
                </button>
                <button
                className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-2 rounded-md shadow-sm flex items-center gap-1"
                onClick={onCancel}
                >
                Cancel
                </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}