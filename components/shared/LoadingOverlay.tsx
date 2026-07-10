"use client";

import React, { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import BookLoader from "./BookLoader";

// Inner listener component wrapped in Suspense to avoid build-time static deoptimization
function NavigationListener({ onChange }: { onChange: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onChange();
  }, [pathname, searchParams, onChange]);

  return null;
}

export default function LoadingOverlay() {
  const [isMounted, setIsMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeRequests, setActiveRequests] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor the global Redux loading slice state
  const isReduxLoading = useSelector(
    (state: any) => state?.loaderSlice?.value?.isLoading || false
  );

  // Set mounted on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const clearNavigationTimeout = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
      navigationTimeoutRef.current = null;
    }
  }, []);

  const handleNavigationEnd = useCallback(() => {
    clearNavigationTimeout();
    setIsNavigating(false);
  }, [clearNavigationTimeout]);

  const handleNavigationStart = useCallback(() => {
    clearNavigationTimeout();
    setIsNavigating(true);
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      navigationTimeoutRef.current = null;
    }, 8000);
  }, [clearNavigationTimeout]);

  // Intercept global Axios API requests and monkeypatch window history routing
  useEffect(() => {
    if (!isMounted) return;

    // 1. Axios Request and Response Interceptors
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        setActiveRequests((prev) => prev + 1);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setActiveRequests((prev) => Math.max(0, prev - 1));
        return response;
      },
      (error) => {
        setActiveRequests((prev) => Math.max(0, prev - 1));
        return Promise.reject(error);
      }
    );

    // 2. Monkeypatch History API to detect routing changes
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const handleRouteChangeStart = (url: string | URL | null | undefined) => {
      if (!url) return;

      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(url.toString(), window.location.origin);

        // Only trigger loading for internal route transitions
        if (targetUrl.origin === currentUrl.origin) {
          if (
            targetUrl.pathname !== currentUrl.pathname ||
            targetUrl.search !== currentUrl.search
          ) {
            handleNavigationStart();
          }
        }
      } catch (e) {
        // Fallback: trigger loader if parsing fails
        handleNavigationStart();
      }
    };

    window.history.pushState = function (...args) {
      handleRouteChangeStart(args[2]);
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      handleRouteChangeStart(args[2]);
      return originalReplaceState.apply(this, args);
    };

    // 3. Listen to browser Back/Forward (popstate)
    const handlePopState = () => {
      handleNavigationStart();
    };
    window.addEventListener("popstate", handlePopState);

    // 4. Browser back/forward cache and tab restore can bring the previous
    // page back without a fresh App Router pathname notification.
    const handlePageShow = () => {
      handleNavigationEnd();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleNavigationEnd();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearNavigationTimeout();
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMounted, handleNavigationStart, handleNavigationEnd, clearNavigationTimeout]);

  // Combine loading triggers
  const isAnyLoading = isNavigating || isReduxLoading || activeRequests > 0;

  // Apply debounce to prevent flickering on fast requests or instantaneous navigation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnyLoading) {
      timer = setTimeout(() => {
        setShowLoader(true);
      }, 200);
    } else {
      setShowLoader(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAnyLoading]);

  // Hide loader on server-side rendering or before mounting
  if (!isMounted) return null;

  return (
    <>
      <Suspense fallback={null}>
        <NavigationListener onChange={handleNavigationEnd} />
      </Suspense>

      {showLoader && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/40 backdrop-blur-md fade-in-backdrop">
          <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl">
            <BookLoader size="lg" />
            <div className="text-center">
              <span className="loading-text text-lg md:text-xl font-medium tracking-wide">
                IST Journal
              </span>
              <p className="text-[10px] text-white/40 mt-1.5 uppercase tracking-[0.2em] font-semibold">
                Loading content
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
