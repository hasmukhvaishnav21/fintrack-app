import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import 'dart:convert';
import '../models/transaction.dart';
import '../models/investment.dart';
import '../models/goal.dart';

class AppState extends ChangeNotifier {
  List<Transaction> _transactions = [];
  List<Investment> _investments = [];
  List<Goal> _goals = [];
  
  List<Transaction> get transactions => _transactions;
  List<Investment> get investments => _investments;
  List<Goal> get goals => _goals;
  
  // Current prices
  final double goldPrice = 6750.0;
  final double silverPrice = 92.0;
  
  AppState() {
    _loadData();
  }
  
  // Load data from local storage
  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    
    final transactionsJson = prefs.getString('transactions');
    if (transactionsJson != null) {
      final List<dynamic> list = json.decode(transactionsJson);
      _transactions = list.map((e) => Transaction.fromJson(e)).toList();
    }
    
    final investmentsJson = prefs.getString('investments');
    if (investmentsJson != null) {
      final List<dynamic> list = json.decode(investmentsJson);
      _investments = list.map((e) => Investment.fromJson(e)).toList();
    }
    
    final goalsJson = prefs.getString('goals');
    if (goalsJson != null) {
      final List<dynamic> list = json.decode(goalsJson);
      _goals = list.map((e) => Goal.fromJson(e)).toList();
    }
    
    notifyListeners();
  }
  
  // Save data to local storage
  Future<void> _saveData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('transactions', json.encode(_transactions.map((e) => e.toJson()).toList()));
    await prefs.setString('investments', json.encode(_investments.map((e) => e.toJson()).toList()));
    await prefs.setString('goals', json.encode(_goals.map((e) => e.toJson()).toList()));
  }
  
  // Transaction methods
  void addTransaction(Transaction transaction) {
    _transactions.insert(0, transaction);
    _saveData();
    notifyListeners();
  }
  
  void deleteTransaction(String id) {
    _transactions.removeWhere((t) => t.id == id);
    _saveData();
    notifyListeners();
  }
  
  // Investment methods
  void addInvestment(Investment investment) {
    _investments.insert(0, investment);
    _saveData();
    notifyListeners();
  }
  
  void deleteInvestment(String id) {
    _investments.removeWhere((i) => i.id == id);
    _saveData();
    notifyListeners();
  }
  
  // Goal methods
  void addGoal(Goal goal) {
    _goals.add(goal);
    _saveData();
    notifyListeners();
  }
  
  void updateGoal(Goal goal) {
    final index = _goals.indexWhere((g) => g.id == goal.id);
    if (index != -1) {
      _goals[index] = goal;
      _saveData();
      notifyListeners();
    }
  }
  
  void deleteGoal(String id) {
    _goals.removeWhere((g) => g.id == id);
    _saveData();
    notifyListeners();
  }
  
  // Calculations
  double get totalIncome => _transactions
      .where((t) => t.type == 'income')
      .fold(0.0, (sum, t) => sum + t.amount);
  
  double get totalExpense => _transactions
      .where((t) => t.type == 'expense')
      .fold(0.0, (sum, t) => sum + t.amount);
  
  double get totalBalance => totalIncome - totalExpense;
  
  double get totalInvestmentValue {
    double goldValue = _investments
        .where((i) => i.type == 'gold')
        .fold(0.0, (sum, i) => sum + i.quantity) * goldPrice;
    double silverValue = _investments
        .where((i) => i.type == 'silver')
        .fold(0.0, (sum, i) => sum + i.quantity) * silverPrice;
    return goldValue + silverValue;
  }
  
  double get totalInvestmentCost => _investments.fold(0.0, (sum, i) => sum + i.totalAmount);
  
  double get investmentProfitLoss => totalInvestmentValue - totalInvestmentCost;
  
  double get investmentProfitLossPercent =>
      totalInvestmentCost > 0 ? (investmentProfitLoss / totalInvestmentCost * 100) : 0;
}
