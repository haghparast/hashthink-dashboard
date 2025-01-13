  import React from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { TransactionModal } from './components/TransactionModal';
  import { Navigation } from './components/Navigation';
  import { setModalOpen } from './store/transactionSlice';
  import { RootState } from './store/store';

  const App: React.FC = () => {
    const dispatch = useDispatch();
    const isModalOpen = useSelector((state: RootState) => state.transactions.isModalOpen);

    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
      
        <main className={`container mx-auto px-4 pt-20 transition-opacity duration-300 ${isModalOpen ? 'opacity-0' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Dashboard Cards */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Transactions</h3>
              <p className="text-3xl font-bold mt-2">1,234</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Active Users</h3>
              <p className="text-3xl font-bold mt-2">567</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Volume</h3>
              <p className="text-3xl font-bold mt-2">$890K</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => dispatch(setModalOpen(true))}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition-colors"
            >
              View Receiver
            </button>
          </div>
        </main>

        <TransactionModal />
      </div>
    );
  };

  export default App;