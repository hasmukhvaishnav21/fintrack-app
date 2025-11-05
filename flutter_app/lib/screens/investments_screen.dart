import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/app_state.dart';
import '../theme/app_theme.dart';

class InvestmentsScreen extends StatelessWidget {
  const InvestmentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final currencyFormat = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);
    
    final goldInvestments = appState.investments.where((i) => i.type == 'gold').toList();
    final silverInvestments = appState.investments.where((i) => i.type == 'silver').toList();
    
    final goldQuantity = goldInvestments.fold(0.0, (sum, i) => sum + i.quantity);
    final silverQuantity = silverInvestments.fold(0.0, (sum, i) => sum + i.quantity);
    
    final goldValue = goldQuantity * appState.goldPrice;
    final silverValue = silverQuantity * appState.silverPrice;
    
    final goldCost = goldInvestments.fold(0.0, (sum, i) => sum + i.totalAmount);
    final silverCost = silverInvestments.fold(0.0, (sum, i) => sum + i.totalAmount);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Investments'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Summary Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primary, Color(0xFF2563EB)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Total Investment Value',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    currencyFormat.format(appState.totalInvestmentValue),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          label: 'Invested',
                          value: currencyFormat.format(appState.totalInvestmentCost),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          label: 'P/L',
                          value: currencyFormat.format(appState.investmentProfitLoss),
                          color: appState.investmentProfitLoss >= 0 ? AppTheme.success : AppTheme.error,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Gold Section
            const Text(
              'Gold',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            _buildInvestmentCard(
              emoji: '🏅',
              label: 'Gold',
              quantity: goldQuantity,
              unit: 'g',
              currentValue: goldValue,
              invested: goldCost,
              currencyFormat: currencyFormat,
            ),
            
            const SizedBox(height: 24),
            
            // Silver Section
            const Text(
              'Silver',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            _buildInvestmentCard(
              emoji: '⚪',
              label: 'Silver',
              quantity: silverQuantity,
              unit: 'g',
              currentValue: silverValue,
              invested: silverCost,
              currencyFormat: currencyFormat,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard({required String label, required String value, Color? color}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              color: Colors.white70,
              fontSize: 12,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              color: color ?? Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInvestmentCard({
    required String emoji,
    required String label,
    required double quantity,
    required String unit,
    required double currentValue,
    required double invested,
    required NumberFormat currencyFormat,
  }) {
    final pl = currentValue - invested;
    final plPercent = invested > 0 ? (pl / invested * 100) : 0;
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardBackground,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(emoji, style: const TextStyle(fontSize: 32)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: const TextStyle(
                        color: AppTheme.textPrimary,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${quantity.toStringAsFixed(2)} $unit',
                      style: const TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Current Value',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                  ),
                  Text(
                    currencyFormat.format(currentValue),
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'P/L',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                  ),
                  Text(
                    '${pl >= 0 ? '+' : ''}${currencyFormat.format(pl)} (${plPercent.toStringAsFixed(2)}%)',
                    style: TextStyle(
                      color: pl >= 0 ? AppTheme.success : AppTheme.error,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
