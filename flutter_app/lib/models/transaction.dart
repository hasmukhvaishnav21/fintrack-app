class Transaction {
  final String id;
  final String type; // 'income' or 'expense'
  final double amount;
  final String category;
  final String? description;
  final DateTime date;

  Transaction({
    required this.id,
    required this.type,
    required this.amount,
    required this.category,
    this.description,
    required this.date,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'amount': amount,
        'category': category,
        'description': description,
        'date': date.toIso8601String(),
      };

  factory Transaction.fromJson(Map<String, dynamic> json) => Transaction(
        id: json['id'],
        type: json['type'],
        amount: (json['amount'] as num).toDouble(),
        category: json['category'],
        description: json['description'],
        date: DateTime.parse(json['date']),
      );
}
