import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import transactionData from '../data/transactions.json';

interface Currency {
  code: string;
  accounts: number;
}

interface Receiver {
  name: string;
  email: string;
  createdAt: string;
  currencies: Currency[];
}

interface Transaction {
  rowNumber: number;
  referenceNumber: string;
  to: string;
  dateTime: string;
  paidWith: string;
  amount: number;
  currency: string;
  status: string;
}

interface TransactionState {
  selectedCurrency: string;
  isModalOpen: boolean;
  transactions: Transaction[];
  receiver: Receiver;
}

const initialState: TransactionState = {
  selectedCurrency: 'USD',
  isModalOpen: false,
  transactions: transactionData.transactions,
  receiver: transactionData.receiver
};

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setSelectedCurrency: (state, action: PayloadAction<string>) => {
      state.selectedCurrency = action.payload;
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    }
  }
});

export const { setSelectedCurrency, setModalOpen } = transactionSlice.actions;
export default transactionSlice.reducer;