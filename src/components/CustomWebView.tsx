import * as React from "react";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { WebView, WebViewNavigation } from "react-native-webview";

type CustomWebViewProps = {
  url: string;
};

const CustomWebView: React.FC<CustomWebViewProps> = ({
  url
}: CustomWebViewProps) => {
  const [viewUrl, setViewUrl] = useState(url);
  const handleShouldtStartLoadWithRequest = (e: WebViewNavigation) => {
    const { navigationType, url } = e;

    if (url.startsWith("kakaotalk://")) {
      console.log(`${url} : kakaotoalk://`);
      return false;
    } else if (url.startsWith("intent://")) {
      console.log(`${url} : intent://`);
      return false;
    }
    return true;
  };

  useEffect(() => {
    console.log(url);
  }, [url]);

  return (
    <WebView
      source={{ uri: url }}
      onShouldStartLoadWithRequest={handleShouldtStartLoadWithRequest}
    />
  );
};

export default CustomWebView;
