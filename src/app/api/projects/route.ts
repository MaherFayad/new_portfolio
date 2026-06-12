import { NextResponse } from "next/server";
import { PROJECTS } from "@/data/projects";

export async function GET() {
  return NextResponse.json(PROJECTS);
}
