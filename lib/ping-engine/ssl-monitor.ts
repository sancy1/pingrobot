// lib/ping-engine/ssl-monitor.ts
// SSL Certificate monitoring - Checks expiry dates and validity
// Optimized to prevent Next.js compilation crashes across serverless environments

export interface SSLInfo {
  valid: boolean;
  expiryDate: Date | null;
  daysRemaining: number;
  issuer: string;
  subject: string;
  protocol: string;
  error?: string;
}

export class SSLMonitor {
  
  /**
   * Check SSL certificate for a given URL
   * Connects via TLS socket to extract certificate information
   */
  static async checkCertificate(url: string): Promise<SSLInfo> {
    // Extract hostname from URL
    let hostname: string;
    try {
      hostname = new URL(url).hostname;
    } catch {
      return {
        valid: false,
        expiryDate: null,
        daysRemaining: 0,
        issuer: 'Error',
        subject: 'Error',
        protocol: 'None',
        error: 'Invalid URL format',
      };
    }

    // Guard checking if protocol requires active handshake loops
    if (!url.startsWith('https://')) {
      return {
        valid: false,
        expiryDate: null,
        daysRemaining: 0,
        issuer: 'N/A',
        subject: 'N/A',
        protocol: 'HTTP',
        error: 'SSL verification skipped for non-secure HTTP endpoint',
      };
    }
    
    return new Promise(async (resolve) => {
      let socket: any = null;
      let timeout: NodeJS.Timeout | null = null;

      try {
        // 🚀 FIXED: String variable reference trick hides the module from static Webpack analyzer engines completely
        const moduleIdentifier = 'tls';
        const tls = await import(moduleIdentifier);

        socket = tls.connect({
          host: hostname,
          port: 443,
          servername: hostname,
          rejectUnauthorized: false, // Don't reject on expiry, we want to read the raw certificate properties
        });
        
        timeout = setTimeout(() => {
          if (socket) socket.destroy();
          resolve({
            valid: false,
            expiryDate: null,
            daysRemaining: 0,
            issuer: 'Timeout',
            subject: 'Timeout',
            protocol: 'None',
            error: 'Connection timeout during TLS handshake',
          });
        }, 10000);
        
        socket.on('secureConnect', () => {
          if (timeout) clearTimeout(timeout);
          const certificate = socket.getPeerCertificate();
          
          if (!certificate || Object.keys(certificate).length === 0) {
            socket.destroy();
            resolve({
              valid: false,
              expiryDate: null,
              daysRemaining: 0,
              issuer: 'Unknown',
              subject: 'Unknown',
              protocol: 'None',
              error: 'No peer certificate found on active secure session',
            });
            return;
          }
          
          const expiryDate = certificate.valid_to ? new Date(certificate.valid_to) : null;
          const daysRemaining = expiryDate 
            ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : 0;
          
          socket.destroy();
          
          resolve({
            valid: daysRemaining > 0,
            expiryDate: expiryDate,
            daysRemaining: daysRemaining,
            issuer: certificate.issuer?.O || certificate.issuer?.CN || 'Unknown',
            subject: certificate.subject?.CN || 'Unknown',
            protocol: typeof socket.getProtocol === 'function' ? socket.getProtocol() : 'TLS',
          });
        });
        
        socket.on('error', (error: any) => {
          if (timeout) clearTimeout(timeout);
          if (socket) socket.destroy();
          resolve({
            valid: false,
            expiryDate: null,
            daysRemaining: 0,
            issuer: 'Error',
            subject: 'Error',
            protocol: 'None',
            error: error.message,
          });
        });

      } catch (runtimeErr: any) {
        // 🚀 FIXED: Clear timeout and return response instead of locking the thread in an open state
        if (timeout) clearTimeout(timeout);
        if (socket) {
          try { socket.destroy(); } catch (_) {}
        }
        
        resolve({
          valid: false,
          expiryDate: null,
          daysRemaining: 0,
          issuer: 'Runtime Environment Error',
          subject: 'Runtime Environment Error',
          protocol: 'None',
          error: `TLS sockets unavailable in current environment: ${runtimeErr.message}`,
        });
      }
    });
  }
  
  /**
   * Get warning message based on days remaining
   */
  static getExpiryWarning(daysRemaining: number): { severity: 'critical' | 'warning' | 'info' | null; message: string } | null {
    if (daysRemaining <= 0) {
      return {
        severity: 'critical',
        message: '❌ SSL Certificate has expired!',
      };
    } else if (daysRemaining <= 7) {
      return {
        severity: 'critical',
        message: `🚨 SSL Certificate expires in ${daysRemaining} days!`,
      };
    } else if (daysRemaining <= 30) {
      return {
        severity: 'warning',
        message: `⚠️ SSL Certificate expires in ${daysRemaining} days`,
      };
    } else if (daysRemaining <= 60) {
      return {
        severity: 'info',
        message: `ℹ️ SSL Certificate expires in ${daysRemaining} days`,
      };
    }
    
    return null;
  }
}