import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class InsightsScreen extends StatelessWidget {
  const InsightsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final currencyFormat = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    
    // Calculate spending by category
    final Map<String, double> categorySpending = {};
    for (var transaction in appState.transactions) {
      if (transaction.type == 'expense') {
        categorySpending[transaction.category] = 
            (categorySpending[transaction.category] ?? 0) + transaction.amount;
      }
    }
    
    final totalExpense = categorySpending.values.fold(0.0, (sum, amount) => sum + amount);
    final savingsRate = appState.totalIncome > 0
        ? ((appState.totalIncome - appState.totalExpense) / appState.totalIncome * 100)
        : 0;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Insights'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Summary Cards
            Row(
              children: [
                Expanded(
                  child: _buildSummaryCard(
                    label: 'Savings Rate',
                    value: '${savingsRate.toStringAsFixed(1)}%',
                    color: AppTheme.success,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSummaryCard(
                    label: 'Total Expense',
                    value: currencyFormat.format(appState.totalExpense),
                    color: AppTheme.error,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 32),
            
            // Spending by Category
            const Text(
              'Spending by Category',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 16),
            
            if (categorySpending.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: Text(
                    'No expense data yet',
                    style: TextStyle(color: AppTheme.textSecondary),
                  ),
                ),
              )
            else
              ...categorySpending.entries.map((entry) {
                final percentage = totalExpense > 0 ? (entry.value / totalExpense * 100) : 0;
                return _buildCategoryCard(
                  category: entry.key,
                  amount: entry.value,
                  percentage: percentage,
                  currencyFormat: currencyFormat,
                );
              }).toList(),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard({
    required String label,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardBackground,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: AppTheme.textSecondary,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard({
    required String category,
    required double amount,
    required double percentage,
    required NumberFormat currencyFormat,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardBackground,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                _getCategoryEmoji(category),
                style: const TextStyle(fontSize: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      category,
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      currencyFormat.format(amount),
                      style: const TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '${percentage.toInt()}%',
                style: const TextStyle(
                  color: AppTheme.primary,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: percentage / 100,
              backgroundColor: AppTheme.border,
              color: AppTheme.primary,
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  String _getCategoryEmoji(String category) {
    const expenseEmojis = {
      'food': '🍔',
      'shopping': '🛍️',
      'transport': '🚗',
      'bills': '📱',
      'entertainment': '🎬',
      'health': '💊',
      'education': '📚',
      'travel': '✈️',
      'other': '💸',
    };
    return expenseEmojis[category.toLowerCase()] ?? '💸';
  }
}
