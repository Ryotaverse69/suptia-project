#!/bin/bash

echo "========================================="
echo "  suptia.com SSL証明書チェックツール"
echo "========================================="
echo ""

# 1. 基本的な接続テスト
echo "1. HTTPS接続テスト..."
if curl -Is https://suptia.com > /dev/null 2>&1; then
    echo "   ✅ HTTPSで接続可能"
else
    echo "   ❌ HTTPS接続エラー"
fi

# 2. 証明書の有効期限を確認
echo ""
echo "2. SSL証明書の有効期限:"
dates=$(echo | openssl s_client -connect suptia.com:443 -servername suptia.com 2>/dev/null | openssl x509 -noout -dates)
if [ $? -eq 0 ]; then
    echo "$dates" | sed 's/^/   /'

    # 有効期限までの日数を計算
    end_date=$(echo "$dates" | grep notAfter | cut -d= -f2)
    if [ "$(uname)" = "Darwin" ]; then
        # macOS
        end_timestamp=$(date -j -f "%b %d %H:%M:%S %Y %Z" "$end_date" +%s 2>/dev/null)
    else
        # Linux
        end_timestamp=$(date -d "$end_date" +%s 2>/dev/null)
    fi

    if [ -n "$end_timestamp" ]; then
        current_timestamp=$(date +%s)
        days_left=$(( ($end_timestamp - $current_timestamp) / 86400 ))
        echo "   📅 有効期限まで: ${days_left}日"
    fi
else
    echo "   ❌ 証明書情報を取得できません"
fi

# 3. 証明書の発行者を確認
echo ""
echo "3. 証明書の発行情報:"
issuer_info=$(echo | openssl s_client -connect suptia.com:443 -servername suptia.com 2>/dev/null | openssl x509 -noout -subject -issuer)
if [ $? -eq 0 ]; then
    echo "$issuer_info" | sed 's/^/   /'
else
    echo "   ❌ 発行者情報を取得できません"
fi

# 4. 証明書の検証
echo ""
echo "4. 証明書の検証状態:"
verify=$(echo | openssl s_client -connect suptia.com:443 -servername suptia.com 2>/dev/null | grep "Verify return code")
if echo "$verify" | grep -q "0 (ok)"; then
    echo "   ✅ 証明書は有効です"
else
    echo "   ⚠️  検証結果: $verify"
fi

# 5. HTTPステータス確認
echo ""
echo "5. HTTPステータス:"
status=$(curl -Is https://suptia.com 2>/dev/null | head -1)
echo "   $status"

# 6. DNS解決
echo ""
echo "6. DNS解決:"
dns_result=$(nslookup suptia.com 2>/dev/null | grep -A1 "Name:" | tail -1)
echo "   $dns_result"

echo ""
echo "========================================="
echo "チェック完了: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="