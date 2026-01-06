"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented to cookies
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a3d2e] text-white p-4 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm">
              Мы используем файлы cookie для улучшения работы сайта и предоставления более персонализированного опыта. 
              Продолжая использовать наш сайт, вы соглашаетесь с использованием файлов cookie.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={declineCookies}
              className="text-white border-white hover:bg-white/10"
            >
              Отклонить
            </Button>
            <Button 
              onClick={acceptCookies}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Принять
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}