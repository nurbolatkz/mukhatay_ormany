import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // Use 127.0.0.1 for local communication between front/back on the same server
  const backendUrl = process.env.INTERNAL_BACKEND_URL || "http://127.0.0.1:5000";
  
  // Clean up ID if it has .pdf extension
  const cleanId = id.replace('.pdf', '');
  const targetUrl = `${backendUrl}/certificates/${cleanId}.pdf`;
  
  console.log(`[Proxy] Fetching certificate from: ${targetUrl}`);
  
  try {
    const response = await fetch(targetUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[Proxy] Backend returned ${response.status} for ${targetUrl}`);
      return new NextResponse("Certificate file not found on backend", { status: 404 });
    }

    const blob = await response.blob();
    const headers = new Headers();
    
    headers.set("Content-Type", "application/pdf");
    // This header forces the browser to download instead of opening
    headers.set("Content-Disposition", `attachment; filename="certificate-${cleanId}.pdf"`);

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("[Proxy] Connection error:", error.message);
    return new NextResponse(`Backend connection failed: ${error.message}`, { status: 502 });
  }
}
