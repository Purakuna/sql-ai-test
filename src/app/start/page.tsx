
"use server";

import { getStudentInSession } from "@/lib/controllers/StudentController";
import { redirect } from "next/navigation";
import StartExamForm from "@/ui/components/StartExamForm";

export default async function StartPage() {
    const student = await getStudentInSession();
    
    if (student) {
      redirect("/");
    }
    
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <StartExamForm />
        </div>
    )
}
