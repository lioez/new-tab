import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { 
  Code, 
  Copy, 
  ExternalLink, 
  FileJson, 
  FileCode, 
  CheckCircle, 
  AlertCircle,
  Chrome,
  Download,
  FileTerminal
} from "lucide-react";

const App = () => {
  const [targetUrl, setTargetUrl] = useState("https://www.google.com");
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Manifest V3 Config
  const manifestCode = JSON.stringify(
    {
      manifest_version: 3,
      name: "My Custom New Tab",
      version: "1.0",
      description: "Redirects new tab to a custom URL",
      chrome_url_overrides: {
        newtab: "newtab.html"
      },
      permissions: []
    },
    null,
    2
  );

  // Separate Script Logic (Required for CSP Compliance in MV3)
  const scriptCode = `// 立即跳转到目标页面
window.location.replace("${targetUrl || 'https://www.google.com'}");`;

  // Redirect HTML Logic (References external script)
  const htmlCode = `<!DOCTYPE html>
<html>
  <head>
    <title>New Tab</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      :root {
        --bg: #ffffff;
        --fg: #333333;
        --sub: #666666;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --bg: #1a1a1a;
          --fg: #e5e5e5;
          --sub: #a3a3a3;
        }
      }
      body {
        background-color: var(--bg);
        color: var(--fg);
        font-family: system-ui, -apple-system, sans-serif;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0;
        transition: background-color 0.3s;
      }
      .loader {
        width: 24px;
        height: 24px;
        border: 3px solid var(--sub);
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      .text {
        font-size: 14px;
        color: var(--sub);
        font-weight: 400;
        letter-spacing: 0.5px;
      }
      @keyframes rotation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
    <script src="script.js"></script>
  </head>
  <body>
    <div class="loader"></div>
    <div class="text">Redirecting...</div>
  </body>
</html>`;

  const copyToClipboard = (text: string, type: 'manifest' | 'html' | 'script') => {
    navigator.clipboard.writeText(text);
    if (type === 'manifest') {
      setCopiedManifest(true);
      setTimeout(() => setCopiedManifest(false), 2000);
    } else if (type === 'html') {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } else {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
            <Chrome className="w-8 h-8 text-blue-600" />
            新标签页扩展生成器
          </h1>
          <p className="text-slate-600">
            为 Chrome 和 Edge 浏览器生成自定义的新标签页跳转扩展
          </p>
        </div>

        {/* Configuration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</div>
            配置目标网址
          </h2>
          
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">你想要跳转到的网址</span>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-slate-50"
                />
                <a 
                  href={targetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  测试链接 <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </div>
              <div className="mt-3 p-3 bg-amber-50 text-amber-800 rounded-md text-sm border border-amber-100 flex gap-2 items-start">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>重要提示：</strong> 由于浏览器安全策略 (CSP)，JavaScript 逻辑必须放在单独的文件中。请务必下载下方的所有 <strong>3个文件</strong>。
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Code Generation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Manifest.json */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono text-sm font-medium text-slate-700">
                <FileJson className="w-4 h-4 text-amber-600" />
                manifest.json
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadFile('manifest.json', manifestCode)}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                  title="下载文件"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => copyToClipboard(manifestCode, 'manifest')}
                  className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  {copiedManifest ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex-1 overflow-auto h-64">
              <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap break-all">
                {manifestCode}
              </pre>
            </div>
          </div>

          {/* script.js */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono text-sm font-medium text-slate-700">
                <FileTerminal className="w-4 h-4 text-purple-600" />
                script.js
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadFile('script.js', scriptCode)}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                  title="下载文件"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => copyToClipboard(scriptCode, 'script')}
                  className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  {copiedScript ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex-1 overflow-auto h-64">
              <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap break-all">
                {scriptCode}
              </pre>
            </div>
          </div>

          {/* newtab.html */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2 font-mono text-sm font-medium text-slate-700">
                <FileCode className="w-4 h-4 text-blue-600" />
                newtab.html
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadFile('newtab.html', htmlCode)}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                  title="下载文件"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => copyToClipboard(htmlCode, 'html')}
                  className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  {copiedHtml ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-50 flex-1 overflow-auto h-64">
              <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap break-all">
                {htmlCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</div>
            安装步骤 (Chrome / Edge)
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">1</div>
              <div>
                <h3 className="font-medium text-slate-900">创建文件夹</h3>
                <p className="text-sm text-slate-600 mt-1">
                  在你的电脑上新建一个文件夹（例如 <code>my-new-tab</code>），将上面的 <strong>manifest.json</strong>, <strong>script.js</strong> 和 <strong>newtab.html</strong> (共3个文件) 下载并保存到这个文件夹中。
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">2</div>
              <div>
                <h3 className="font-medium text-slate-900">打开扩展管理页面</h3>
                <p className="text-sm text-slate-600 mt-1 mb-2">
                  在浏览器地址栏输入以下地址并回车：
                </p>
                <div className="flex gap-2 text-xs font-mono">
                  <code className="bg-slate-100 px-2 py-1 rounded border border-slate-200">chrome://extensions</code>
                  <span className="text-slate-400 self-center">或</span>
                  <code className="bg-slate-100 px-2 py-1 rounded border border-slate-200">edge://extensions</code>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">3</div>
              <div>
                <h3 className="font-medium text-slate-900">加载已解压的扩展程序</h3>
                <p className="text-sm text-slate-600 mt-1">
                  开启右上角的 <strong>“开发者模式”</strong>，然后点击 <strong>“加载已解压的扩展程序”</strong> (Load unpacked)，选择第 1 步中创建的文件夹。
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-md text-sm border border-blue-100">
              <strong>修复之前的错误：</strong> 如果你之前已经加载过这个扩展，请先删除它，或者覆盖旧文件后点击扩展卡片上的 <strong>刷新图标</strong> (↻)。
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);