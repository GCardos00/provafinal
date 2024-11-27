#include <WiFi.h> // Para ESP32 (use <ESP8266WiFi.h> se estiver usando ESP8266)
#include <FirebaseESP32.h> // Altere para FirebaseESP8266.h se usar ESP8266
#include <DHT.h>

// Configurações do Firebase
#define FIREBASE_HOST "seu-projeto.firebaseio.com" // Substitua pelo seu Firebase host
#define FIREBASE_AUTH "seu-token-do-firebase" // Substitua pelo token do Firebase

// Configurações Wi-Fi
#define WIFI_SSID "sua-rede-wifi"
#define WIFI_PASSWORD "sua-senha-wifi"

// Configurações do DHT11
#define DHTPIN 4  // Pino GPIO onde o DHT11 está conectado
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Firebase
FirebaseData firebaseData;

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Conectar ao Wi-Fi
  Serial.println("Conectando ao WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando...");
  }
  Serial.println("WiFi conectado.");

  // Conectar ao Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  Serial.println("Conectado ao Firebase.");
}

void loop() {
  float temperatura = dht.readTemperature();
  float umidade = dht.readHumidity();

  // Verificar se a leitura está correta
  if (isnan(temperatura) || isnan(umidade)) {
    Serial.println("Falha ao ler o sensor DHT11!");
    return;
  }

  // Obter a data e hora do RTC interno (ou manualmente)
  String data = "2024-11-27"; // Ajuste conforme necessário
  String hora = "14:00";      // Ajuste conforme necessário

  // Criar a estrutura para salvar no Firebase
  String path = "/leituras";
  String id = String(millis() / 1000); // Gerar um ID único (timestamp em segundos)
  String fullPath = path + "/" + id;

  FirebaseJson json;
  json.set("temperatura", temperatura);
  json.set("umidade", umidade);
  json.set("data", data);
  json.set("hora", hora);

  // Salvar no Firebase
  if (Firebase.pushJSON(firebaseData, fullPath, json)) {
    Serial.println("Dados enviados com sucesso:");
    Serial.println(fullPath);
    Serial.println(json.raw());
  } else {
    Serial.println("Falha ao enviar dados:");
    Serial.println(firebaseData.errorReason());
  }

  // Aguardar 10 segundos antes da próxima leitura
  delay(10000);
}
