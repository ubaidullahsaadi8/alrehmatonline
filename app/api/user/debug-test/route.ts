import { NextRequest, NextResponse } from "next/server"


let requestCounter = 0;

export async function PUT(req: NextRequest) {
  console.log("Debug Test API - Request received");
  
  try {
    
    requestCounter++;
    console.log(`Debug Test API - Request count: ${requestCounter}`);
    
    
    let body;
    try {
      body = await req.json();
      console.log("Debug Test API - Request body:", body);
    } catch (error) {
      console.error("Debug Test API - Error parsing JSON:", error);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    
    
    if (requestCounter === 1) {
      console.log("Debug Test API - First request, will succeed");
      return NextResponse.json({
        success: true,
        message: "First request successful",
        requestCount: requestCounter,
        currency: body.currency || "USD"
      });
    } else {
      
      if (requestCounter >= 5) {
        requestCounter = 0;
      }
      
      console.log("Debug Test API - Subsequent request, will demonstrate error");
      return NextResponse.json({
        error: "Simulated error for subsequent requests",
        requestCount: requestCounter
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Debug Test API - Uncaught error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
