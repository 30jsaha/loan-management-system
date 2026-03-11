import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UploadCloud } from "lucide-react";

const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  return parseFloat(String(value).replace(/,/g, "")) || 0;
};

const normalizeEmpCode = (value) => String(value ?? "").trim().toUpperCase();

const readTextFile = (selectedFile) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(String(event?.target?.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read TXT file."));
    reader.readAsText(selectedFile);
  });

const parsePayrollTxtContent = (text) => {
  const lines = String(text).split(/\r?\n/);
  const meta = {
    year: "",
    period: "",
    paycode: "",
    generated_on: "",
    period_end: "",
  };
  const parsedEmployees = [];

  lines.forEach((line) => {
    if (!meta.generated_on) {
      const generatedMatch = line.match(
        /^\s*(\d{2}-[A-Za-z]{3}-\d{4})\s*,\s*\d{1,2}:\d{2}\s*(?:am|pm)\s*$/i
      );
      if (generatedMatch) {
        meta.generated_on = generatedMatch[1].toUpperCase();
      }
    }

    if (!meta.year || !meta.period) {
      if (/Pay Group/i.test(line)) {
        const yearMatch = line.match(/Year\s+(\d{4})/i);
        const periodMatch = line.match(/Period\s+(\d+)/i);
        const periodEndMatch = line.match(/Period\s+End\s+(\d{2}-[A-Za-z]{3}-\d{4})/i);

        meta.year = yearMatch ? yearMatch[1] : meta.year;
        meta.period = periodMatch ? periodMatch[1] : meta.period;
        meta.period_end = periodEndMatch ? periodEndMatch[1].toUpperCase() : meta.period_end;
      }
    }

    if (!meta.paycode && /Paycode:/i.test(line)) {
      const paycodeMatch = line.match(/Paycode:\s*([^\s]+)/i);
      meta.paycode = paycodeMatch ? paycodeMatch[1] : meta.paycode;
    }

    const rowRegex =
      /^\s*([A-Za-z0-9]+)\s+(\d+)\s+(.+?)\s{2,}([-\d,]+(?:\.\d+)?)\s*([-\d,]+(?:\.\d+)?)?\s*([-\d,]+(?:\.\d+)?)?\s*([-\d,]+(?:\.\d+)?)?\s*$/;
    const match = line.match(rowRegex);
    if (!match) return;

    const empCode = normalizeEmpCode(match[1]);
    if (!empCode || /Total/i.test(line) || /Employees/i.test(line)) return;

    parsedEmployees.push({
      emp_code: empCode,
      job: String(match[2] ?? "").trim(),
      name: String(match[3] ?? "").trim(),
      this_period: parseNumber(match[4]),
      last_period: parseNumber(match[5]),
      variance: parseNumber(match[6]),
      arrears: parseNumber(match[7]),
    });
  });

  return { meta, employees: parsedEmployees };
};

