class Investment {
  final String id;
  final String type; // 'gold' or 'silver'
  final double quantity;
  final double pricePerUnit;
  final double totalAmount;
  final DateTime date;

  Investment({
    required this.id,
    required this.type,
    required this.quantity,
    required this.pricePerUnit,
    required this.totalAmount,
    required this.date,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'quantity': quantity,
        'pricePerUnit': pricePerUnit,
        'totalAmount': totalAmount,
        'date': date.toIso8601String(),
      };

  factory Investment.fromJson(Map<String, dynamic> json) => Investment(
        id: json['id'],
        type: json['type'],
        quantity: (json['quantity'] as num).toDouble(),
        pricePerUnit: (json['pricePerUnit'] as num).toDouble(),
        totalAmount: (json['totalAmount'] as num).toDouble(),
        date: DateTime.parse(json['date']),
      );
}
