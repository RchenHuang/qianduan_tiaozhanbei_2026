#!/bin/bash

# 创建Firefox配置目录
CONFIG_DIR="$HOME/.mozilla/firefox/health-monitor-profile"
PROFILE_NAME="health-monitor"

echo "Creating Firefox profile for health monitor..."

# 创建配置目录
mkdir -p "$CONFIG_DIR"

# 创建prefs.js配置文件
cat > "$CONFIG_DIR/prefs.js" << EOF
user_pref("security.fileuri.strict_origin_policy", false);
user_pref("security.fileuri.warn_on_mismatch", false);
user_pref("browser.shell.checkDefaultBrowser", false);
EOF

echo "Firefox profile created at: $CONFIG_DIR"
echo "To use this profile, run:"
echo "firefox -profile \"$CONFIG_DIR\" file://$(pwd)/dist/index.html"