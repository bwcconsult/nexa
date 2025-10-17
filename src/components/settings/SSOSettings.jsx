import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Key, Check, AlertTriangle } from 'lucide-react';

export default function SSOSettings() {
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [samlEnabled, setSamlEnabled] = useState(false);
  const [oauth, setOauth] = useState({
    google: true,
    microsoft: true,
    okta: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Single Sign-On (SSO) & Authentication</h2>
        <p className="text-slate-600 dark:text-slate-400">Enterprise-grade security and authentication</p>
      </div>

      {/* OAuth Providers */}
      <Card>
        <CardHeader><CardTitle>OAuth 2.0 Providers</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {['Google', 'Microsoft', 'Okta', 'Auth0'].map(provider => (
            <div key={provider} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <div>
                  <h4 className="font-medium">{provider}</h4>
                  <p className="text-sm text-slate-500">OAuth 2.0 authentication</p>
                </div>
              </div>
              <Switch checked={oauth[provider.toLowerCase()]} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SAML Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SAML 2.0 Configuration</CardTitle>
            <Switch checked={samlEnabled} onCheckedChange={setSamlEnabled} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Entity ID</Label>
            <Input value="https://yourcrm.com/saml/metadata" readOnly />
          </div>
          <div>
            <Label>SSO URL</Label>
            <Input value="https://yourcrm.com/saml/sso" readOnly />
          </div>
          <div>
            <Label>X.509 Certificate</Label>
            <Textarea rows={5} placeholder="Paste your SAML certificate here" />
          </div>
          <Button className="gap-2">
            <Key className="w-4 h-4" />Upload Certificate
          </Button>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader><CardTitle>Security Features</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: '2FA Required', desc: 'Enforce two-factor authentication', enabled: true },
            { name: 'Password Policy', desc: 'Strong password requirements', enabled: true },
            { name: 'Session Timeout', desc: 'Auto logout after 30 minutes', enabled: true },
            { name: 'IP Whitelist', desc: 'Restrict access by IP address', enabled: false },
          ].map(feature => (
            <div key={feature.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {feature.enabled ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              </div>
              <Switch checked={feature.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
