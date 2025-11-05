import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../providers/app_state.dart';
import '../models/investment.dart';
import '../theme/app_theme.dart';

class AddInvestmentModal extends StatefulWidget {
  const AddInvestmentModal({super.key});

  @override
  State<AddInvestmentModal> createState() => _AddInvestmentModalState();
}

class _AddInvestmentModalState extends State<AddInvestmentModal> {
  String _type = 'gold';
  final _quantityController = TextEditingController();
  final _priceController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final quantity = double.tryParse(_quantityController.text) ?? 0;
    final price = double.tryParse(_priceController.text) ?? 0;
    final total = quantity * price;

    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Add Investment',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textPrimary,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close_rounded),
                  color: AppTheme.textSecondary,
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Type Selection
            Row(
              children: [
                Expanded(
                  child: _buildTypeCard('gold', '🏅 Gold'),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildTypeCard('silver', '⚪ Silver'),
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            // Quantity
            TextField(
              controller: _quantityController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(color: AppTheme.textPrimary),
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                labelText: 'Quantity (grams)',
                labelStyle: TextStyle(color: AppTheme.textSecondary),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Price per unit
            TextField(
              controller: _priceController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(color: AppTheme.textPrimary),
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                labelText: 'Price per gram',
                prefixText: '₹ ',
                labelStyle: TextStyle(color: AppTheme.textSecondary),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Total Amount
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cardBackground,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Total Amount',
                    style: TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 14,
                    ),
                  ),
                  Text(
                    '₹${total.toStringAsFixed(2)}',
                    style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: quantity > 0 && price > 0 ? _submitInvestment : null,
                child: const Text(
                  'Add Investment',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeCard(String type, String label) {
    final isSelected = _type == type;
    return GestureDetector(
      onTap: () => setState(() => _type = type),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primary : AppTheme.cardBackground,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppTheme.primary : AppTheme.border,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              fontSize: 16,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              color: isSelected ? Colors.white : AppTheme.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  void _submitInvestment() {
    final appState = Provider.of<AppState>(context, listen: false);
    final quantity = double.tryParse(_quantityController.text);
    final price = double.tryParse(_priceController.text);
    
    if (quantity != null && price != null) {
      final investment = Investment(
        id: const Uuid().v4(),
        type: _type,
        quantity: quantity,
        pricePerUnit: price,
        totalAmount: quantity * price,
        date: DateTime.now(),
      );
      
      appState.addInvestment(investment);
      Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _quantityController.dispose();
    _priceController.dispose();
    super.dispose();
  }
}
