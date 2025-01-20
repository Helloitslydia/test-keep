import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Pencil, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface BudgetEntry {
  id: string;
  amount: number;
  date: string;
}

export function BudgetSpent() {
  const { id: projectId } = useParams();
  const [amount, setAmount] = useState('');
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [plannedBudget, setPlannedBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial budget data
  useEffect(() => {
    const fetchBudgetData = async () => {
      if (!projectId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('budget, money_spent')
          .eq('id', projectId)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          setPlannedBudget(data.budget?.toString() || '');
          const totalSpent = data.money_spent || 0;
          setEntries([{
            id: 'initial',
            amount: totalSpent,
            date: new Date().toISOString()
          }]);
        }
      } catch (err) {
        console.error('Error fetching budget data:', err);
        setError('Failed to load budget data');
      }
    };

    fetchBudgetData();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Update both budget and money spent
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          budget: plannedBudget ? parseFloat(plannedBudget) : null,
          money_spent: parseFloat(amount)
        })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Update local state
      setEntries([{
        id: Math.random().toString(),
        amount: parseFloat(amount),
        date: new Date().toISOString()
      }]);
      setAmount('');

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Budget updated successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

    } catch (err) {
      console.error('Error updating budget:', err);
      setError('Failed to update budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: BudgetEntry) => {
    setAmount(entry.amount.toString());
    setEditingId(entry.id);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const totalSpent = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const budgetRemaining = plannedBudget ? parseFloat(plannedBudget) - totalSpent : 0;
  const percentageSpent = plannedBudget ? (totalSpent / parseFloat(plannedBudget)) * 100 : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">Budget Spent</h1>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Planned (in euros)
              </label>
              <input
                type="number"
                value={plannedBudget}
                onChange={(e) => setPlannedBudget(e.target.value)}
                className="input-field"
                placeholder="Enter planned budget"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount of money spent
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  placeholder="Enter amount in euros"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (editingId ? 'Update Amount' : 'Add Amount')}
              </button>
            </form>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-lg font-medium">€{plannedBudget || '0'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-lg font-medium">€{totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Remaining</p>
                <p className="text-lg font-medium">€{budgetRemaining.toFixed(2)}</p>
              </div>
            </div>

            {plannedBudget && (
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Budget Progress</span>
                  <span>{percentageSpent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      percentageSpent > 90 ? 'bg-red-500' :
                      percentageSpent > 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentageSpent, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        €{entry.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}