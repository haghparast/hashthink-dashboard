import React, { useState } from 'react';

interface ModalProps {
  onClose: () => void;
}

const ReceiverModal: React.FC<ModalProps> = ({ onClose }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const transactions = [
    { id: 1, to: 'Alice', status: 'Approved', amount: 100, currency: 'USD' },
    { id: 2, to: 'Bob', status: 'Pending', amount: 200, currency: 'EUR' },
    { id: 3, to: 'Charlie', status: 'Approved', amount: 150, currency: 'GBP' }
  ];

  const filteredTransactions = transactions.filter(
    (tx) => tx.currency === selectedCurrency
  );

  const downloadFile = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,Sample File');
    element.setAttribute('download', 'sample.doc');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Transactions</h2>
        <div className="flex justify-between mb-4">
          {['USD', 'EUR', 'GBP'].map((currency) => (
            <button
              key={currency}
              className={`px-4 py-2 rounded-md ${
                selectedCurrency === currency ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setSelectedCurrency(currency)}
            >
              {currency}
            </button>
          ))}
        </div>
        <ul className="mb-4">
          {filteredTransactions.map((tx) => (
            <li key={tx.id} className="border-b py-2">
              <p>To: {tx.to}</p>
              <p>Status: {tx.status}</p>
              <p>Amount: {tx.amount}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
          <button
            onClick={downloadFile}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiverModal;
