"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Settings } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">School Management System</h1>
              {/* <p className="text-muted-foreground">Database Project</p> */}
            </div>
          </div>
          {/* <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:flex">
              MySQL Database
            </Badge>
            <Link href="/test">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Setup
              </Button>
            </Link>
          </div> */}
        </div>
      </div>
    </header>
  );
}
