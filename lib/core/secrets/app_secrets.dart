import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppSecrets {
  static String get supabaseUrl => dotenv.env['SUPABASE_URL'] ?? 'https://your-supabase-url.supabase.co';
  static String get supabaseAnonKey => dotenv.env['SUPABASE_ANON_KEY'] ?? '';
  static String get deepSeekApiKey => dotenv.env['DEEPSEEK_API_KEY'] ?? '';

  // Google Sign-In (Web Client ID from Google Cloud Console)
  static String get googleWebClientId => dotenv.env['GOOGLE_WEB_CLIENT_ID'] ?? '';
}

