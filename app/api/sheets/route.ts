import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL_ENV as string;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const sheetName = searchParams.get("sheetName");

  try {

    if (action === "decodeHash") {
      const hash = searchParams.get("hash");
      const res = await fetch(
        `${GOOGLE_SCRIPT_URL}?action=decodeHash&hash=${hash}`
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (action === "getFormTemplate") {
      const company = searchParams.get("company");
      const res = await fetch(
        `${GOOGLE_SCRIPT_URL}?action=getFormTemplate&company=${company}`
      );
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (!sheetName) {
      return NextResponse.json(
        { error: "sheetName required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${GOOGLE_SCRIPT_URL}?action=getStudents&sheetName=${sheetName}`
    );

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Request failed" },
      { status: 500 }
    );
  }
}