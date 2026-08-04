import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import NewMovementScreen from "./src/screens/NewMovementScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RemindersScreen from "./src/screens/RemindersScreen";
import PlannerScreen from "./src/screens/PlannerScreen";
import { setAuthToken } from "./src/services/api";
import { getMobileCurrencySymbol } from "./src/utils/currency";

const STATUSBAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(true); // Por defecto modo oscuro como la Web

  const [currency, setCurrency] = useState(getMobileCurrencySymbol());

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab("dashboard");
    setCurrentScreen("app");
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    setCurrentScreen("login");
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  if (currentScreen === "splash") {
    return <SplashScreen onFinish={() => setCurrentScreen("login")} />;
  }

  if (currentScreen === "login") {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setCurrentScreen("register")}
        onNavigateToForgot={() => setCurrentScreen("forgot")}
      />
    );
  }

  if (currentScreen === "register") {
    return (
      <RegisterScreen onNavigateToLogin={() => setCurrentScreen("login")} />
    );
  }

  if (currentScreen === "forgot") {
    return (
      <ForgotPasswordScreen
        onNavigateToLogin={() => setCurrentScreen("login")}
      />
    );
  }

  const themeNav = isDarkMode ? darkNavStyles : lightNavStyles;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#111827" : "#F0FDF4" },
      ]}
    >
      {/* Navbar Superior Global FinanceFlow */}
      <View style={themeNav.navbar}>
        <View style={styles.topHeaderRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Image
              source={require("./assets/logo.png")}
              style={{ width: 36, height: 28, resizeMode: "contain" }}
            />
            <Text style={themeNav.brandTitle}>FinanceFlow</Text>
          </View>

          {/* Botón de Cambiar Modo Claro / Modo Oscuro */}
          <TouchableOpacity
            style={themeNav.themeToggleBtn}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <Text style={themeNav.themeToggleText}>
              {isDarkMode ? "☀️ Claro" : "🌙 Oscuro"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menú de Pestañas */}
        <View style={themeNav.navMenu}>
          <TouchableOpacity
            style={[
              themeNav.navItem,
              activeTab === "dashboard" && themeNav.navItemActive,
            ]}
            onPress={() => setActiveTab("dashboard")}
          >
            <Text
              style={[
                themeNav.navItemText,
                activeTab === "dashboard" && themeNav.navItemTextActive,
              ]}
            >
              🏠 Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              themeNav.navItem,
              activeTab === "newMovement" && themeNav.navItemActive,
            ]}
            onPress={() => setActiveTab("newMovement")}
          >
            <Text
              style={[
                themeNav.navItemText,
                activeTab === "newMovement" && themeNav.navItemTextActive,
              ]}
            >
              ➕ Nuevo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              themeNav.navItem,
              activeTab === "reports" && themeNav.navItemActive,
            ]}
            onPress={() => setActiveTab("reports")}
          >
            <Text
              style={[
                themeNav.navItemText,
                activeTab === "reports" && themeNav.navItemTextActive,
              ]}
            >
              📊 Reportes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              themeNav.navItem,
              activeTab === "reminders" && themeNav.navItemActive,
            ]}
            onPress={() => setActiveTab("reminders")}
          >
            <Text
              style={[
                themeNav.navItemText,
                activeTab === "reminders" && themeNav.navItemTextActive,
              ]}
            >
              🔔 Recs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              themeNav.navItem,
              activeTab === "planner" && themeNav.navItemActive,
            ]}
            onPress={() => setActiveTab("planner")}
          >
            <Text
              style={[
                themeNav.navItemText,
                activeTab === "planner" && themeNav.navItemTextActive,
              ]}
            >
              🎯 Metas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              themeNav.navItem,
              activeTab === "profile" && themeNav.navItemActive,
            ]}
            onPress={() => setActiveTab("profile")}
          >
            <Text
              style={[
                themeNav.navItemText,
                activeTab === "profile" && themeNav.navItemTextActive,
              ]}
            >
              👤 Perfil
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido de la Pantalla Activa */}
      <View style={styles.screenContent}>
        {activeTab === "dashboard" && (
          <DashboardScreen
            user={user}
            onNavigateToNewMovement={() => setActiveTab("newMovement")}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            currency={currency}
          />
        )}
        {activeTab === "newMovement" && (
          <NewMovementScreen
            onSaveSuccess={() => setActiveTab("dashboard")}
            onNavigateBack={() => setActiveTab("dashboard")}
            isDarkMode={isDarkMode}
            currency={currency}
          />
        )}
        {activeTab === "reports" && (
          <ReportsScreen
            user={user}
            isDarkMode={isDarkMode}
            currency={currency}
          />
        )}
        {activeTab === "reminders" && (
          <RemindersScreen
            user={user}
            isDarkMode={isDarkMode}
            currency={currency}
          />
        )}
        {activeTab === "planner" && (
          <PlannerScreen
            user={user}
            isDarkMode={isDarkMode}
            currency={currency}
          />
        )}
        {activeTab === "profile" && (
          <ProfileScreen
            user={user}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            onCurrencyChange={(sym) => setCurrency(sym)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  screenContent: {
    flex: 1,
  },
});

const lightNavStyles = StyleSheet.create({
  navbar: {
    backgroundColor: "#6EE7B7",
    paddingTop: STATUSBAR_HEIGHT + 6,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#A7F3D0",
  },
  brandTitle: {
    color: "#065F46",
    fontSize: 18,
    fontWeight: "bold",
  },
  themeToggleBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  themeToggleText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  navMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 10,
    padding: 4,
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: "#059669",
  },
  navItemText: {
    color: "#065F46",
    fontSize: 11,
    fontWeight: "bold",
  },
  navItemTextActive: {
    color: "#FFFFFF",
  },
});

const darkNavStyles = StyleSheet.create({
  navbar: {
    backgroundColor: "#064E3B",
    paddingTop: STATUSBAR_HEIGHT + 6,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#047857",
  },
  brandTitle: {
    color: "#34D399",
    fontSize: 18,
    fontWeight: "bold",
  },
  themeToggleBtn: {
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  themeToggleText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  navMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(17, 24, 39, 0.6)",
    borderRadius: 10,
    padding: 4,
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: "#10B981",
  },
  navItemText: {
    color: "#A7F3D0",
    fontSize: 11,
    fontWeight: "bold",
  },
  navItemTextActive: {
    color: "#FFFFFF",
  },
});
