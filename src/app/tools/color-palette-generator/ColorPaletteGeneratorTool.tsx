'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Copy, Download, RefreshCw, Palette, Eye, EyeOff, Zap, Check, Settings, Shuffle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: Color[];
  type: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic' | 'custom';
}

type ColorBlindnessType = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
type ExportFormat = 'css' | 'scss' | 'tailwind' | 'json' | 'adobe-ase';

export default function ColorPaletteGeneratorTool() {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [activePalette, setActivePalette] = useState<ColorPalette | null>(null);
  const [colorBlindness, setColorBlindness] = useState<ColorBlindnessType>('none');
  const [showAccessibility, setShowAccessibility] = useState(true);
  const [saturation, setSaturation] = useState([70]);
  const [lightness, setLightness] = useState([50]);
  const [paletteSize, setPaletteSize] = useState(5);

  // Color conversion utilities
  const hexToRgb = useCallback((hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }, []);

  const rgbToHsl = useCallback(({ r, g, b }: { r: number; g: number; b: number }): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }, []);

  const hslToHex = useCallback(({ h, s, l }: { h: number; s: number; l: number }): string => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  const createColor = useCallback((hex: string): Color => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    return { hex, rgb, hsl };
  }, [hexToRgb, rgbToHsl]);

  // Color harmony generators
  const generateComplementary = useCallback((baseHex: string): Color[] => {
    const base = createColor(baseHex);
    const complement = createColor(hslToHex({ 
      h: (base.hsl.h + 180) % 360, 
      s: saturation[0], 
      l: lightness[0] 
    }));
    
    const variations = [];
    for (let i = 0; i < paletteSize - 2; i++) {
      const variation = createColor(hslToHex({
        h: base.hsl.h,
        s: saturation[0] + (i * 10 - 20),
        l: lightness[0] + (i * 15 - 30)
      }));
      variations.push(variation);
    }
    
    return [base, complement, ...variations];
  }, [createColor, hslToHex, saturation, lightness, paletteSize]);

  const generateAnalogous = useCallback((baseHex: string): Color[] => {
    const base = createColor(baseHex);
    const colors = [base];
    
    for (let i = 1; i < paletteSize; i++) {
      const color = createColor(hslToHex({
        h: (base.hsl.h + (i * 30)) % 360,
        s: saturation[0],
        l: lightness[0] + (i % 2 === 0 ? 10 : -10)
      }));
      colors.push(color);
    }
    
    return colors;
  }, [createColor, hslToHex, saturation, lightness, paletteSize]);

  const generateTriadic = useCallback((baseHex: string): Color[] => {
    const base = createColor(baseHex);
    const color2 = createColor(hslToHex({ 
      h: (base.hsl.h + 120) % 360, 
      s: saturation[0], 
      l: lightness[0] 
    }));
    const color3 = createColor(hslToHex({ 
      h: (base.hsl.h + 240) % 360, 
      s: saturation[0], 
      l: lightness[0] 
    }));
    
    const variations = [];
    for (let i = 0; i < paletteSize - 3; i++) {
      const variation = createColor(hslToHex({
        h: base.hsl.h,
        s: saturation[0] + (i * 15 - 15),
        l: lightness[0] + (i * 20 - 20)
      }));
      variations.push(variation);
    }
    
    return [base, color2, color3, ...variations];
  }, [createColor, hslToHex, saturation, lightness, paletteSize]);

  const generateMonochromatic = useCallback((baseHex: string): Color[] => {
    const base = createColor(baseHex);
    const colors = [];
    
    for (let i = 0; i < paletteSize; i++) {
      const color = createColor(hslToHex({
        h: base.hsl.h,
        s: saturation[0] + (i * 5),
        l: 20 + (i * (80 / (paletteSize - 1)))
      }));
      colors.push(color);
    }
    
    return colors;
  }, [createColor, hslToHex, saturation, paletteSize]);

  // Generate all palette types
  const generatePalettes = useCallback(() => {
    const newPalettes: ColorPalette[] = [
      {
        id: 'complementary',
        name: 'Complementary',
        type: 'complementary',
        colors: generateComplementary(baseColor)
      },
      {
        id: 'analogous',
        name: 'Analogous',
        type: 'analogous',
        colors: generateAnalogous(baseColor)
      },
      {
        id: 'triadic',
        name: 'Triadic',
        type: 'triadic',
        colors: generateTriadic(baseColor)
      },
      {
        id: 'monochromatic',
        name: 'Monochromatic',
        type: 'monochromatic',
        colors: generateMonochromatic(baseColor)
      }
    ];
    
    setPalettes(newPalettes);
    setActivePalette(newPalettes[0]);
  }, [baseColor, generateComplementary, generateAnalogous, generateTriadic, generateMonochromatic]);

  // Generate palettes when dependencies change
  useEffect(() => {
    generatePalettes();
  }, [generatePalettes]);

  // Accessibility functions
  const getContrastRatio = useCallback((color1: Color, color2: Color): number => {
    const getLuminance = (rgb: { r: number; g: number; b: number }) => {
      const { r, g, b } = rgb;
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const lum1 = getLuminance(color1.rgb);
    const lum2 = getLuminance(color2.rgb);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }, []);

  const getAccessibilityLevel = useCallback((ratio: number): { level: string; badge: string } => {
    if (ratio >= 7) return { level: 'AAA', badge: 'excellent' };
    if (ratio >= 4.5) return { level: 'AA', badge: 'good' };
    if (ratio >= 3) return { level: 'AA Large', badge: 'fair' };
    return { level: 'Fail', badge: 'poor' };
  }, []);

  // Color blindness simulation
  const simulateColorBlindness = useCallback((color: Color, type: ColorBlindnessType): string => {
    if (type === 'none') return color.hex;
    
    const { r, g, b } = color.rgb;
    let newR = r, newG = g, newB = b;
    
    switch (type) {
      case 'protanopia': // Red-blind
        newR = 0.567 * r + 0.433 * g;
        newG = 0.558 * r + 0.442 * g;
        newB = 0.242 * g + 0.758 * b;
        break;
      case 'deuteranopia': // Green-blind
        newR = 0.625 * r + 0.375 * g;
        newG = 0.7 * r + 0.3 * g;
        newB = 0.3 * g + 0.7 * b;
        break;
      case 'tritanopia': // Blue-blind
        newR = 0.95 * r + 0.05 * g;
        newG = 0.433 * g + 0.567 * b;
        newB = 0.475 * g + 0.525 * b;
        break;
    }
    
    const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
    const toHex = (val: number) => clamp(val).toString(16).padStart(2, '0');
    
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  }, []);

  // Export functions
  const exportPalette = useCallback((format: ExportFormat) => {
    if (!activePalette) return;
    
    let content = '';
    const colors = activePalette.colors;
    
    switch (format) {
      case 'css':
        content = `:root {\n${colors.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join('\n')}\n}`;
        break;
      case 'scss':
        content = colors.map((color, i) => `$color-${i + 1}: ${color.hex};`).join('\n');
        break;
      case 'tailwind':
        content = `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n        palette: {\n${colors.map((color, i) => `          ${i + 1}: '${color.hex}',`).join('\n')}\n        }\n      }\n    }\n  }\n}`;
        break;
      case 'json':
        content = JSON.stringify({
          name: activePalette.name,
          type: activePalette.type,
          colors: colors.map((color, i) => ({
            name: `color-${i + 1}`,
            hex: color.hex,
            rgb: color.rgb,
            hsl: color.hsl
          }))
        }, null, 2);
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${activePalette.name.toLowerCase()}.${format === 'json' ? 'json' : format === 'tailwind' ? 'js' : 'css'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Palette exported as ${format.toUpperCase()}`);
  }, [activePalette]);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    });
  }, []);

  const randomizeBase = useCallback(() => {
    const randomHue = Math.floor(Math.random() * 360);
    const randomColor = hslToHex({ h: randomHue, s: 70, l: 50 });
    setBaseColor(randomColor);
  }, [hslToHex]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4 flex items-center justify-center gap-3">
          <Palette className="h-10 w-10 text-blue-600" />
          Color Palette Generator & Picker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Create beautiful, accessible color palettes with AI-powered harmony algorithms. 
          Export to CSS, check accessibility, and test for color blindness.
        </p>
      </div>

      {/* Base Color Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Base Color</span>
            <Button
              variant="outline"
              size="sm"
              onClick={randomizeBase}
              className="flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Random
            </Button>
          </CardTitle>
          <CardDescription>
            Choose your base color to generate harmonious palettes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Color Picker</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-700 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-mono"
                      placeholder="#3B82F6"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(baseColor, 'Base color')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Saturation: {saturation[0]}%</Label>
                <Slider
                  value={saturation}
                  onValueChange={setSaturation}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Lightness: {lightness[0]}%</Label>
                <Slider
                  value={lightness}
                  onValueChange={setLightness}
                  max={100}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Palette Size: {paletteSize} colors</Label>
                <Slider
                  value={[paletteSize]}
                  onValueChange={(value) => setPaletteSize(value[0])}
                  max={8}
                  min={3}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Palette Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generated Palettes</CardTitle>
          <CardDescription>
            Choose from different color harmony types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {palettes.map((palette) => (
              <div
                key={palette.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  activePalette?.id === palette.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setActivePalette(palette)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{palette.name}</h3>
                  <Badge variant={activePalette?.id === palette.id ? 'default' : 'outline'}>
                    {palette.colors.length} colors
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1 aspect-square rounded-lg relative group cursor-pointer"
                      style={{ backgroundColor: colorBlindness === 'none' ? color.hex : simulateColorBlindness(color, colorBlindness) }}
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(color.hex, 'Color');
                      }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                        <Copy className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="absolute bottom-1 left-1 right-1 text-xs font-mono text-center bg-black bg-opacity-50 text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {color.hex}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools and Analysis */}
      <Tabs defaultValue="accessibility" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="colorblind">Color Blind Test</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
        </TabsList>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Analysis</CardTitle>
              <CardDescription>
                WCAG compliance check for text readability
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activePalette && (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {activePalette.colors.map((bg, bgIndex) => 
                      activePalette.colors.map((fg, fgIndex) => {
                        if (bgIndex === fgIndex) return null;
                        
                        const contrast = getContrastRatio(bg, fg);
                        const accessibility = getAccessibilityLevel(contrast);
                        
                        return (
                          <div
                            key={`${bgIndex}-${fgIndex}`}
                            className="flex items-center justify-between p-4 rounded-lg border"
                            style={{ backgroundColor: bg.hex, color: fg.hex }}
                          >
                            <div>
                              <div className="font-semibold">Sample Text</div>
                              <div className="text-sm opacity-75">Contrast: {contrast.toFixed(2)}</div>
                            </div>
                            <Badge 
                              variant={accessibility.badge === 'excellent' ? 'default' : 
                                     accessibility.badge === 'good' ? 'default' :
                                     accessibility.badge === 'fair' ? 'outline' : 'destructive'}
                            >
                              {accessibility.level}
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Color Blind Test Tab */}
        <TabsContent value="colorblind">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Color Blindness Simulation</span>
                <Select value={colorBlindness} onValueChange={(value: ColorBlindnessType) => setColorBlindness(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Normal Vision</SelectItem>
                    <SelectItem value="protanopia">Protanopia (Red-blind)</SelectItem>
                    <SelectItem value="deuteranopia">Deuteranopia (Green-blind)</SelectItem>
                    <SelectItem value="tritanopia">Tritanopia (Blue-blind)</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
              <CardDescription>
                Test how your palette appears to users with color vision deficiencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activePalette && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Normal Vision</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {activePalette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg flex items-end p-2"
                            style={{ backgroundColor: color.hex }}
                          >
                            <span className="text-xs font-mono bg-black bg-opacity-50 text-white px-1 rounded">
                              {color.hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {colorBlindness !== 'none' && (
                      <div>
                        <h4 className="font-semibold mb-3">
                          {colorBlindness === 'protanopia' ? 'Protanopia (Red-blind)' :
                           colorBlindness === 'deuteranopia' ? 'Deuteranopia (Green-blind)' :
                           'Tritanopia (Blue-blind)'}
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {activePalette.colors.map((color, index) => {
                            const simulatedColor = simulateColorBlindness(color, colorBlindness);
                            return (
                              <div
                                key={index}
                                className="aspect-square rounded-lg flex items-end p-2"
                                style={{ backgroundColor: simulatedColor }}
                              >
                                <span className="text-xs font-mono bg-black bg-opacity-50 text-white px-1 rounded">
                                  {simulatedColor}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Palette</CardTitle>
              <CardDescription>
                Export your palette in various formats for development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={() => exportPalette('css')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  CSS Variables
                </Button>
                
                <Button
                  onClick={() => exportPalette('scss')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  SCSS Variables
                </Button>
                
                <Button
                  onClick={() => exportPalette('tailwind')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  Tailwind Config
                </Button>
                
                <Button
                  onClick={() => exportPalette('json')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Download className="h-4 w-4" />
                  JSON Data
                </Button>
              </div>
              
              {activePalette && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="font-semibold mb-2">Color Values</h4>
                  <div className="space-y-2 text-sm font-mono">
                    {activePalette.colors.map((color, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>color-{index + 1}</span>
                        </div>
                        <div className="flex gap-4 text-xs">
                          <span>HEX: {color.hex}</span>
                          <span>RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}</span>
                          <span>HSL: {Math.round(color.hsl.h)}, {Math.round(color.hsl.s)}%, {Math.round(color.hsl.l)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inspiration Tab */}
        <TabsContent value="inspiration">
          <Card>
            <CardHeader>
              <CardTitle>Color Inspiration</CardTitle>
              <CardDescription>
                Popular color combinations and design tips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Color Theory Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Use 60-30-10 rule: 60% primary, 30% secondary, 10% accent</li>
                    <li>• Warm colors advance, cool colors recede</li>
                    <li>• High contrast for important elements</li>
                    <li>• Test on different screens and lighting</li>
                    <li>• Consider cultural color meanings</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Accessibility Guidelines</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• AA: 4.5:1 contrast for normal text</li>
                    <li>• AAA: 7:1 contrast for enhanced readability</li>
                    <li>• Large text: 3:1 minimum contrast</li>
                    <li>• Avoid red-green only distinctions</li>
                    <li>• Test with color blindness simulators</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}