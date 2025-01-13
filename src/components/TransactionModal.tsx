import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setModalOpen, setSelectedCurrency } from "../store/transactionSlice";
import { format } from "date-fns";

interface CurrencySymbols {
  [key: string]: string;
}

export const TransactionModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isModalOpen, selectedCurrency, transactions, receiver } = useSelector(
    (state: RootState) => state.transactions
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  const CURRENCY_SYMBOLS: CurrencySymbols = {
    USD: "$",
    IRR: "IRR",
    INR: "₹",
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dispatch(setModalOpen(false));
    }
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const parts = text.toString().split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    switch (currency) {
      case 'USD':
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);
      case 'IRR':
        return new Intl.NumberFormat('fa-IR').format(amount);
      case 'INR':
        return new Intl.NumberFormat('en-IN').format(amount);
      default:
        return amount.toString();
    }
  };
  
  const handleDownload = (transaction: any) => {
    const content = `
  Transaction Details:
  ------------------
  Reference Number: ${transaction.referenceNumber}
  Date & Time: ${format(
    new Date(transaction.dateTime),
    "EEE dd MMM yyyy, h:mm a"
  )}
  To: ${transaction.to}
  Paid with: ${transaction.paidWith}
  Amount: ${CURRENCY_SYMBOLS[transaction.currency]}${transaction.amount}
  Status: ${transaction.status}
  `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transaction-${transaction.referenceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const filtered = transactions.filter((t) => {
      if (t.currency !== selectedCurrency) return false;

      const searchFields = [
        t.referenceNumber,
        t.to,
        t.dateTime,
        t.paidWith,
        t.amount.toString(),
        t.status,
      ].map((field) => field.toLowerCase());

      return searchFields.some((field) =>
        field.includes(searchTerm.toLowerCase())
      );
    });
    setFilteredTransactions(filtered);
  }, [searchTerm, selectedCurrency, transactions]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto"
      onClick={handleClickOutside}
    >
      <div className="bg-white rounded-lg w-full max-w-5xl my-2 sm:my-4 relative">
        <button
          onClick={() => dispatch(setModalOpen(false))}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl z-10"
        >
          ×
        </button>

        <div className="p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {receiver.name}
            </h2>
            <p className="text-gray-500 text-sm mb-4">{receiver.email}</p>
            <button className="text-blue-500 hover:text-blue-700 font-semibold">
              Send Them Money {">"}
            </button>
          </div>

          <div className="mb-4 sm:mb-6">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full sm:w-64 px-3 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
            {receiver.currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => dispatch(setSelectedCurrency(curr.code))}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-full transition-colors ${
                  selectedCurrency === curr.code
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="text-lg sm:text-xl font-bold">{curr.code}</div>
                <div className="text-xs sm:text-sm">
                  {curr.accounts} Account{curr.accounts > 1 ? "s" : ""}
                </div>
              </button>
            ))}
          </div>
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                      <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Reference Number</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">To</th>
                      <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                      <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Paid with</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.referenceNumber}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">{transaction.rowNumber}</td>
                        <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm font-mono text-gray-500">{highlightText(transaction.referenceNumber, searchTerm)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{highlightText(transaction.to, searchTerm)}</td>
                        <td className="hidden md:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                            <span>{highlightText(format(new Date(transaction.dateTime), 'EEE dd MMM yyyy'), searchTerm)}</span>
                            <span className="text-gray-400">{highlightText(format(new Date(transaction.dateTime), 'h:mm a'), searchTerm)}</span>
                        </div>
                        </td>
                        <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">{highlightText(transaction.paidWith, searchTerm)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{CURRENCY_SYMBOLS[transaction.currency]}</span>
                            {highlightText(formatAmount(transaction.amount, transaction.currency), searchTerm)}
                        </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            transaction.status === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {highlightText(transaction.status, searchTerm)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex gap-2 justify-end">
                            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleDownload(transaction)}>Download</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
