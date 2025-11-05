class Goal {
  final String id;
  final String name;
  final double targetAmount;
  final double currentAmount;
  final String icon;
  final DateTime? targetDate;

  Goal({
    required this.id,
    required this.name,
    required this.targetAmount,
    required this.currentAmount,
    required this.icon,
    this.targetDate,
  });

  double get progress => (currentAmount / targetAmount * 100).clamp(0, 100);

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'targetAmount': targetAmount,
        'currentAmount': currentAmount,
        'icon': icon,
        'targetDate': targetDate?.toIso8601String(),
      };

  factory Goal.fromJson(Map<String, dynamic> json) => Goal(
        id: json['id'],
        name: json['name'],
        targetAmount: (json['targetAmount'] as num).toDouble(),
        currentAmount: (json['currentAmount'] as num).toDouble(),
        icon: json['icon'],
        targetDate: json['targetDate'] != null ? DateTime.parse(json['targetDate']) : null,
      );
}
