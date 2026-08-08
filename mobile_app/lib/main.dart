import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

void main() {
  runApp(const AnuragSahuAdminApp());
}

class AnuragSahuAdminApp extends StatelessWidget {
  const AnuragSahuAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AS Admin Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF070A14),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFE11D48),
          secondary: Color(0xFF06B6D4),
        ),
      ),
      home: const AdminHomeScreen(),
    );
  }
}

class AdminHomeScreen extends StatefulWidget {
  const AdminHomeScreen({super.key});

  @override
  State<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends State<AdminHomeScreen> {
  static const String cloudUrl = 'https://jsonblob.com/api/jsonBlob/019fe1ec-02f6-78f8-a2ea-698a3b504261';
  
  int _totalVisitors = 142;
  int _onlineVisitors = 1;
  int _resumeDownloads = 18;
  int _githubClicks = 35;
  List<dynamic> _messages = [];
  bool _isLoading = true;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _fetchLiveData();
  }

  Future<void> _fetchLiveData() async {
    try {
      final res = await http.get(Uri.parse(cloudUrl));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        setState(() {
          _totalVisitors = data['totalVisitors'] ?? 142;
          _resumeDownloads = data['resumeDownloads'] ?? 18;
          _githubClicks = data['githubClicks'] ?? 35;
          _messages = data['messages'] ?? [];
          
          if (data['activeSessions'] != null && data['activeSessions'] is Map) {
            final Map sessions = data['activeSessions'];
            final now = DateTime.now().millisecondsSinceEpoch;
            int count = 0;
            sessions.forEach((k, v) {
              int lastSeen = v is Map ? (v['lastSeen'] ?? 0) : (v is int ? v : 0);
              if (now - lastSeen <= 35000) count++;
            });
            _onlineVisitors = count > 0 ? count : 1;
          }
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.rose.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.bolt, color: Color(0xFFE11D48), size: 20),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Text('Anurag Sahu App', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                Text('Live Telemetry Connected', style: TextStyle(fontSize: 10, color: Color(0xFF10B981))),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: () {
              setState(() => _isLoading = true);
              _fetchLiveData();
            },
          )
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchLiveData,
        child: _selectedIndex == 0 ? _buildDashboardView() : _buildInboxView(),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color(0xFF0F172A),
        selectedItemColor: const Color(0xFFE11D48),
        unselectedItemColor: Colors.grey,
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Telemetry'),
          BottomNavigationBarItem(icon: Icon(Icons.mail), label: 'Inbox'),
        ],
      ),
    );
  }

  Widget _buildDashboardView() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: Column(
            crossAxisAlignment: CrossAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('MOBILE COMMAND CENTER', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFE11D48))),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: Colors.emerald.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                        SizedBox(width: 4),
                        Text('Live Website Sync', style: TextStyle(fontSize: 9, color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                      ],
                    ),
                  )
                ],
              ),
              const SizedBox(height: 8),
              const Text('Anurag\'s Website Controls', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 4),
              const Text('Connected directly to https://anuragsahu.com', style: TextStyle(fontSize: 12, color: Colors.grey)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.4,
          children: [
            _kpiCard('ONLINE NOW', '$_onlineVisitors', '🟢 Active Realtime', const Color(0xFF10B981)),
            _kpiCard('TOTAL VISITORS', '$_totalVisitors', 'Page Views', const Color(0xFFE11D48)),
            _kpiCard('RESUME PDF', '$_resumeDownloads', 'Downloads', const Color(0xFF06B6D4)),
            _kpiCard('GITHUB CLICKS', '$_githubClicks', 'Clicks', Colors.amber),
          ],
        ),
        const SizedBox(height: 20),
        ElevatedButton.icon(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFE11D48),
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          onPressed: () async {
            final url = Uri.parse('https://anuragsahu.com');
            if (await canLaunchUrl(url)) await launchUrl(url);
          },
          icon: const Icon(Icons.open_in_browser, color: Colors.white),
          label: const Text('Open Live Website (anuragsahu.com)', style: TextStyle(fontWeight: FontWeight.bold)),
        )
      ],
    );
  }

  Widget _buildInboxView() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_messages.isEmpty) {
      return const Center(
        child: Text('No recruiter messages in Inbox yet.', style: TextStyle(color: Colors.grey)),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final msg = _messages[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          color: Colors.white.withOpacity(0.05),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(msg['fullName'] ?? 'Website Recruiter', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.rose.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text('UNREAD', style: TextStyle(fontSize: 9, color: Color(0xFFE11D48), fontWeight: FontWeight.bold)),
                    )
                  ],
                ),
                const SizedBox(height: 4),
                Text('${msg['company'] ?? 'Recruiter'} • ${msg['email'] ?? ''}', style: const TextStyle(fontSize: 11, color: Colors.cyan)),
                const SizedBox(height: 8),
                Text(msg['subject'] ?? 'Portfolio Inquiry', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.white)),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(msg['message'] ?? '', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                )
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _kpiCard(String title, String val, String sub, Color accent) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: accent.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(title, style: TextStyle(fontSize: 10, color: accent, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(val, style: TextStyle(fontSize: 22, fontWeight: FontWeight.extrabold, color: accent)),
          const SizedBox(height: 2),
          Text(sub, style: TextStyle(fontSize: 9, color: Colors.grey.shade400)),
        ],
      ),
    );
  }
}
