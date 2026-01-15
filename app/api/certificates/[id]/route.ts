import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
  
  // Clean up ID if it has .pdf extension
  const cleanId = id.replace('.pdf', '');
  
  try {
    const response = await fetch(`${backendUrl}/certificates/${cleanId}.pdf`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    const blob = await response.blob();
    const headers = new Headers();
    
    headers.set("Content-Type", "application/pdf");
    headers.set("Content-Disposition", `attachment; filename="certificate-${cleanId}.pdf"`);

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
