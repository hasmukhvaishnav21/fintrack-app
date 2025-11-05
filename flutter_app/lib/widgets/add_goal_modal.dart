import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';
import '../providers/app_state.dart';
import '../models/goal.dart';
import '../theme/app_theme.dart';

class AddGoalModal extends StatefulWidget {
  const AddGoalModal({super.key});

  @override
  State<AddGoalModal> createState() => _AddGoalModalState();
}

class _AddGoalModalState extends State<AddGoalModal> {
  String _selectedIcon = 'bike';
  final _nameController = TextEditingController();
  final _targetController = TextEditingController();

  final List<Map<String, String>> icons = [
    {'id': 'bike', 'emoji': '🏍️', 'label': 'Bike'},
    {'id': 'car', 'emoji': '🚗', 'label': 'Car'},
    {'id': 'home', 'emoji': '🏠', 'label': 'Home'},
    {'id': 'plane', 'emoji': '✈️', 'label': 'Vacation'},
    {'id': 'education', 'emoji': '🎓', 'label': 'Education'},
    {'id': 'wedding', 'emoji': '💍', 'label': 'Wedding'},
  ];

  @override
  Widget build(BuildContext context) {
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
                  'Add Goal',
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
            
            const Text(
              'Select Icon',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 12),
            
            // Icon Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1,
              ),
              itemCount: icons.length,
              itemBuilder: (context, index) {
                final icon = icons[index];
                final isSelected = _selectedIcon == icon['id'];
                
                return GestureDetector(
                  onTap: () => setState(() => _selectedIcon = icon['id']!),
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
                          icon['emoji']!,
                          style: const TextStyle(fontSize: 32),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          icon['label']!,
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
            
            // Goal Name
            TextField(
              controller: _nameController,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: const InputDecoration(
                labelText: 'Goal Name',
                labelStyle: TextStyle(color: AppTheme.textSecondary),
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Target Amount
            TextField(
              controller: _targetController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: AppTheme.textPrimary),
              decoration: const InputDecoration(
                labelText: 'Target Amount',
                prefixText: '₹ ',
                labelStyle: TextStyle(color: AppTheme.textSecondary),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _nameController.text.isNotEmpty && _targetController.text.isNotEmpty
                    ? _submitGoal
                    : null,
                child: const Text(
                  'Create Goal',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _submitGoal() {
    final appState = Provider.of<AppState>(context, listen: false);
    final targetAmount = double.tryParse(_targetController.text);
    
    if (targetAmount != null && _nameController.text.isNotEmpty) {
      final goal = Goal(
        id: const Uuid().v4(),
        name: _nameController.text,
        targetAmount: targetAmount,
        currentAmount: 0,
        icon: _selectedIcon,
      );
      
      appState.addGoal(goal);
      Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _targetController.dispose();
    super.dispose();
  }
}
