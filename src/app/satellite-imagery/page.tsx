'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Satellite,
  Download,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Calendar,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Layers,
  Filter,
  BarChart3,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { useSatelliteData, useLatestSatelliteData } from '@/hooks/useSatellite';

function generateMockSVG(
  region: string,
  hue: number,
  score: number,
  lat: string,
  lon: string,
  label: string
): string {
  const anomalyColor = score > 0.7 ? '%23ef4444' : score > 0.3 ? '%23eab308' : '%2322c55e';
  const anomalyLabel = score > 0.7 ? 'ANOMALY' : score > 0.3 ? 'ELEVATED' : 'NORMAL';
  const noiseRects = Array.from({ length: 50 }, (_, i) => {
    const x = (i * 73 + hue) % 600;
    const y = (i * 47 + hue * 3) % 400;
    const w = 20 + ((i * 13) % 50);
    const h = 10 + ((i * 11) % 30);
    const l = 20 + ((i * 7) % 30);
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="hsl(${hue},${10 + (i % 15)}%25,${l}%25)" opacity="${0.3 + (i % 5) * 0.1}"/>`;
  }).join('');
  const scanLines = Array.from(
    { length: 20 },
    (_, i) => `<rect x="0" y="${i * 20}" width="600" height="1" fill="rgba(255,255,255,0.05)"/>`
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="bg" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" style="stop-color:hsl(${hue},20%25,15%25)"/><stop offset="50%25" style="stop-color:hsl(${hue},15%25,22%25)"/><stop offset="100%25" style="stop-color:hsl(${hue},20%25,18%25)"/></linearGradient></defs><rect width="100%25" height="100%25" fill="url(%23bg)"/>${noiseRects}${scanLines}<line x1="300" y1="0" x2="300" y2="400" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4,8"/><line x1="0" y1="200" x2="600" y2="200" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4,8"/><rect x="12" y="12" width="280" height="70" rx="6" fill="rgba(0,0,0,0.6)"/><text x="22" y="32" font-family="monospace" font-size="11" fill="%2394a3b8">SENTINEL-1 SAR</text><text x="22" y="52" font-family="Arial,sans-serif" font-size="15" fill="white" font-weight="bold">${region}</text><text x="22" y="70" font-family="monospace" font-size="10" fill="%2394a3b8">${lat}N ${lon}E</text><rect x="420" y="12" width="168" height="38" rx="6" fill="rgba(0,0,0,0.6)"/><circle cx="436" cy="31" r="5" fill="${anomalyColor}"/><text x="448" y="27" font-family="monospace" font-size="10" fill="%2394a3b8">ANOMALY</text><text x="448" y="40" font-family="monospace" font-size="11" fill="${anomalyColor}" font-weight="bold">${(score * 100).toFixed(1)}%25 ${anomalyLabel}</text><rect x="0" y="370" width="600" height="30" fill="rgba(0,0,0,0.5)"/><text x="12" y="389" font-family="monospace" font-size="10" fill="%2364748b">${label}</text></svg>`;
  return `data:image/svg+xml,${svg}`;
}

// Mock satellite data
const mockSatelliteData = {
  latest: {
    id: '1',
    imageUrl: generateMockSVG(
      'Pacific Northwest',
      200,
      0.23,
      '45.0',
      '-125.0',
      'MODE: IW | RES: 10m | SOURCE: Simulated'
    ),
    timestamp: new Date().toISOString(),
    region: 'Pacific Northwest',
    regionBounds: [-130, 40, -120, 50],
    regionCenter: [-125, 45],
    anomalyScore: 0.23,
    metadata: {
      satellite: 'Sentinel-1',
      resolution: '100m',
      polarization: 'VV',
      processingLevel: 'Level-1 GRD',
      cloudCover: 0.0,
      dataSource: 'Google Earth Engine',
    },
    processingInfo: {
      baselineComparison: true,
      anomalyThreshold: 0.7,
      processingTime: '2.3s',
      algorithm: 'Statistical Change Detection',
    },
  },
  historical: [
    {
      id: '2',
      imageUrl: generateMockSVG(
        'Japan Trench',
        30,
        0.18,
        '38.0',
        '143.0',
        'MODE: IW | RES: 10m | 6h ago'
      ),
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      region: 'Japan Trench',
      regionBounds: [140, 34, 146, 42],
      regionCenter: [143, 38],
      anomalyScore: 0.18,
      metadata: {
        satellite: 'Sentinel-1',
        resolution: '100m',
        polarization: 'VV',
        processingLevel: 'Level-1 GRD',
        cloudCover: 0.0,
        dataSource: 'Google Earth Engine',
      },
      processingInfo: {
        baselineComparison: true,
        anomalyThreshold: 0.7,
        processingTime: '1.8s',
        algorithm: 'Statistical Change Detection',
      },
    },
    {
      id: '3',
      imageUrl: generateMockSVG(
        'Peru-Chile Trench',
        120,
        0.31,
        '-20.0',
        '-72.0',
        'MODE: IW | RES: 10m | 12h ago'
      ),
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      region: 'Peru-Chile Trench',
      regionBounds: [-76, -24, -68, -16],
      regionCenter: [-72, -20],
      anomalyScore: 0.31,
      metadata: {
        satellite: 'Sentinel-1',
        resolution: '100m',
        polarization: 'VV',
        processingLevel: 'Level-1 GRD',
        cloudCover: 0.0,
        dataSource: 'Google Earth Engine',
      },
      processingInfo: {
        baselineComparison: true,
        anomalyThreshold: 0.7,
        processingTime: '2.5s',
        algorithm: 'Statistical Change Detection',
      },
    },
    {
      id: '4',
      imageUrl: generateMockSVG(
        'Indo-Pacific',
        280,
        0.15,
        '-5.0',
        '110.0',
        'MODE: IW | RES: 10m | 18h ago'
      ),
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      region: 'Indo-Pacific',
      regionBounds: [100, -10, 120, 0],
      regionCenter: [110, -5],
      anomalyScore: 0.15,
      metadata: {
        satellite: 'Sentinel-1',
        resolution: '100m',
        polarization: 'VV',
        processingLevel: 'Level-1 GRD',
        cloudCover: 0.0,
        dataSource: 'Google Earth Engine',
      },
      processingInfo: {
        baselineComparison: true,
        anomalyThreshold: 0.7,
        processingTime: '1.9s',
        algorithm: 'Statistical Change Detection',
      },
    },
  ],
};

export default function SatelliteImageryPage() {
  const {
    data: satelliteDataList,
    loading,
    error,
    refetch,
  } = useSatelliteData(undefined, undefined, { pollInterval: 30000 });
  const { data: latestSatellite } = useLatestSatelliteData(undefined, { pollInterval: 30000 });

  // Use real data if available, otherwise use mock data
  const initialImage = latestSatellite ? latestSatellite : mockSatelliteData.latest;

  const [selectedImage, setSelectedImage] = useState(initialImage);

  // Update selectedImage when real data arrives from the backend
  useEffect(() => {
    if (latestSatellite) {
      setSelectedImage(latestSatellite);
    }
  }, [latestSatellite]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMetadata, setShowMetadata] = useState(true);

  // Helper function to safely get processing info with fallbacks
  const getProcessingInfo = (image: any) => {
    return {
      processingTime: image?.processingInfo?.processingTime || 'N/A',
      algorithm: image?.processingInfo?.algorithm || 'Statistical Change Detection',
      baselineComparison: image?.processingInfo?.baselineComparison ?? true,
      anomalyThreshold: image?.processingInfo?.anomalyThreshold ?? 0.7,
    };
  };

  const getAnomalyColor = (score: number) => {
    if (score < 0.3) return 'text-green-600';
    if (score < 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAnomalyBadgeColor = (score: number) => {
    if (score < 0.3) return 'bg-green-100 text-green-800 border-green-200';
    if (score < 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const handleProcessImage = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error('Failed to refresh satellite data:', err);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                Satellite Imagery Analysis
              </h1>
              <p className="mt-1 text-gray-600">
                Real-time satellite monitoring with anomaly detection
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleProcessImage} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Processing...' : 'Refresh Data'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <div>
                  <h2 className="font-bold text-blue-600">Loading Satellite Data</h2>
                  <p className="text-sm text-blue-600">
                    Fetching imagery from satellite servers...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-2 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <h2 className="font-bold text-red-600">Error Loading Data</h2>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Overview */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Image</CardTitle>
              <Satellite className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Fresh</div>
              <p className="text-xs text-muted-foreground">
                {selectedImage && formatTimeAgo(selectedImage.timestamp)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Anomaly Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${selectedImage ? getAnomalyColor(selectedImage.anomalyScore) : 'text-gray-600'}`}
              >
                {selectedImage ? (selectedImage.anomalyScore * 100).toFixed(1) : '0'}%
              </div>
              <p className="text-xs text-muted-foreground">Current detection level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Source</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedImage?.metadata?.satellite || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedImage?.metadata?.resolution || 'N/A'} resolution
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedImage && getProcessingInfo(selectedImage).processingTime}
              </div>
              <p className="text-xs text-muted-foreground">Analysis duration</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Image Viewer */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Satellite className="h-5 w-5 text-tsunami-blue-600" />
                      <span>Current Satellite Image</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedImage.region} • {new Date(selectedImage.timestamp).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getAnomalyBadgeColor(selectedImage.anomalyScore)}`}>
                      Anomaly: {(selectedImage.anomalyScore * 100).toFixed(1)}%
                    </Badge>
                    {selectedImage.anomalyScore < 0.3 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                      disabled={zoomLevel <= 50}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="px-3 text-sm font-medium">{zoomLevel}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                      disabled={zoomLevel >= 200}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setZoomLevel(100)}>
                      <RotateCcw className="mr-1 h-4 w-4" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowMetadata(!showMetadata)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      {showMetadata ? 'Hide' : 'Show'} Info
                    </Button>
                  </div>
                </div>

                {/* Image Display */}
                <div
                  className="relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800"
                  style={{ minHeight: '400px' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage.imageUrl}
                    alt="Satellite imagery"
                    width={800}
                    height={600}
                    className="h-auto w-full"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.2s ease',
                    }}
                  />

                  {/* Overlay Information */}
                  {showMetadata && (
                    <div className="absolute left-4 top-4 rounded-lg bg-black/80 p-3 text-sm text-white">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-3 w-3" />
                          <span>{selectedImage.region}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(selectedImage.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-3 w-3" />
                          <span>Anomaly: {(selectedImage.anomalyScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processing Overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="rounded-lg bg-white p-6 text-center">
                        <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-tsunami-blue-600" />
                        <p className="font-medium">Processing satellite data...</p>
                        <Progress value={66} className="mt-3 w-48" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-tsunami-green-600" />
                  <span>Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Detection Algorithm</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Algorithm:</span>
                        <span className="font-medium">
                          {selectedImage && getProcessingInfo(selectedImage).algorithm}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Baseline Comparison:</span>
                        <span className="font-medium">
                          {selectedImage && getProcessingInfo(selectedImage).baselineComparison
                            ? 'Yes'
                            : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Threshold:</span>
                        <span className="font-medium">
                          {selectedImage &&
                            (getProcessingInfo(selectedImage).anomalyThreshold * 100).toFixed(0)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Image Metadata</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Satellite:</span>
                        <span className="font-medium">
                          {selectedImage?.metadata?.satellite || 'Sentinel-1'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolution:</span>
                        <span className="font-medium">
                          {selectedImage?.metadata?.resolution || '10m'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cloud Cover:</span>
                        <span className="font-medium">
                          {selectedImage?.metadata?.cloudCover ?? 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Historical Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Images</CardTitle>
                <CardDescription>Historical satellite data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(satelliteDataList && satelliteDataList.length > 0
                  ? satelliteDataList
                  : [selectedImage, ...mockSatelliteData.historical]
                ).map((image: any, index: number) => (
                  <div
                    key={image.id}
                    className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                      selectedImage.id === image.id
                        ? 'border-tsunami-blue-500 bg-tsunami-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {index === 0 ? 'Latest' : image.region || formatTimeAgo(image.timestamp)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Score: {(image.anomalyScore * 100).toFixed(1)}% ·{' '}
                          {formatTimeAgo(image.timestamp)}
                        </p>
                      </div>
                      <Badge className={`text-xs ${getAnomalyBadgeColor(image.anomalyScore)}`}>
                        {image.anomalyScore < 0.3
                          ? 'Normal'
                          : image.anomalyScore < 0.7
                            ? 'Watch'
                            : 'Alert'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleProcessImage}
                  disabled={isProcessing}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reprocess Image
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Layers className="mr-2 h-4 w-4" />
                  View Layers
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Processing Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Pipeline</span>
                    <span className="text-green-600">Operational</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Image Analysis</span>
                    <span className="text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Anomaly Detection</span>
                    <span className="text-green-600">Running</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage</span>
                    <span className="text-yellow-600">78% Used</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
