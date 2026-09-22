export interface Tenant {
  id: string;
  name: string;
  rent_target: number;
  kas_target?: number;
}

export interface RentPayment {
  id: string;
  tenant_id: string;
  amount: number;
  paid_at?: string;
  payment_date?: string;
  notes?: string;
}

export interface WaterHeaterPayment {
  id: string;
  tenant_id: string;
  name: string;
  amount: number; // 220.000
  status: 'PAID' | 'UNPAID';
  is_initial_payer: boolean; // Rendi = true
  paid_at?: string | null;
}

export interface MonthlyKas {
  id: string;
  tenant_id: string;
  name: string;
  month: number;
  year: number;
  amount: number; // 257.000
  status: 'PAID' | 'UNPAID';
  paid_at?: string | null;
}

// Backward compatibility alias
export type MonthlyKasPayment = MonthlyKas & {
  is_paid?: boolean;
  amount_paid?: number;
  month_year?: string;
  target_amount?: number;
  payment_method?: string;
};

export interface MonthlyExpense {
  id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  description?: string;
  created_at?: string;
}

// Backward compatibility alias
export type ExpenseCategory = string;
export type Expense = MonthlyExpense & {
  title?: string;
  expense_date?: string;
};

export interface FixedBillEstimate {
  category: string;
  amount: number;
  note?: string;
}

// Backward compatibility alias
export type FixedCostItem = FixedBillEstimate & {
  id?: string;
  name?: string;
  description?: string;
};

export interface TenantRentSummary {
  tenant: Tenant;
  total_paid: number;
  remaining_balance: number;
  progress_percentage: number;
  history: RentPayment[];
}

export interface MonthlyFinancialSummary {
  total_kas_collected: number;
  total_expenses: number;
  net_balance: number;
  status: 'SURPLUS' | 'BONCOS';
  paid_tenants_count: number;
  total_tenants_count: number;
}

// Backward compatibility alias
export interface DashboardSummary {
  total_rent_target: number;
  total_rent_paid: number;
  total_rent_remaining: number;
  rent_progress_percentage: number;
  total_kas_target: number;
  total_kas_collected: number;
  total_operational_bill: number;
  kas_difference: number;
  tenants_kas_paid_count: number;
  total_tenants_count: number;
  total_expenses?: number;
  current_kas_balance?: number;
}
