"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Code2, Play, Terminal, Layers, Palette, Maximize2, Minimize2, LayoutPanelLeft } from "lucide-react";
import styles from "./workspace.module.css";

interface Language {
  id: string;
  name: string;
  version: string;
  extension: string;
  monacoLang: string;
  iconColor: string;
  boilerplate: string;
  icon: React.ReactNode;
}

const LANGUAGES: Language[] = [
  {
    id: "python", name: "Python", version: "v3.10", extension: "main.py", monacoLang: "python", iconColor: "#38bdf8",
    boilerplate: `def greet(name):\n    print(f"🚀 Welcome to Eyrae Studios, {name}!")\n\n# Take input from the custom stdin box on the right!\nuser_input = input("Enter your name: ")\ngreet(user_input)`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm-1 5.5c.4 0 .8.3.8.8v1.5h-1.5v-1.5c0-.4.3-.8.8-.8zm4 7c0 .4-.3.8-.8.8h-1.5c-.4 0-.8-.3-.8-.8v-1.5c0-.4.3-.8.8-.8h1.5c.4 0 .8.3.8.8v1.5zm-6-3.2h6v1.5h-6v-1.5z" fill="#38bdf8"/></svg>
  },
  {
    id: "javascript", name: "JavaScript", version: "ES2026", extension: "index.js", monacoLang: "javascript", iconColor: "#facc15",
    boilerplate: `function greet(name) {\n    console.log("⚡ Hello from Eyrae Studios, " + name + "!");\n}\n\ngreet("Developer");`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="4" fill="#facc15"/><path d="M11.2 16.5c0 .7-.2 1.2-.6 1.5-.4.3-1 .5-1.8.5-.6 0-1.1-.1-1.5-.3v-1.7c.3.2.7.3 1.1.3.5 0 .8-.3.8-.8v-5.2h2v5.7zm5.3-.2c0 .5-.2.9-.5 1.2-.3.3-.8.4-1.5.4-.6 0-1.2-.2-1.6-.5l.6-1.5c.4.3.8.4 1.1.4.4 0 .6-.1.6-.4 0-.6-2.1-.4-2.1-2.2 0-.6.2-1 .6-1.3.4-.3.9-.4 1.6-.4.5 0 1 .1 1.4.3l-.5 1.5c-.3-.1-.6-.2-.9-.2-.3 0-.5.1-.5.3 0 .6 2.1.3 2.1 2.1z" fill="#000000"/></svg>
  },
  {
    id: "typescript", name: "TypeScript", version: "v5.4", extension: "app.ts", monacoLang: "typescript", iconColor: "#3178c6",
    boilerplate: `const greet = (name: string): void => {\n    console.log(\`⚔️ Strict type execution live: \${name}\`);\n};\n\ngreet("Eyrae Architect");`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="4" fill="#3178c6"/><path d="M7 10h5v1.5H9.5V18H8v-6.5H7V10zm9.3 6.3c0 .5-.2.9-.5 1.2-.3.3-.8.4-1.5.4-.6 0-1.2-.2-1.6-.5l.6-1.5c.4.3.8.4 1.1.4.4 0 .6-.1.6-.4 0-.6-2.1-.4-2.1-2.2 0-.6.2-1 .6-1.3.4-.3.9-.4 1.6-.4.5 0 1 .1 1.4.3l-.5 1.5c-.3-.1-.6-.2-.9-.2-.3 0-.5.1-.5.3 0 .6 2.1.3 2.1 2.1z" fill="#ffffff"/></svg>
  },
  {
    id: "java", name: "Java", version: "JDK 21", extension: "Main.java", monacoLang: "java", iconColor: "#f97316",
    boilerplate: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("☕ Formatted production Java system ready.");\n        Scanner scanner = new Scanner(System.in);\n        if(scanner.hasNext()) {\n            System.out.println("Received input: " + scanner.nextLine());\n        }\n    }\n}`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M6 16c0 2 3.5 3 6 3s6-1 6-3-3.5-2-6-2-6 1-6 2z" fill="#e24329"/><path d="M10.5 13c0 1 2 1.5 3.5 1.5s3.5-.5 3.5-1.5-2-1-3.5-1-3.5.5-3.5 1.5z" fill="#f8a307"/><path d="M12 3c0 0-1 2 1 4s2 4 0 6c0 0 3-2 2-5s-3-3-3-5z" fill="#3178c6"/></svg>
  },
  {
    id: "c", name: "C", version: "GCC 11", extension: "main.c", monacoLang: "c", iconColor: "#a8b9cc",
    boilerplate: `#include <stdio.h>\n\nint main() {\n    printf("🎯 Compiled C program running natively.\\n");\n    char input[100];\n    if (scanf("%99s", input) == 1) {\n        printf("You typed: %s\\n", input);\n    }\n    return 0;\n}`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M15 5.5A6.5 6.5 0 0 0 8.5 12a6.5 6.5 0 0 0 6.5 6.5c1.8 0 3.4-.7 4.6-1.9l-1.5-1.5c-.8.8-1.9 1.4-3.1 1.4-2.5 0-4.5-2-4.5-4.5S12.5 7.5 15 7.5c1.2 0 2.3.6 3.1 1.4l1.5-1.5C18.4 6.2 16.8 5.5 15 5.5z" fill="#a8b9cc"/></svg>
  },
  {
    id: "cpp", name: "C++", version: "GCC 14", extension: "main.cpp", monacoLang: "cpp", iconColor: "#60a5fa",
    boilerplate: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "🎯 Compiled assembly running natively." << endl;\n    string input;\n    if(cin >> input) {\n        cout << "You typed: " << input << endl;\n    }\n    return 0;\n}`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="12" fill="#004482"/><path d="M11.5 14.5c-.8 0-1.5-.3-2-.8s-.7-1.2-.7-2 .2-1.5.7-2 1.2-.8 2-.8c.6 0 1.1.1 1.5.4l-.5 1.2c-.3-.2-.6-.3-.9-.3-.4 0-.8.1-1 .4-.3.3-.4.7-.4 1.2s.1.9.4 1.2c.2.3.6.4 1 .4.4 0 .7-.1 1-.3l.5 1.1c-.4.3-1 .4-1.6.4zm4.5-3V10h1v1.5H18.5v1H17V14h-1v-1.5h-1.5v-1H16zm3.5 0V10h1v1.5H22v1h-1.5V14h-1v-1.5H18v-1h1.5z" fill="#ffffff"/></svg>
  },
  {
    id: "go", name: "Go", version: "v1.22", extension: "main.go", monacoLang: "go", iconColor: "#00acd7",
    boilerplate: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("🐹 Go routines initialized.")\n}`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M14 2h-4v3H6v4H2v6h4v4h4v3h4v-3h4v-4h4V9h-4V5h-4V2zm4 11c0 2.2-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4v-2c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v2z" fill="#00acd7"/></svg>
  },
  {
    id: "rust", name: "Rust", version: "v1.76", extension: "main.rs", monacoLang: "rust", iconColor: "#ce422b",
    boilerplate: `fn main() {\n    println!("🦀 Memory safe execution starting.");\n}`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5" stroke="#ce422b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  },
  {
    id: "php", name: "PHP", version: "v8.3", extension: "index.php", monacoLang: "php", iconColor: "#777bb4",
    boilerplate: `<?php\n  echo "🐘 Elephant backend processing online.";\n?>`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><ellipse cx="12" cy="12" rx="10" ry="6" fill="#777bb4"/><path d="M9 10h2v4H9zm4 0h3c1 0 1.5.5 1.5 1.5S17 13 16 13h-1v1h-2v-4z" fill="#ffffff"/></svg>
  },
  {
    id: "swift", name: "Swift", version: "v5.10", extension: "main.swift", monacoLang: "swift", iconColor: "#f05138",
    boilerplate: `import Foundation\n\nprint("🍎 Swift runtime compiled successfully.")`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M21 14c-1.5-2.5-4-4.5-6.5-5.5 2.5-1 4-3 4.5-5.5-2 1-4 1.5-6.5 1.5C10 4.5 8.5 3 6 3c1.5 3 1.5 6.5 3 9.5-2 1.5-4.5 1-6.5-.5 2.5 3 6 4.5 9.5 4.5 3.5 0 7-1.5 9-3.5z" fill="#f05138"/></svg>
  },
  {
    id: "csharp", name: "C#", version: "v12.0", extension: "Program.cs", monacoLang: "csharp", iconColor: "#179287",
    boilerplate: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("💠 .NET Core framework loaded.");\n    }\n}`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" fill="#179287"/><path d="M9 9v6h2V9H9zm4 0v6h2V9h-2z" fill="#ffffff"/></svg>
  },
  {
    id: "html", name: "HTML", version: "HTML5", extension: "index.html", monacoLang: "html", iconColor: "#e34f26",
    boilerplate: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Eyrae Web Canvas</title>\n  \n</head>\n<body>\n  <div class="glow-box">\n    <h1>🌐 DOM Rendered Successfully</h1>\n    <p>Edit the HTML and CSS tabs to build your interface.</p>\n  </div>\n</body>\n</html>`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M4 2l1.5 17L12 22l6.5-3L20 2H4zm8 14.5l-4-1 1-3.5 3 1 3-1 1-3.5-4-1z" fill="#e34f26"/></svg>
  },
  {
    id: "css", name: "CSS", version: "CSS3", extension: "styles.css", monacoLang: "css", iconColor: "#264de4",
    boilerplate: `/* 🎨 Global Studio Styles */\nbody {\n  background-color: #050507;\n  color: #ffffff;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n\n.glow-box {\n  text-align: center;\n  padding: 2rem;\n  border-radius: 12px;\n  background: rgba(255,255,255,0.05);\n  border: 1px solid rgba(255,255,255,0.1);\n  box-shadow: 0 0 30px rgba(56, 189, 248, 0.2);\n}\n\nh1 {\n  margin: 0 0 10px 0;\n  color: #38bdf8;\n}`,
    icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M20 2l-1.5 17L12 22l-6.5-3L4 2h16zm-8 14.5l4-1-1-3.5-3-1-3 1-1 3.5 4 1z" fill="#264de4"/></svg>
  }
];

