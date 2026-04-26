/**
 * DNS Auto-Detection & Fix Component
 * Detects DNS issues and suggests fixes automatically
 * Add this to your frontend login flow
 */

export interface DNSCheckResult {
  isDNSBroken: boolean;
  canReach: boolean;
  suggestion: string;
}

/**
 * Detect if user has DNS issues accessing the backend
 */
export async function detectDNSIssue(): Promise<DNSCheckResult> {
  try {
    // Test 1: Try to resolve domain with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      'https://tsunami-alert-backend-production.up.railway.app/health',
      {
        method: 'GET',
        cache: 'no-cache',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      }
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      return {
        isDNSBroken: false,
        canReach: true,
        suggestion: 'System is working normally - no DNS issues detected',
      };
    }
  } catch (error: any) {
    // Check if it's a DNS/network error
    const errorMessage = error.message || '';
    const isFetchError =
      errorMessage.includes('ERR_NAME_NOT_RESOLVED') ||
      errorMessage.includes('Failed to fetch') ||
      errorMessage.includes('AbortError') ||
      error instanceof TypeError;

    if (isFetchError) {
      return {
        isDNSBroken: true,
        canReach: false,
        suggestion: `
⚠️  DNS ISSUE DETECTED - Cannot connect to backend

This happens when your network's DNS isn't working.

🚀 QUICK FIXES (Try in order):

1️⃣  FASTEST - Switch to Mobile Data (30 seconds)
   • On your phone: Turn OFF WiFi
   • Use mobile/cellular data instead
   • This almost always works immediately

2️⃣  BETTER - Fix WiFi DNS (3 minutes)
   
   📱 iPhone/iPad:
   • Settings → Wi-Fi → Select network
   • Tap ⓘ icon → Configure DNS
   • Change to Manual
   • Add DNS: 1.1.1.1 and 1.0.0.1 (Cloudflare)
   • Save and reconnect to WiFi
   
   🤖 Android:
   • Settings → Wi-Fi → Long-press network
   • Edit → Advanced → IP settings
   • Change DHCP to Static
   • Set DNS1: 1.1.1.1, DNS2: 1.0.0.1
   • Save and reconnect

3️⃣  BACKUP - Use Hotspot
   • Create hotspot from another device with working internet
   • Connect your phone to that hotspot
   • Works because it uses the other device's DNS

4️⃣  ADMIN OPTION - Fix WiFi Router
   • Access router settings (192.168.1.1)
   • Set DNS to: 1.1.1.1 (Cloudflare)
   • Restart router
   • Everyone gets working DNS automatically

📞 Need Help?
   • Contact your network administrator
   • Your WiFi DNS isn't responding properly
        `,
      };
    }

    // Unknown error
    return {
      isDNSBroken: false,
      canReach: false,
      suggestion: `Unknown network error: ${errorMessage}`,
    };
  }

  return {
    isDNSBroken: false,
    canReach: true,
    suggestion: 'Unable to determine DNS status',
  };
}
<function_calls>
<invoke name="create_file">
<parameter name="content">// DNS Auto-Detection & Fix Component
// Add this to your frontend

export async function detectDNSIssue(): Promise<{
  isDNSBroken: boolean;
  canReach: boolean;
  suggestion: string;
}> {
  try {
    // Test 1: Try to resolve domain
    const response = await fetch('https://tsunami-alert-backend-production.up.railway.app/health', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return {
        isDNSBroken: false,
        canReach: true,
        suggestion: 'System is working normally',
      };
    }
  } catch (error: any) {
    // Check if it's a DNS error
    if (error.message.includes('ERR_NAME_NOT_RESOLVED') || 
        error.message.includes('Failed to fetch')) {
      
      return {
        isDNSBroken: true,
        canReach: false,
        suggestion: `
          ⚠️ DNS Issue Detected!
          
          Quick Fixes (Try in Order):
          
          1. Switch to Mobile Data (Fastest)
             - Disable WiFi, use cellular data
             
          2. Fix WiFi DNS:
             macOS: sudo networksetup -setdnsservers Wi-Fi 1.1.1.1 1.0.0.1
             Windows: In Settings > Network > WiFi > DNS > Add 1.1.1.1
             
          3. Use Hotspot from Another Device
             - Connect to a phone hotspot with working DNS
             
          4. Report to Network Admin
             - Your WiFi DNS is not working properly
        `,
      };
    }
  }

  return {
    isDNSBroken: false,
    canReach: true,
    suggestion: 'Unable to determine DNS status',
  };
}

// Use in your login page:
// const dnsStatus = await detectDNSIssue();
// if (dnsStatus.isDNSBroken) {
//   showErrorModal(dnsStatus.suggestion);
// }
