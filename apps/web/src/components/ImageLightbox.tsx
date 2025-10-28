"use client";

import { useState, useRef, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function ImageLightbox({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 0,
    y: 0,
    imgWidth: 0,
    imgHeight: 0,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  // 虫眼鏡のサイズと拡大率
  const magnifierSize = 150;
  const zoomLevel = 2.5;

  const openLightbox = () => setIsOpen(true);
  const closeLightbox = () => setIsOpen(false);

  // マウス移動時の虫眼鏡効果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 画像の実際の表示サイズを保存
    setMagnifierPosition({
      x,
      y,
      imgWidth: rect.width,
      imgHeight: rect.height,
    });
  };

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);

  return (
    <>
      {/* サムネイル画像（クリック可能 + ホバーで虫眼鏡） */}
      <div
        className="relative group cursor-zoom-in overflow-hidden rounded-lg"
        onClick={openLightbox}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 元画像 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`rounded-lg shadow-sm transition-all duration-300 ${className}`}
          loading="eager"
        />

        {/* 虫眼鏡エフェクト（ホバー時） */}
        {showMagnifier && magnifierPosition.imgWidth > 0 && (
          <div
            className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full"
            style={{
              width: `${magnifierSize}px`,
              height: `${magnifierSize}px`,
              left: `${magnifierPosition.x - magnifierSize / 2}px`,
              top: `${magnifierPosition.y - magnifierSize / 2}px`,
              backgroundImage: `url(${src})`,
              backgroundSize: `${magnifierPosition.imgWidth * zoomLevel}px ${magnifierPosition.imgHeight * zoomLevel}px`,
              backgroundPosition: `-${magnifierPosition.x * zoomLevel - magnifierSize / 2}px -${magnifierPosition.y * zoomLevel - magnifierSize / 2}px`,
              backgroundRepeat: "no-repeat",
              opacity: 0.95,
            }}
          />
        )}

        {/* ホバー時のヒント */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
            <ZoomIn size={32} />
            <span className="text-sm font-medium">クリックで拡大</span>
          </div>
        </div>
      </div>

      {/* Lightboxモーダル（全体拡大表示） */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* 閉じるボタン */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="閉じる"
          >
            <X className="text-white" size={32} />
          </button>

          {/* 拡大画像 */}
          <div
            className="relative max-w-7xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