export default function PayrollUpload({
  onCancel,
  selectedLoans = [],
  paymentDate,
  collectionUid,
  onCollectionComplete,
}) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [meta, setMeta] = useState({
    year: "",
    period: "",
    paycode: "",
    generated_on: "",
    period_end: "",
  });

  const handleFile = (e) => {
    setFile(e.target.files?.[0] ?? null);
    setEmployees([]);
    setMeta({
      year: "",
      period: "",
      paycode: "",
      generated_on: "",
      period_end: "",
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setEmployees([]);
      setMeta({
        year: "",
        period: "",
        paycode: "",
        generated_on: "",
        period_end: "",
      });
    }
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    try {
      setIsPreviewing(true);
      setEmployees([]);
      const text = await readTextFile(file);
      const parsed = parsePayrollTxtContent(text);

      if (!parsed.employees.length) {
        setEmployees([]);
        toast.error("No employee rows found in this TXT file.");
        return;
      }

      setMeta(parsed.meta);
      setEmployees(parsed.employees);
      toast.success("TXT file preview is ready.");
    } catch (error) {
      const msg = "TXT file preview failed. Please check the file format.";
      setEmployees([]);
      toast.error(msg);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!employees.length) {
      alert("No parsed data found. Please preview a TXT file first.");
      return;
    }

    if (!selectedLoans.length) {
      alert("No selected EMI rows found.");
      return;
    }
    if (!file) {
      alert("Please select a TXT file.");
      return;
    }

    try {
      setIsSubmitting(true);

      const loanIds = selectedLoans.map((item) => item.loan_id);
      const emiCounter = selectedLoans.reduce((acc, item) => {
        acc[item.loan_id] = Number(item.counter) || 1;
        return acc;
      }, {});

      const formData = new FormData();
      formData.append("payroll_file", file);
      formData.append("loan_ids", JSON.stringify(loanIds));
      formData.append("emi_counter", JSON.stringify(emiCounter));
      formData.append("payment_date", paymentDate || "");
      formData.append("collection_uid", collectionUid || "");
      formData.append("payroll_meta", JSON.stringify(meta));
      formData.append("payroll_employees", JSON.stringify(employees));

      const response = await axios.post("/api/loans/collect-emi-payroll", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const summary = response?.data?.summary ?? {};

      if ((summary.matched_emp_codes ?? 0) === 0) {
        toast.error(response?.data?.message || "No selected employee code matched the TXT file.");
        return;
      }

      if (typeof onCollectionComplete === "function") {
        onCollectionComplete(response.data);
      } else if ((summary.successful_emis ?? 0) > 0) {
        toast.success(
          `Payroll submit complete. Success: ${summary.successful_emis}, Failed: ${summary.failed_rows ?? 0}`
        );
      } else {
        toast.error(response?.data?.message || "No EMI could be collected from payroll data.");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Payroll EMI submission failed. Please check the file and selected loans.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h4 className="mb-3">Upload Payroll TXT</h4>

      <div className="mb-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900">
        Selected EMIs for validation: <b>{selectedLoans.length}</b>
      </div>

      <label
        htmlFor="payroll-upload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`block cursor-pointer rounded-2xl border-2 border-dashed px-4 py-14 text-center transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-sky-200 bg-slate-50 hover:border-blue-300"
        }`}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-blue-600" />
        <p className="mt-4 text-2xl font-medium text-slate-700">
          Click to browse or Drag &amp; Drop
        </p>
        <p className="mt-2 text-sm text-slate-400">Text (.txt) files only</p>
      </label>

      <input
        id="payroll-upload"
        type="file"
        accept=".txt"
        onChange={handleFile}
        className="sr-only"
      />

      {file && (
        <p className="mt-2 text-sm text-slate-600">
          Selected file: <span className="font-semibold">{file.name}</span>
        </p>
      )}

      <button
        onClick={handlePreview}
        className="mt-3 ml-2 rounded-md bg-blue-600 px-2 py-2 text-sm text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPreviewing || isSubmitting}
      >
        {isPreviewing ? "Previewing..." : "Preview"}
      </button>
      <button
        className="ml-2 rounded-md bg-gray-600 px-2 py-2 text-sm text-white shadow-sm hover:bg-gray-700"
        onClick={onCancel}
      >
        Cancel
      </button>

      {employees.length > 0 && (
        <div className="mt-4">
          <div className="mt-3 rounded-lg border bg-slate-50 p-3">
            <div className="mb-1 text-xs font-semibold text-slate-500">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>Preview of the uploaded file</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <div>
                <span className="text-slate-500">Paycode</span>
                <div className="font-semibold text-slate-800">{meta.paycode}</div>
              </div>

              <div>
                <span className="text-slate-500">Year</span>
                <div className="font-semibold text-slate-800">{meta.year}</div>
              </div>
              <div>
                <span className="text-slate-500">Period</span>
                <div className="font-semibold text-slate-800">{meta.period}</div>
              </div>
              <div>
                <span className="text-slate-500">Row Count</span>
                <div className="font-semibold text-slate-800">{employees.length}</div>
              </div>
            </div>
          </div>

          <div className="mt-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="w-full border-collapse text-left text-sm">
              <thead className="table-dark">
                <tr>
                  <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                    Emp Code
                  </th>
                  <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                    Job
                  </th>
                  <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                    Name
                  </th>
                  <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                    This Period
                  </th>
                  <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                    Last Period
                  </th>
                  <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                    Variance
                  </th>
                  <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                    Arrears
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-400">
                {employees.map((emp, index) => (
                  <tr key={`${emp.emp_code}-${index}`} className="transition-colors hover:bg-blue-50">
                    <td className="whitespace-nowrap border-r border-gray-50 px-6 tabular-nums text-gray-600">
                      {emp.emp_code}
                    </td>
                    <td className="whitespace-nowrap border-r border-gray-50 px-6 tabular-nums text-gray-600">
                      {emp.job}
                    </td>
                    <td className="whitespace-nowrap border-r border-gray-50 px-6 tabular-nums text-gray-600">
                      {emp.name}
                    </td>
                    <td className="whitespace-nowrap border-r border-gray-50 px-6 tabular-nums text-gray-600">
                      {emp.this_period}
                    </td>
                    <td className="whitespace-nowrap border-r border-gray-50 px-6 tabular-nums text-gray-600">
                      {emp.last_period}
                    </td>
                    <td className="whitespace-nowrap border-r border-gray-50 px-6 tabular-nums text-gray-600">
                      {emp.variance}
                    </td>
                    <td className="whitespace-nowrap border-r border-gray-50 px-6 tabular-nums text-gray-600">
                      {emp.arrears}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex justify-start gap-2">
            <button
              className="flex items-center gap-1 rounded-md bg-green-600 px-2 py-2 text-sm text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Final Submit"}
            </button>
            <button
              className="flex items-center gap-1 rounded-md bg-gray-600 px-2 text-sm text-white shadow-sm hover:bg-gray-700"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
