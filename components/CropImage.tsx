import React, { useMemo, useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default function CropImage({
  imageUri,
  points,
  onDone,
  quality = 0.95,
}: {
  imageUri: string;
  points: [number, number][];
  onDone: (dataUrl: string, size: { W: number; H: number }) => void;
  quality?: number;
}) {
  const ref = useRef<WebView>(null);

  const html = useMemo(
    () => `
<!doctype html><html><head><meta charset="utf-8" />
<script src="https://docs.opencv.org/4.x/opencv.js"></script>
<style>html,body,canvas{margin:0;padding:0}</style>
</head><body>
<canvas id="c"></canvas>
<script>
const post = (msg)=>window.ReactNativeWebView.postMessage(JSON.stringify(msg));

function run(uri, pts, quality){
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.getElementById('c');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    let src = cv.imread(canvas);
    const W1 = Math.hypot(pts[1][0]-pts[0][0], pts[1][1]-pts[0][1]);
    const W2 = Math.hypot(pts[2][0]-pts[3][0], pts[2][1]-pts[3][1]);
    const H1 = Math.hypot(pts[3][0]-pts[0][0], pts[3][1]-pts[0][1]);
    const H2 = Math.hypot(pts[2][0]-pts[1][0], pts[2][1]-pts[1][1]);
    const W = Math.round(Math.max(W1,W2));
    const H = Math.round(Math.max(H1,H2));

    const srcTri = cv.matFromArray(4,1,cv.CV_32FC2, [
      pts[0][0],pts[0][1], pts[1][0],pts[1][1],
      pts[2][0],pts[2][1], pts[3][0],pts[3][1]
    ]);
    const dstTri = cv.matFromArray(4,1,cv.CV_32FC2, [0,0, W-1,0, W-1,H-1, 0,H-1]);
    const M = cv.getPerspectiveTransform(srcTri, dstTri);

    let dst = new cv.Mat();
    cv.warpPerspective(src, dst, M, new cv.Size(W,H), cv.INTER_LINEAR, cv.BORDER_REPLICATE);

    // draw result and send back
    canvas.width = W; canvas.height = H;
    cv.imshow('c', dst);
    const dataUrl = canvas.toDataURL('image/jpeg', quality);

    post({ dataUrl, W, H });

    // cleanup
    src.delete(); dst.delete(); srcTri.delete(); dstTri.delete(); M.delete();
  };
  img.onerror = () => post({ error: 'image-load-failed' });
  img.src = uri;
}

window.addEventListener('message', (e)=>{
  const { uri, pts, quality } = JSON.parse(e.data);
  if (cv && cv['onRuntimeInitialized']) {
    cv['onRuntimeInitialized'] = ()=> run(uri, pts, quality);
  } else {
    run(uri, pts, quality);
  }
});
</script>
</body></html>`,
    []
  );

  return (
    <View style={{ width: 1, height: 1, opacity: 0 }}>
      <WebView
        ref={ref}
        originWhitelist={["*"]}
        source={{ html }}
        onLoad={() => {
          ref.current?.postMessage(
            JSON.stringify({ uri: imageUri, pts: points, quality })
          );
        }}
        onMessage={(e) => {
          const payload = JSON.parse(e.nativeEvent.data);
          if (payload?.dataUrl)
            onDone(payload.dataUrl, { W: payload.W, H: payload.H });
        }}
      />
    </View>
  );
}