export default function Home() {
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  const [codeMap, setCodeMap] = useState<Record<string, string>>(() => {
    const initialMap: Record<string, string> = {};
    LANGUAGES.forEach(lang => { initialMap[lang.id] = lang.boilerplate; });
    return initialMap;
  });
  
  const [output, setOutput] = useState<string>("👋 Studio initialized.\nSelect an environment on the left and hit 'Run Code'.");
  const [customInput, setCustomInput] = useState<string>(""); 
  const [isError, setIsError] = useState<boolean>(false); 
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<"dark" | "midnight" | "ocean" | "hacker">("dark");
  const [rightPanelTab, setRightPanelTab] = useState<"terminal" | "preview">("terminal");
  const [mounted, setMounted] = useState<boolean>(false);

  // 1. AUTO-SAVE MEMORY: Load from Local Storage on initial boot
  useEffect(() => {
    setMounted(true);
    const savedCode = localStorage.getItem("eyrae_code_map");
    if (savedCode) {
      try {
        setCodeMap(JSON.parse(savedCode));
      } catch (e) {
        console.error("Failed to parse saved session.");
      }
    }
  }, []);

  // 2. AUTO-SAVE MEMORY: Save silently on every keystroke
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("eyrae_code_map", JSON.stringify(codeMap));
    }
  }, [codeMap, mounted]);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    if (lang.id !== "html" && lang.id !== "css") {
      setRightPanelTab("terminal"); // Auto-switch back to terminal for real languages
    }
  };

  const handleCodeChange = (val: string | undefined) => {
    if (val === undefined) return;
    setCodeMap(prev => ({ ...prev, [selectedLang.id]: val }));
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const cycleTheme = () => {
    const themes: ("dark" | "midnight" | "ocean" | "hacker")[] = ["dark", "midnight", "ocean", "hacker"];
    setThemeMode(prev => themes[(themes.indexOf(prev) + 1) % themes.length]);
  };

  const getThemeStyles = () => {
    switch(themeMode) {
      case "midnight": return { bg: "#000000", glow: `radial-gradient(circle, ${selectedLang.iconColor}30 0%, rgba(0,0,0,0) 60%)` };
      case "ocean": return { bg: "#020813", glow: `radial-gradient(circle, #0ea5e940 0%, #38bdf810 50%, rgba(0,0,0,0) 70%)` };
      case "hacker": return { bg: "#020603", glow: `radial-gradient(circle, #22c55e40 0%, #16a34a10 50%, rgba(0,0,0,0) 70%)` };
      default: return { bg: "#0A0A0F", glow: `radial-gradient(circle, ${selectedLang.iconColor}35 0%, ${selectedLang.iconColor}10 40%, rgba(0,0,0,0) 70%)` };
    }
  };
  
  const themeStyles = getThemeStyles();

  // 3. PRO SHORTCUTS: Bind Ctrl+Enter inside the Monaco Editor
  const handleEditorMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      document.getElementById("run-code-btn")?.click();
    });
  };

  const executeCode = async () => {
    setIsRunning(true);
    setIsError(false);
    
    // THE WEB CANVAS CATCH: Intercept HTML/CSS instantly
    if (selectedLang.id === "html" || selectedLang.id === "css") {
      setRightPanelTab("preview");
      setIsError(false);
      setOutput(`✅ Web Canvas updated successfully!`);
      setIsRunning(false);
      return;
    }

    setRightPanelTab("terminal");
    setOutput("🚀 Routing code through Next.js Internal API Proxy...");

    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeMap[selectedLang.id],
          language: selectedLang.id,
          stdin: customInput 
        })
      });

      const data = await response.json();

      if (data.error) {
         setIsError(true);
         setOutput(`[Proxy/System Error]\n${data.error}`);
      } else if (data.compiler_error) {
        setIsError(true);
        setOutput(`[Compilation Error]\n${data.compiler_error}`);
      } else if (data.program_error) {
        setIsError(true);
        setOutput(`[Runtime Error]\n${data.program_error}`);
      } else if (data.program_output !== undefined) {
        setOutput(data.program_output || "Execution finished cleanly (No STDOUT).");
      } else {
        setIsError(true);
        setOutput(`[Execution Halted] Status: ${data.status}`);
      }
    } catch (error) {
      setIsError(true);
      setOutput("❌ Critical Network Error: Could not reach internal /api/compile route. Did you create the folder structure correctly?");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className={styles.studioContainer} style={{ backgroundColor: themeStyles.bg }}>
      <div className={styles.ambientGlow} style={{ background: themeStyles.glow }} />

      {/* HEADER BANNER - Hidden during Focus Mode */}
      {!isMaximized && (
        <header className={`${styles.glassPanel} ${styles.header}`}>
          <div className={styles.branding}>
            <div className={styles.logoBox}>
              <Code2 style={{ width: "24px", height: "24px", color: "#fff" }} /> {/* Developer Logo Upgrade */}
            </div>
            <div className={styles.titleGroup}>
              <h1>Eyrae Code Studios</h1>
              <p>Cloud Development Core</p>
            </div>
          </div>
          <div className={styles.actionRow}>
            <button 
              type="button"
              className={styles.themeButton}
              onClick={cycleTheme}
              style={{ 
                borderColor: themeMode !== "dark" ? "#8b5cf650" : "",
                boxShadow: themeMode !== "dark" ? "0 0 15px rgba(139, 92, 246, 0.15)" : ""
              }}
            >
              <Palette size={16} style={{ color: themeMode === "ocean" ? "#38bdf8" : themeMode === "hacker" ? "#4ade80" : "#a855f7" }} />
              <span style={{ textTransform: "capitalize" }}>Theme: {themeMode}</span>
            </button>
          </div>
        </header>
      )}

      {/* PANELS WORKSPACE REGION */}
      <div className={styles.layoutGrid}>
        
        {/* SIDEBAR NAVIGATION */}
        {!isMaximized && (
          <aside className={`${styles.glassPanel} ${styles.sidebar}`}>
            <div className={styles.sidebarTitle}>
              <Layers size={14} />
              Environments
            </div>
            {LANGUAGES.map((lang) => {
              const isActive = selectedLang.id === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`${styles.langTab} ${isActive ? styles.activeTab : ""}`}
                  style={{ 
                    color: isActive ? lang.iconColor : "",
                    borderColor: isActive ? `${lang.iconColor}40` : ""
                  }}
                >
                  <div className={styles.langTabLeft}>
                    <div className={styles.langIcon}>{lang.icon}</div>
                    <span>{lang.name}</span>
                  </div>
                  <span className={styles.tabVersion}>{lang.version}</span>
                </button>
              )
            })}
          </aside>
        )}

        {/* COMPILER FRAME & TERMINAL */}
        <div style={{ flex: 1, display: "flex", gap: "16px", height: "100%", minWidth: 0, position: "relative", zIndex: 20 }}>
          
          {/* EDITOR CANVAS BOX */}
          <div className={`${styles.glassPanel} ${styles.editorContainer}`}>
            <div className={styles.panelHeader}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className={styles.fileTabs} style={{ marginLeft: 0 }}>
                  <div className={styles.fileTab} style={{ borderColor: `${selectedLang.iconColor}50`, color: selectedLang.iconColor }}>
                    <span style={{ fontSize: '10px' }}>●</span>
                    {selectedLang.extension}
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button 
                  type="button" 
                  onClick={() => setIsMaximized(!isMaximized)} 
                  className={styles.themeButton} 
                  style={{ padding: "8px 14px", borderRadius: "10px" }}
                >
                  {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  <span>{isMaximized ? "Restore" : "Focus"}</span>
                </button>

                <button id="run-code-btn" type="button" onClick={executeCode} disabled={isRunning} className={styles.runButton} title="Shortcut: Ctrl+Enter">
                  <Play style={{ width: "14px", height: "14px", fill: "#fff", animation: isRunning ? 'spin 1s linear infinite' : 'none' }} />
                  {isRunning ? "Running..." : "Run Code (Ctrl+Enter)"}
                </button>
              </div>
            </div>
            
            <div className={styles.editorWrapper}>
              {mounted ? (
                <Editor
                  height="100%"
                  width="100%"
                  language={selectedLang.monacoLang}
                  theme={themeMode === "midnight" ? "hc-black" : "vs-dark"}
                  path={selectedLang.extension}
                  value={codeMap[selectedLang.id]}
                  onChange={handleCodeChange}
                  onMount={handleEditorMount} // Attaches the Ctrl+Enter listener
                  options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    lineHeight: 24,
                    lineNumbers: "on",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontLigatures: true,
                    automaticLayout: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    scrollBeyondLastLine: false,
                    padding: { top: 24 }
                  }}
                />
              ) : (
                <div style={{ padding: "40px", color: "#52525b", fontFamily: "monospace", fontSize: "13px" }}>
                  Booting Studio Core Graphics...
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONSOLE TERMINAL CONTAINER - Always visible */}
          <div className={`${styles.glassPanel} ${styles.consoleContainer}`}>
            
            {/* Custom Tab Header */}
            <div className={styles.panelHeader} style={{ padding: '0 16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  onClick={() => setRightPanelTab("terminal")} 
                  className={rightPanelTab === "terminal" ? styles.activePanelTab : styles.panelTab}
                >
                  <Terminal size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                  Terminal
                </button>
                <button 
                  onClick={() => setRightPanelTab("preview")} 
                  className={rightPanelTab === "preview" ? styles.activePanelTab : styles.panelTab}
                >
                  <LayoutPanelLeft size={14} style={{ display: 'inline', marginRight: '6px', marginBottom: '-2px' }} />
                  Web Canvas
                </button>
              </div>
            </div>
            
            {rightPanelTab === "terminal" ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px', overflowY: 'auto' }}>
                
                {/* Custom Standard Input Box */}
                <div style={{ marginBottom: '8px', fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>
                  Standard Input (stdin)
                </div>
                <textarea 
                  className={styles.inputArea} 
                  placeholder="Type your inputs here (e.g. variables for C++ cin or Python input()...)"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  spellCheck={false}
                />

                {/* Shell Formatted Output Screen */}
                <div style={{ marginTop: '8px', marginBottom: '8px', fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em' }}>
                  Shell Output (stdout)
                </div>
                
                {/* 4. Output Shell Formatting Upgrade */}
                <div className={`${styles.consoleScreen} ${isError ? styles.errorText : ""}`} style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', flex: 1, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', color: '#52525b', userSelect: 'none' }}>
                    <span style={{ color: '#22c55e' }}>➜</span>
                    <span style={{ color: '#0ea5e9' }}>~</span>
                    <span>./execute --lang {selectedLang.extension}</span>
                  </div>
                  {output.split('\n').map((line, index) => (
                    <div key={index} style={{ display: 'flex', gap: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                      <span style={{ color: '#52525b', userSelect: 'none', minWidth: '20px', textAlign: 'right' }}>{index + 1}</span>
                      <span style={{ color: isError ? '#ef4444' : '#d4d4d8', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{line}</span>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px' }}>
                {/* 1. Interactive Web Canvas iframe */}
                <div style={{ flex: 1, background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <iframe
                    title="Web Canvas Preview"
                    srcDoc={`<!DOCTYPE html><html><head><style>${codeMap.css || ""}</style></head><body>${codeMap.html || ""}</body></html>`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    sandbox="allow-scripts allow-modals"
                  />
                </div>
              </div>
            )}

            <div className={styles.bentoMetrics}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Status</span>
                <span className={styles.metricValue} style={{ color: isError ? '#ef4444' : isRunning ? '#eab308' : '#22c55e' }}>
                  {isRunning ? "Compiling" : isError ? "Failed" : "Ready"}
                </span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Engine</span>
                <span className={styles.metricValue}>{rightPanelTab === "preview" ? "DOM Renderer" : "Internal Proxy"}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}