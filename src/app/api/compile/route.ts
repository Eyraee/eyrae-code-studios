import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, language, stdin } = body;

    // 1. Map to Paiza's exact compiler IDs
    const paizaMap: Record<string, string> = {
      python: "python3", 
      javascript: "javascript",
      typescript: "typescript",
      java: "java", 
      c: "c",
      cpp: "cpp", 
      go: "go", 
      rust: "rust",
      php: "php",
      swift: "swift",
      csharp: "csharp"
    };

    const compilerId = paizaMap[language];

    if (!compilerId) {
      return NextResponse.json({ error: `Compiler engine not mapped for ${language}` }, { status: 400 });
    }

    console.log(`[Proxy] Sending ${language} to Paiza Engine...`);

    // 2. Step One: Create the Sandbox on Paiza
    const createRes = await fetch("https://api.paiza.io/runners/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code: code,
        language: compilerId,
        input: stdin || "",
        api_key: "guest",
        longpoll: true,
        longpoll_timeout: 100
      })
    });

    const createData = await createRes.json();
    
    if (createData.error) {
      return NextResponse.json({ error: `Paiza API Error: ${createData.error}` }, { status: 500 });
    }

    const runnerId = createData.id;

    // 3. Step Two: Wait for Execution (Polling)
    let details;
    for (let i = 0; i < 15; i++) { // Wait up to 15 seconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      const detailsRes = await fetch(`https://api.paiza.io/runners/get_details?id=${runnerId}&api_key=guest`);
      details = await detailsRes.json();
      
      if (details.status === "completed") {
        break;
      }
    }

    if (details?.status !== "completed") {
      return NextResponse.json({ error: "Execution Timed Out on Paiza Cluster" }, { status: 504 });
    }

    // 4. Translate Paiza's output format to match what our frontend page.tsx expects!
    let responsePayload: any = { status: details.result };

    if (details.build_result === "failure" || details.build_result === "error") {
        responsePayload.compiler_error = details.build_stderr || details.build_stdout || "Unknown Build Error";
    } else if (details.result !== "success") {
        responsePayload.program_error = details.stderr || "Program crashed or timed out.";
    } else {
        responsePayload.program_output = details.stdout || "";
    }

    // Send perfectly formatted data back to your browser
    return NextResponse.json(responsePayload);

  } catch (error: any) {
    console.error("[Proxy] Critical Server Error:", error.message);
    return NextResponse.json({ 
        error: `Next.js Server Proxy Crash: ${error.message}` 
    }, { status: 500 });
  }
}