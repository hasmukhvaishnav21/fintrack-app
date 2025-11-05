import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../providers/app_state.dart';
import '../models/transaction.dart' as model;
import '../theme/app_theme.dart';

class AddTransactionModal extends StatefulWidget {
  final String type; // 'income' or 'expense'
  
  const AddTransactionModal({super.key, required this.type});

  @override
  State<AddTransactionModal> createState() => _AddTransactionModalState();
}

class _AddTransactionModalState extends State<AddTransactionModal> {
  String? _selectedCategory;
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();

  final Map<String, List<Map<String, String>>> categories = {
    'income': [
      {'id': 'salary', 'label': 'Salary', 'emoji': '💼'},
      {'id': 'freelance', 'label': 'Freelance', 'emoji': '💻'},
      {'id': 'business', 'label': 'Business', 'emoji': '🏢'},
      {'id': 'investment', 'label': 'Investment', 'emoji': '📈'},
      {'id': 'gift', 'label': 'Gift', 'emoji': '🎁'},
      {'id': 'other', 'label': 'Other', 'emoji': '💰'},
    ],
    'expense': [
      {'id': 'food', 'label': 'Food', 'emoji': '🍔'},
      {'id': 'shopping', 'label': 'Shopping', 'emoji': '🛍️'},
      {'id': 'transport', 'label': 'Transport', 'emoji': '🚗'},
      {'id': 'bills', 'label': 'Bills', 'emoji': '📱'},
      {'id': 'entertainment', 'label': 'Entertainment', 'emoji': '🎬'},
      {'id': 'health', 'label': 'Health', 'emoji': '💊'},
      {'id': 'education', 'label': 'Education', 'emoji': '📚'},
      {'id': 'travel', 'label': 'Travel', 'emoji': '✈️'},
      {'id': 'other', 'label': 'Other', 'emoji': '💸'},
    ],
  };

  @override
  Widget build(BuildContext context) {
    final currentCategories = categories[widget.type]!;

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
                Text(
                  'Add ${widget.type == 'income' ? 'Income' : 'Expense'}',
                  style: const TextStyle(
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
            
            const Text(
              'Select Category',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            
            // Category Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1,
              ),
              itemCount: currentCategories.length,
              itemBuilder: (context, index) {
                final category = currentCategories[index];
                final isSelected = _selectedCategory == category['id'];
                
                return GestureDetector(
                  onTap: () => setState(() => _selectedCategory = category['id']),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? AppTheme.primary : AppTheme.cardBackground,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? AppTheme.primary : AppTheme.border,
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          category['emoji']!,
                          style: const TextStyle(fontSize: 32),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          category['label']!,
                          style: TextStyle(
                            fontSize: 12,
                            color: isSelected ? Colors.white : AppTheme.textSecondary,
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            
            const SizedBox(height: 24),
            
            // Amount
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: const InputDecoration(
                labelText: 'Amount',
                prefixText: '₹ ',
                labelStyle: TextStyle(color: AppTheme.textSecondary),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Description
            TextField(
              controller: _descriptionController,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: const InputDecoration(
                labelText: 'Description (Optional)',
                labelStyle: TextStyle(color: AppTheme.textSecondary),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _selectedCategory != null && _amountController.text.isNotEmpty
                    ? _submitTransaction
                    : null,
                child: const Text(
                  'Add Transaction',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _submitTransaction() {
    final appState = Provider.of<AppState>(context, listen: false);
    final amount = double.tryParse(_amountController.text);
    
    if (amount != null && _selectedCategory != null) {
      final transaction = model.Transaction(
        id: const Uuid().v4(),
        type: widget.type,
        amount: amount,
        category: _selectedCategory!,
        description: _descriptionController.text.isEmpty ? null : _descriptionController.text,
        date: DateTime.now(),
      );
      
      appState.addTransaction(transaction);
      Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }
}
